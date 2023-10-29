import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from editor.models import SubDocument, RootDocument
from ws_api.scripts.delta import process_edit


class EditConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.doc_pk = self.scope["url_route"]["kwargs"]["doc_pk"]
        self.room_group_name = f"edit_{self.doc_pk}"

        root_doc = RootDocument.objects.filter(pk=self.doc_pk).first()
        sub_doc = SubDocument.objects.filter(pk=self.doc_pk).first()

        if root_doc:
            self.document = root_doc
            doc_obj = RootDocument
            self.is_root = True
        elif sub_doc:
            self.document = sub_doc
            doc_obj = SubDocument
            self.is_root = False
        else:
            await self.close()  # exit as provided document does not exist OR invalid Document model
            return

        if self.is_root:
            self.root_document = self.document
        else:
            self.root_document = await sync_to_async(RootDocument.objects.get)(pk=self.document.root_document_id)

        if (self.root_document.branch_owner_id != self.user.id) and not \
                (await sync_to_async(self.root_document.shared_uses.get)(pk=self.user.id)):
            await self.close()  # if requestor is not owner or shared user
            return

        # after guard clauses

        # join group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()  # add authentication

    async def disconnect(self, close_code):
        # exit edit group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        # editor MUST be owner of relative branch
        if self.user.id != self.document.branch_owner_id:
            await self.close()  # close connection if user is unauthorized to edit
            return

        print(text_data)
        edit_json = json.loads(text_data)

        # call helper to process edit
        processed = await sync_to_async(process_edit)(self.document, edit_json["deltas"])
        edit_json["deltas"] = processed
        edit_json["type"] = "doc_edit"

        await self.channel_layer.group_send(
            self.room_group_name, edit_json
        )

    async def doc_edit(self, event):
        edit_data = event

        # send to WS (repeat)
        await self.send(text_data=json.dumps(edit_data))

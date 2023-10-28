import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from main.models import User

from editor.models import SubDocument, RootDocument


class EditConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.doc_pk = self.scope["url_route"]["kwargs"]["doc_pk"]
        self.is_root = self.scope["url_route"]["kwargs"]["is_root"]  # if doc is root doc or sub
        self.root = self.scope

        if self.is_root:
            self.DocumentModel = RootDocument
        else:
            self.DocumentModel = SubDocument

        try:
            self.document = await sync_to_async(self.DocumentModel.objects.get)(pk=self.doc_pk)
        except self.DocumentModel.DoesNotExist:
            await self.close()  # exit as provided document does not exist OR invalid Document model
            return

        if (self.document.root_document.branch_owner != self.user) and not (
        self.document.root_document.shared_users.get(self.user)):
            await self.close()  # if requestor is not owner or shared user
            return

        # after guard clauses

        self.room_group_name = f"edit_{self.doc_pk}"

        # join group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()  # add authentication

    async def disconnect(self, close_code):
        # exit edit group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        # editor MUST be owner of relative branch
        if self.user != self.document.branch_owner:
            await self.close()  # close connection if user is unauthorized to edit
            return

        edit_json = json.loads(text_data)

        # call helper to process edit

        await self.channel_layer.group_send(
            self.room_group_name, edit_json
        )

    async def edit_msg(self, event):
        edit_data = event

        # send to WS (repeat)
        await self.send(text_data=json.dumps(edit_data))

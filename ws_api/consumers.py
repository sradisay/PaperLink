import json
from channels.generic.websocket import AsyncWebsocketConsumer


class EditConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.doc_pk = self.scope["url_route"]["kwargs"]["doc_pk"]
        self.room_group_name = f"edit_{self.doc_pk}"

        # join group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()  # add authentication

    async def disconnect(self, close_code):
        # exit edit group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        edit_json = json.loads(text_data)

        # call helper to process edit

        await self.channel_layer.group_send(
            self.room_group_name, edit_json
        )

    async def edit_msg(self, event):
        edit_data = event

        # send to WS (repeat)
        await self.send(text_data=json.dumps(edit_data))

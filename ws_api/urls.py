from django.contrib import admin
from django.urls import re_path, include
from . import views
from ws_api import consumers

ws_urlpatterns = [
    re_path(r"ws/edit/(?P<doc_pk>\w+)/$", consumers.EditConsumer.as_asgi())
]
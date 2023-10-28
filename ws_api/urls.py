from django.urls import re_path, path
from . import views
from ws_api import consumers

ws_urlpatterns = [
    re_path(r"ws/edit/(?P<doc_pk>\w+)-(?P<is_root>\w+)/$", consumers.EditConsumer.as_asgi())
]

urlpatterns = [
    path('create_document', views.create_doc, name='create_doc'),
]
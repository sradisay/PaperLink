from django.urls import re_path, path
from . import views
from ws_api import consumers

ws_urlpatterns = [
    re_path(r"ws/edit/(?P<doc_pk>\w+)/$", consumers.EditConsumer.as_asgi())
]

urlpatterns = [
    path('create_document', views.create_doc, name='create_doc'),
    path('get_child_docs', views.get_doc_tree, name='get_children'),
    path('get_document', views.get_document, name='get_document'),
    path('flatten_document', views.flatten_document, name='flatten_document')
]
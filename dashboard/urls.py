from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('rename', views.document_rename, name='document_rename'),
    path('delete', views.document_delete, name='document_delete'),

]
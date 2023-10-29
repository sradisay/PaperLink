from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path("<int:document_id>/", views.document_viewer, name="document-viewer"),
    path('version-history/<int:document_id>/', views.version_viewer, name='version-history'),
]
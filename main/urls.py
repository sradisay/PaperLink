from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.homepage, name='home'),
    path('register/', views.register, name='register'),
    path('info/', views.info, name='info'),

]
from django.contrib import admin
from .models import RootDocument, SubDocument

# Register your models here.
admin.site.register(RootDocument)
admin.site.register(SubDocument)

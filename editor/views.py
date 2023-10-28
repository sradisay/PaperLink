from django.shortcuts import render, get_object_or_404
from .models import RootDocument


# Create your views here.

def document_view(request, document_id):
    document = RootDocument.objects.get_object_or_404(id=document_id)
    return render(request, 'editor/editor.html', {"doc": document})




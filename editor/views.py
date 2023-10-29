from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from .models import RootDocument


# Create your views here.
def editor(request):
    return render(request, "editor/editor.html")


def document_viewer(request, document_id):

    if request.user.is_authenticated:
        document = get_object_or_404(RootDocument, id=document_id)
        return render(request, "editor/document_viewer.html", {"document": document})

    return render(request, "editor/document_viewer.html")

from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from .models import RootDocument


# Create your views here.


def document_viewer(request, document_id):

    if request.user.is_authenticated:
        document = get_object_or_404(RootDocument, id=document_id)
        return render(request, "editor/editor.html", {"document": document})

    return redirect("dashboard")

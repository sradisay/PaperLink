from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from .models import RootDocument


# Create your views here.


def document_viewer(request, document_id):

    if request.user.is_authenticated:

        document = get_object_or_404(RootDocument, id=document_id)
        if request.user == document.branch_owner:
            return render(request, "editor/document_viewer.html", {"document": document})

    return redirect("dashboard")


def version_viewer(request, document_id):

    if request.user.is_authenticated:

        document = get_object_or_404(RootDocument, id=document_id)
        if request.user == document.branch_owner:
            return render(request, "editor/version_viewer.html", {"document": document})

    return redirect("dashboard")

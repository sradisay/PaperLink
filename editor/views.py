from django.http import HttpResponse
from django.shortcuts import render


# Create your views here.
def editor(request):
    return render(request, "editor/editor.html")

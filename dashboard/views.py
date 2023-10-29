from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404

from editor.models import RootDocument


# Create your views here.
def dashboard(request):
    if request.user.is_authenticated:
        documents = RootDocument.objects.filter(branch_owner=request.user)
        return render(request, 'dashboard/dashboard.html', {"documents": documents})

    return redirect("login")


def document_rename(request):
    if request.user.is_authenticated:
        document_id = request.GET.get("document_id")
        new_name = request.GET.get("new_name")

        document = get_object_or_404(RootDocument, pk=document_id)
        document.name = new_name
        document.save()
        return JsonResponse({"msg": "Success"}, status=200)
    return redirect({"msg": "Failed"}, status=400)


def document_delete(request):
    if request.user.is_authenticated:
        document_id = request.GET.get("document_id")
        document = get_object_or_404(RootDocument, pk=document_id)
        document.delete()
        return JsonResponse({"msg": "Success"}, status=200)
    return redirect({"msg": "Failed"}, status=400)

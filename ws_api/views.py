from django.shortcuts import render

# Create your views here.

from django.contrib.auth.decorators import login_required
from editor.models import SubDocument, RootDocument
from django.http import HttpResponseBadRequest, JsonResponse

base_doc = {"deltas": {}}


@login_required()
def create_doc(request):
    parent = request.GET.get("parent")
    name = request.GET.get("name")

    if not parent:
        doc = RootDocument.objects.create(
            name=name,
            branch_owner_id=request.user.id,
            document=base_doc
        )
        doc.save()
        return JsonResponse({"id": doc.id})
    else:
        try:
            parent_document = RootDocument.objects.get(pk=parent)
            doc = SubDocument.objects.create(
                name=name,
                root_document=parent_document,
                branch_owner_id=request.user.id,
                document=base_doc
            )
            doc.save()
            return JsonResponse({"id": doc.id})
        except RootDocument.DoesNotExist:
            pass

        try:
            parent_document = SubDocument.objects.get(pk=parent)
            doc = SubDocument.objects.create(
                name=name,
                root_document=parent_document,
                branch_owner_id=request.user.id,
                document=base_doc
            )
            doc.save()
            return JsonResponse({"id": doc.id})
        except SubDocument.DoesNotExist:
            pass

    return JsonResponse({"msg": "invalid parent doc"}, status=400)
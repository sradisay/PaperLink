from django.shortcuts import render

# Create your views here.

from django.contrib.auth.decorators import login_required
from editor.models import SubDocument, RootDocument
from django.http import HttpResponseBadRequest, JsonResponse
from editor.models import SubDocument, RootDocument
from ws_api.scripts.subsearch import sub_search
from ws_api.scripts.getdoc import doc_exists

base_doc = {"deltas": []}


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


@login_required()
def get_doc_tree(request):
    parent = request.GET.get("parent")
    try:
        document = RootDocument.objects.get(pk=parent)
    except RootDocument.DoesNotExist:
        return JsonResponse({"msg": "invalid parent doc"}, status=400)

    if request.user.id != document.branch_owner.id and not document.shared_users.get(pk=request.user.id):
        return JsonResponse({"msg": "unauthorized"}, status=403)

    documents = sub_search(document)

    return JsonResponse(documents)


@login_required()
def get_document(request):
    doc_pk = request.GET.get("doc_id")
    root_doc = RootDocument.objects.filter(pk=doc_pk).first()
    sub_doc = SubDocument.objects.filter(pk=doc_pk).first()
    if root_doc:
        doc = root_doc
        doc_obj = RootDocument
    elif sub_doc:
        doc = sub_doc
        doc_obj = RootDocument
    else:
        return JsonResponse({"msg": "invalid doc"}, status=400)

    if request.user.id != doc.branch_owner.id and not doc.shared_users.get(pk=request.user.id):
        return JsonResponse({"msg": "unauthorized"}, status=403)

    return JsonResponse(doc.document)

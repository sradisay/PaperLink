from django.db import models
from main.models import User


# Create your models here.


"""
Document Models

Structured as a tree of branches

RootDocument (main)
    -> SubDocument
        ->  SubDocument.1
            -> ...
    -> SubDocument1
        -> ...

"""


class SubDocument(models.Model):
    root_document = models.ForeignKey('RootDocument', on_delete=models.CASCADE)
    branch_owner = models.ForeignKey(User, on_delete=models.CASCADE)  # User from either user or shared_users
    document = models.JSONField()
    sub_branches = models.ManyToManyField(blank=True, to="self")


class RootDocument(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)
    branch_owner = models.ForeignKey(User, on_delete=models.CASCADE)
    shared_users = models.ManyToManyField(blank=True, to=User, related_name="root_document_shares")  # Shared Users

    document = models.JSONField()
    sub_branches = models.ManyToManyField(blank=True, to=SubDocument)

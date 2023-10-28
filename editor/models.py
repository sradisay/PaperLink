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
    branch_owner = models.ForeignKey(User, on_delete=models.CASCADE)  # User from either user or shared_users
    document = models.JSONField()
    sub_branches = models.ManyToManyField(to="self")


class RootDocument(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Document Owner (main branch owner)
    shared_users = models.ManyToManyField(to=User, related_name="root_document_shares")  # Shared Users

    document = models.JSONField()
    sub_branches = models.ManyToManyField(to=SubDocument)

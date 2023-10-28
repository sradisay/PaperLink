from django.db import models
from main.models import User


# Create your models here.


"""
Document Models

Structured as a tree of branches

RootDocument (main)
    -> SubDocument
        ->  SubDocument2
            -> ...
    -> SubDocument3
        -> ...

"""


class SubDocument(models.Model):
    branch_owner = models.ForeignKey(User, on_delete=models.CASCADE)  # User from either user or shared_users
    document = models.JSONField(default={})
    sub_branches = models.ManyToManyField(blank=True, null=True, to="self")


class RootDocument(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Document Owner (main branch owner)
    shared_users = models.ManyToManyField(blank=True, null=True, to=User)  # Shared Users

    document = models.JSONField(default={})
    sub_branches = models.ManyToManyField(blank=True, null=True, to=SubDocument)

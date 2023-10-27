from django.db import models
from main.models import User


# Create your models here.

class Document(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Document Owner




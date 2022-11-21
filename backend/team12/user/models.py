from django.contrib.auth.models import AbstractUser
from django.db import models
from tag.models import Tag

# TODO: customize User. Add fields (Favor, History, Tag)
class User(AbstractUser):
  tags = models.ManyToManyField(Tag, verbose_name="tags")
  class Meta:
    db_table = 'user'
from django.contrib.auth.models import AbstractUser
from django.db import models
from tag.models import Tag

# TODO: customize User. Add fields (Favor, History, Tag)
class User(AbstractUser):
  tags = models.models.ManyToManyField(Tag, verbose_name=_(""))
  class Meta:
    db_table = 'user'
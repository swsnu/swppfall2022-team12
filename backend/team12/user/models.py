from django.contrib.auth.models import AbstractUser


# TODO: customize User. Add fields (Favor, History, Tag)
class User(AbstractUser):

     class Meta:
         db_table = 'user'
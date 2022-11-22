from django.contrib.auth.models import AbstractUser
from django.db import models
from tag.models import Tag

class User(AbstractUser):
	tags = models.ManyToManyField(Tag, related_name="tags")
	email = models.EmailField(
        verbose_name='email',
        max_length=255,
        unique=True,
    )
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username', 'password']
	class Meta:
		db_table = 'user'
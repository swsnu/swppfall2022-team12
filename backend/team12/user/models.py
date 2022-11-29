from django.contrib.auth.models import AbstractUser
from django.db import models
from tag.models import Tag
from user.const import GENDER

class User(AbstractUser):
	tags = models.ManyToManyField(Tag, related_name="users")
	email = models.EmailField(
        verbose_name='email',
        max_length=255,
        unique=True,
    )
	ages = models.SmallIntegerField(default=20)
	gender = models.CharField(max_length=10, choices=GENDER, blank=True)
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username', 'password']
	class Meta:
		db_table = 'user'
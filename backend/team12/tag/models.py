from django.db import models

# Create your models here.


class Tag(models.Model):
    """
    Tag Model (Static)

        # Fields
        content (str): content of tags.
    """

    content = models.CharField(max_length=100)

# Generated by Django 4.1.2 on 2022-10-22 08:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='description',
            field=models.CharField(blank=True, max_length=1000),
        ),
        migrations.AddField(
            model_name='course',
            name='title',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]

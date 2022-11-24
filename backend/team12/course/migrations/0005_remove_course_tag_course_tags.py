# Generated by Django 4.1.2 on 2022-11-23 10:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tag', '0001_initial'),
        ('course', '0004_alter_course_author'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='tag',
        ),
        migrations.AddField(
            model_name='course',
            name='tags',
            field=models.ManyToManyField(to='tag.tag'),
        ),
    ]
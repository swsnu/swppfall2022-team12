# Generated by Django 4.1.2 on 2022-11-23 12:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("course", "0006_alter_course_tags"),
    ]

    operations = [
        migrations.AlterField(
            model_name="course",
            name="rate",
            field=models.FloatField(default=0),
        ),
    ]

from django.db import models
from course.const import CATEGORY, DRIVE


class Course(models.Model):
    """
    Course Model

        # Fields
        category (str): category of Course (DRIVE, BIKE, WALK).
        title (str): title of Course.
        description (str): description of Course.
        created_at (DateTime): Course's created at time.
        u_counts (int): numbers of Course's uses.
        e_time (Time): estimated time of Course.
        distance (int): Course's total distance (km)
    """
    id = models.AutoField(primary_key=True)
    category = models.CharField(choices=CATEGORY, default=DRIVE, max_length=10)
    title = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=1000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    u_counts = models.PositiveIntegerField(default=0)
    e_time = models.TimeField(null=True)
    distance = models.PositiveIntegerField(default=0)

class Point(models.Model):
    """
    Point Model

        # Fields
        course (Course): course
        pid (char): ID of Points.
        name (char): name of points. 
        longitude (int): longitude (ex. )
        latitude (int): latitude (ex. )
        idx (int): course points order
    """
    id = models.AutoField(primary_key=True)
    pid = models.CharField(max_length=50, blank=True)
    name = models.CharField(max_length=50, blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="points")
    longitude = models.CharField(max_length=30, blank=True)
    latitude = models.CharField(max_length=30, blank=True)
    idx = models.SmallIntegerField()

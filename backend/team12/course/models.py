from django.db import models
from course.const import CATEGORY, DRIVE


class Point(models.Model):
    """
    Point Model

        # Fields
        longitude (int): longitude (ex. )
        latitude (int): latitude (ex. )
    """
    
    longitude = models.DecimalField(decimal_places=7, max_digits=10)
    latitude = models.DecimalField(decimal_places=7, max_digits=9)


class Course(models.Model):
    """
    Course Model

        # Fields
        category (str): category of Course (DRIVE, BIKE, WALK).
        start (Point): longitude, latitude of Course's start point.
        layover (Point): longitude, latitude of Course's layover point.
        destination (Point): longitude, latitude of Course's destination point.
        title (str): title of Course.
        description (str): description of Course.
        created_at (DateTime): Course's created at time.
        u_counts (int): numbers of Course's uses.
        e_time (Time): estimated time of Course.
        distance (int): Course's total distance (km)
    """
    id = models.AutoField(primary_key=True)
    category = models.CharField(choices=CATEGORY, default=DRIVE, max_length=10)
    start = models.ForeignKey(Point, on_delete=models.SET_NULL, null=True, related_name="start")
    layover = models.ForeignKey(Point, on_delete=models.SET_NULL, null=True, related_name="layover")
    destination = models.ForeignKey(Point, on_delete=models.SET_NULL, null=True, related_name="destination")
    title = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=1000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    u_counts = models.PositiveIntegerField(default=0)
    e_time = models.TimeField(null=True)
    distance = models.PositiveIntegerField(default=0)
    



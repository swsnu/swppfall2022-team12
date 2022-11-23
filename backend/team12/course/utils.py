"""Utilities for Course API."""
from course.models import Course
from django.db.models import Avg

def reflect_rate(course_id):
    """Recalculate courses's rate."""
    course = Course.objects.get(id=course_id)
    course.rate = round(course.reviews.aggregate(Avg('rate'))['rate__avg'], 2)
    course.save()
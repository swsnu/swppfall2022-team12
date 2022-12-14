"""Utilities for Course API."""

from django.db.models import Avg
from course.models import Course, Point
from course.const import *
from tag.models import Tag


def reflect_rate(course_id):
    """Recalculate courses's rate."""
    course = Course.objects.get(id=course_id)
    course.rate = round(course.reviews.aggregate(Avg("rate"))["rate__avg"], 2)
    course.save()


def create_points(data: dict, course: Course):
    """Create markers and path of Point model."""
    points_list = []
    for idx, marker in enumerate(data["markers"]):
        points_list.append(
            Point(
                category=MARKER,
                name=marker.get("content", ""),
                image=marker.get("image", ""),
                course=course,
                longitude=marker["position"]["lng"],
                latitude=marker["position"]["lat"],
                idx=idx,
            )
        )
    for idx, path in enumerate(data["path"]):
        points_list.append(
            Point(
                category=PATH,
                course=course,
                longitude=path["lng"],
                latitude=path["lat"],
                idx=idx,
            )
        )
    Point.objects.bulk_create(points_list)


def set_tags(tags: list, course: Course):
    """Set Course Tags."""
    course.tags.clear()
    tags = list(Tag.objects.filter(id__in=tags))
    course.tags.set(tags)

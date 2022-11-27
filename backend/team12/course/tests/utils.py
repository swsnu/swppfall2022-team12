
from factory.django import DjangoModelFactory
from course.models import *
from random import randint, shuffle
from tag.models import Tag
from tag.utils import create_tags

test_tags = [2, 3, 4, 5, 6]

class CourseFactory(DjangoModelFactory):
    class Meta:
        model = Course

    @classmethod
    def create(cls, **kwargs):
        create_tags()
        nums = kwargs['nums']
        category = kwargs.get('category', DRIVE)
        courses = []
        for i in range(nums):
            c = Course.objects.create(
                    author = kwargs['author'],
                    category = category,
                    title = f"test title...{i}",
                    description = f"test description...{i}",
                    u_counts = i,
                    e_time = i*60,
                    distance = i*0.4,
                    rate=randint(1, 5)
            )
            shuffle(test_tags)
            c.tags.set(Tag.objects.filter(id__in=test_tags[:randint(1, 5)]))
            courses.append(c)
        points = []
        for course in courses:
            for i in range(3):
                points.append(
                    Point(
                        category = MARKER,
                        name = f"test marker...{i}",
                        image = f"test image...{i}",
                        course = course,
                        longitude = "127.10325874620656",
                        latitude = "37.40268656668587",
                        idx = i
                    )
                )
            for i in range(2):
                points.append(
                    Point(
                        category = PATH,
                        course = course,
                        longitude = "127.11902659769227",
                        latitude = "37.408363969648015",
                        idx = i
                    )
                )
        Point.objects.bulk_create(points)

        return courses

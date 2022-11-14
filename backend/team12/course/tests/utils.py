
from factory.django import DjangoModelFactory
from course.models import *

class CourseFactory(DjangoModelFactory):
    class Meta:
        model = Course

    @classmethod
    def create(cls, **kwargs):

        nums = kwargs['nums']
        category = kwargs.get('category', DRIVE)
        courses = []
        for i in range(nums):
            courses.append(
                Course.objects.create(
                    category = category,
                    title = f"test title...{i}",
                    description = f"test description...{i}",
                    u_counts = i,
                    e_time = "%02d:30" % (i),
                    distance = f"{i}"
            ))
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

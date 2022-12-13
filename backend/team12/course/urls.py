from django.urls import include, path
from rest_framework.routers import SimpleRouter
from course.views import CourseViewSet

app_name = "course"

router = SimpleRouter()
router.register("course", CourseViewSet, basename="course")

urlpatterns = [
    path("", include((router.urls))),
]

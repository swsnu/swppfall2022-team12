from django.urls import include, path
from rest_framework.routers import SimpleRouter
from rest_framework_simplejwt.views import TokenRefreshView
from user.views import UserViewSet

app_name = "user"

router = SimpleRouter()
router.register("user", UserViewSet, basename="user")

urlpatterns = [
    path("", include((router.urls))),
    path("user/refresh/", TokenRefreshView.as_view()),
]

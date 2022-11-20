from django.urls import include, path
from rest_framework.routers import SimpleRouter
from course.views import CourseViewSet
from course import views

app_name = 'course'

router = SimpleRouter() 
router.register('course', CourseViewSet, basename='course')

urlpatterns = [
    path('', include((router.urls))),
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
]
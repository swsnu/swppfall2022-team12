from django.contrib import admin
from django.urls import path, include
from user.views import token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('course.urls')),
    path('', include('review.urls')),
    path('', include('user.urls')),
    path('', include('tag.urls')),
    path('token/', token, name='token'),
]

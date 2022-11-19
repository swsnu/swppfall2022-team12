from django.urls import include, path
from rest_framework.routers import SimpleRouter
from review.views import ReviewViewSet

app_name = 'review'

router = SimpleRouter() 
router.register('review', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include((router.urls))),
]
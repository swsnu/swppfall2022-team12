from django.urls import include, path
from rest_framework.routers import SimpleRouter
from tag.views import TagViewSet

app_name = 'tag'

router = SimpleRouter() 
router.register('tag', TagViewSet, basename='tag')

urlpatterns = [
    path('', include((router.urls))),
]

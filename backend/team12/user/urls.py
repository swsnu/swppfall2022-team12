from django.urls import include, path
from user import views
app_name = 'user'

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('logout/', views.logout, name='signout'),
]
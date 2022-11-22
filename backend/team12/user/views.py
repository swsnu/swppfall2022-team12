from django.contrib.auth import authenticate, login, logout
from user.models import User
from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from user.models import User
from team12.exceptions import AuthentificationFailed, AnonymousError
from user.serializers import UserSerializer, UserCreateSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse, HttpResponseNotAllowed

# TODO: tag select.
class UserViewSet(viewsets.GenericViewSet):
    
    queryset = User.objects.all()
    permission_classes = []
    serializer_class = UserSerializer
    
    @action(methods=['POST'], detail=False)
    @transaction.atomic
    def signup(self, request):
       serializer = UserCreateSerializer(data=request.data)
       serializer.is_valid(raise_exception=True)
       user = serializer.save()
       return Response(self.get_serializer(user).data, status=status.HTTP_201_CREATED)
    
    @action(methods=['PUT'], detail=False)
    @transaction.atomic
    def login(self, request):
        data = request.data
        user = authenticate(
			request, 
			email=data.get('email', ""), 
			password=data.get('password', ""))
        if user is not None:
           login(request, user)
           return Response(self.get_serializer(user).data, status=status.HTTP_200_OK)
        else:
           raise AuthentificationFailed()
    
    @action(methods=['GET'], detail=False)
    def logout(self, request):
        if request.user.is_authenticated:
                logout(request)
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise AnonymousError
		
@ensure_csrf_cookie
def token(request):
  if request.method == 'GET':
      return HttpResponse("Check csrf token in cookies.", status=200)
  else:
      return HttpResponseNotAllowed(['GET'])

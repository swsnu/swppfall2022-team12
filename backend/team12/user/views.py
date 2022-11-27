from django.db import transaction
from django.http import HttpResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.contrib.auth import authenticate, login, logout

from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from team12.exceptions import AuthentificationFailed, AnonymousError

from user.models import User
from user.serializers import UserLoginSerializer, UserCreateSerializer

from course.serializers import CourseListSerializer
from course.const import *

from tag.models import Tag
import random

class UserViewSet(viewsets.GenericViewSet):
    
    queryset = User.objects.all()
    permission_classes = []
    serializer_class = UserLoginSerializer
    
    @csrf_exempt
    @action(methods=['POST'], detail=False)
    @transaction.atomic
    def signup(self, request):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        login(request, user)
        return Response(self.get_serializer(user).data, status=status.HTTP_201_CREATED)
    
    @transaction.atomic
    def update(self, request, pk=None):
        tags_ = request.data.get('tags', [])
        tags = list(Tag.objects.filter(id__in=tags_))
        request.user.tags.set(tags)
        return Response(self.get_serializer(request.user).data, status=status.HTTP_200_OK)
    
    @csrf_exempt
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
    
    @csrf_exempt
    @action(methods=['GET'], detail=False)
    def logout(self, request):
        if request.user.is_authenticated:
            logout(request)
            response = Response(status=status.HTTP_204_NO_CONTENT)
            response.delete_cookie('refreshtoken')
            return response
        else:
            raise AnonymousError
        
    @action(methods=['GET'], detail=False)
    def recommend(self, request):
        # TODO: remove ananoymous user cases.
        category = request.query_params.get("category", DRIVE)
        if request.user.is_authenticated:
            user = request.user
        else:
            user = User.objects.get(id=1)
        tags = user.tags.all()
        response = []
        if len(tags) == 0:
            tags = list(Tag.objects.all())
            random.shuffle(tags)
            tags = tags[:3]

        for tag in tags:
            response.append(
                {
                    "tag": tag.content,
                    "courses": CourseListSerializer(tag.courses.filter(category=category).all(), many=True).data
                }
            )
        return Response(response, status=status.HTTP_200_OK)


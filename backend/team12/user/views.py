from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout

from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from team12.exceptions import AuthentificationFailed, AnonymousError

from user.models import User
from user.serializers import UserLoginSerializer, UserCreateSerializer

from course.models import History, Course
from course.serializers import CourseListSerializer
from course.const import *

from tag.models import Tag

import random
from datetime import datetime, timedelta
from collections import Counter

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
    @action(methods=['PUT'], detail=False)
    def tags(self, request, pk=None):
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
        tags = list(user.tags.all())
        response = []
        if len(tags) == 0:
            tags = list(Tag.objects.all())
            random.shuffle(tags)
            tags = tags[:3]
        
        now = datetime.now()
        before = (now - timedelta(hours=2)).hour
        after = (now + timedelta(hours=2)).hour
        recommends = Counter(list(History.objects.filter(
                hours__lte=after, 
                hours__gte=before, 
                user__ages=user.ages, 
                user__gender=user.gender)\
                    .values_list('course', flat=True)))\
                    .most_common()

        for tag in tags:
            response.append(
                {
                    "tag": tag.content,
                    "courses": CourseListSerializer(tag.courses.filter(category=category).all(), many=True).data
                }
            )
        response.append(
            {
                "tag": "recommend",
                "courses": CourseListSerializer(list(map(lambda x: Course.objects.get(id=x[0]), recommends)), many=True).data
            }
        )
        return Response(response, status=status.HTTP_200_OK)


from django.db.models import Q, F
from django.db import transaction
from django.core.paginator import Paginator

from rest_framework import status, viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import action

from course.serializers import (
    CourseListSerializer,
    CourseDetailSerializer,
    CourseCreateSerializer,
    CourseUpdateSerializer,
)
from course.models import Course, History
from course.const import DRIVE
from course.utils import create_points, set_tags

from datetime import datetime
from team12.permissions import IsOwnerOrCreateReadOnly


class CourseViewSet(
    viewsets.GenericViewSet,
    generics.RetrieveDestroyAPIView,
):
    """
    Generic ViewSet of Course Object.
    """

    queryset = Course.objects.all()
    permission_classes = [IsOwnerOrCreateReadOnly]

    def get_serializer_class(self):
        if self.action in ["retrieve", "play"]:
            return CourseDetailSerializer
        elif self.action == "list":
            return CourseListSerializer
        elif self.action == "create":
            return CourseCreateSerializer
        elif self.action == "update":
            return CourseUpdateSerializer

    # POST /course
    #@transaction.atomic
    def create(self, request):
        """Create Course"""
        context = {
            "markers": request.data.get("markers", []),
            "path": request.data.get("path", []),
            "tags": request.data.get("tags", []),
        }
        data = request.data.copy()
        user_id = request.user.id
        data["author"] = user_id
        serializer = self.get_serializer(data=data, context=context)
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        return Response(CourseDetailSerializer(course).data, status=status.HTTP_200_OK)

    # DELETE /course/:courseId
    @transaction.atomic
    def destroy(self, request, pk=None):
        """Destroy Course"""
        return super().destroy(request, pk=None)

    # GET /course/:courseId
    def retrieve(self, request, pk=None):
        """Retrieve Course"""
        return super().retrieve(request, pk=None)

    # PUT /course/:courseId
    @transaction.atomic
    def update(self, request, pk=None):
        """Update Course"""
        course = self.get_object()
        data = request.data
        serializer = self.get_serializer(course, data=data)
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        if data.get("markers"):
            course.points.all().delete()
            create_points(data, course)
        if data.get("tags"):
            set_tags(data["tags"], course)
        return Response(CourseDetailSerializer(course).data, status=status.HTTP_200_OK)

    # GET /course/?category=(string)
    # &search_keyword=(string)
    # &filter=(string)
    def list(self, request):
        """List Courses"""
        page = request.GET.get("page", "1")
        category = request.query_params.get("category", DRIVE)
        search_keyword = request.query_params.get("search_keyword", "")
        f_param = request.query_params.get("filter", False)
        tags = request.query_params.getlist("tags", False)
        history = request.query_params.get("history", False)

        courses = Course.objects.filter(category=category)
        if history:
            courses = courses.filter(users__user=request.user)
        if search_keyword:
            courses = courses.filter(
                Q(title__icontains=search_keyword)
                | Q(description__icontains=search_keyword)
            )
        if tags:
            courses = courses.filter(tags__id__in=tags)
        courses = courses.order_by(F("created_at").desc())
        if f_param:
            if f_param == "use":
                courses = courses.order_by(F("u_counts").desc())
            elif f_param == "time_asc":
                courses = courses.order_by(F("e_time").asc(nulls_last=True))
            elif f_param == "time_desc":
                courses = courses.order_by(F("e_time").desc(nulls_last=True))
            elif f_param == "distance_asc":
                courses = courses.order_by(F("distance").asc(nulls_last=True))
            elif f_param == "distance_desc":
                courses = courses.order_by(F("distance").desc(nulls_last=True))

        courses = Paginator(courses, 20).get_page(page)
        return Response(
            self.get_serializer(courses, many=True).data, status=status.HTTP_200_OK
        )

    # PUT /course/:courseId/play
    @action(methods=["GET"], detail=True)
    @transaction.atomic
    def play(self, request, pk=None):
        course = self.get_object()
        course.u_counts += 1
        course.save()
        History.objects.create(
            user=request.user, course=course, hours=datetime.now().hour
        )
        return Response(self.get_serializer(course).data, status=status.HTTP_200_OK)

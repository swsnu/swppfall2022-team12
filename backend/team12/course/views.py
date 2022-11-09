from django.db.models import Q, F
from django.db import transaction
from django.core.paginator import Paginator
from rest_framework import status, viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from course.serializers import CourseListSerializer, CourseDetailSerializer, CourseSerializer, PointSerializer
from course.models import Course, Point
from team12.exceptions import FieldError
from course.const import DRIVE


class CourseViewSet(
        viewsets.GenericViewSet,
        generics.RetrieveDestroyAPIView,
        generics.CreateAPIView):
    """
    Generic ViewSet of Course Object.
    """
    queryset = Course.objects.all()
    permission_classes = []

    def get_serializer_class(self):
        if self.action in ["retrieve", "play"]:
            return CourseDetailSerializer
        elif self.action == "list":
            return CourseListSerializer
        elif self.action == "create":
            return CourseSerializer

    # POST /course
    @transaction.atomic
    def create(self, request):
        """Create Course"""
        context = {"points": request.data.get("points", [])}
        serializer = self.get_serializer(data=request.data, context=context)
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

    # GET /course/?category=(string)
    # &search_keyword=(string)
    # &filter=(string)
    def list(self, request):
        """List Courses"""
        page = request.GET.get('page', '1')
        category = request.query_params.get("category", DRIVE)
        search_keyword = request.query_params.get("search_keyword", "")
        f_param = request.query_params.get("filter", False)
        
        if not category:
            raise FieldError('query parameter missing [category]')
        
        courses = Course.objects.filter(category=category)
        if search_keyword:
            courses = courses.filter(
                Q(title__icontains=search_keyword) | 
                Q(description__icontains=search_keyword))
        courses = courses.order_by(F("created_at").desc())
        if f_param:
            print(f_param)
            if f_param == "use": courses = courses.order_by(F("u_counts").desc())
            elif f_param == "time_asc": courses = courses.order_by(F("e_time").asc(nulls_last=True))
            elif f_param == "time_desc": courses = courses.order_by(F("e_time").desc(nulls_last=True))
            elif f_param == "distance_asc": courses = courses.order_by(F("distance").asc(nulls_last=True))
            elif f_param == "distance_desc": courses = courses.order_by(F("distance").desc(nulls_last=True))
        
        courses = Paginator(courses, 20).get_page(page)
        return Response(self.get_serializer(courses, many=True).data, status=status.HTTP_200_OK)
    
    # PUT /course/:courseId/play
    @action(methods=['PUT'], detail=True)
    @transaction.atomic
    def play(self, request, pk=None):
        target = self.get_object()
        target.u_counts += 1
        target.save()
        return Response(self.get_serializer(target).data, status=status.HTTP_200_OK)
    
    @action(methods=['POST'], detail=False)
    def dummy(self, request):
        """Temporary view for create dummy courses."""
        category = request.data.get('category')
        nums = request.data.get('nums', 10)

        ids = []
        for i in range(nums):
            c = Course.objects.create(
                category=category if category else DRIVE,
                title = f"test title...{i}",
                description = f"test description...{i}",
                u_counts = i,
                distance = i
            )
            ids.append(c.id)
            Point.objects.create(
                course=c,
                latitude=37.513272317072,
                longitude=127.09431687965,
                idx=0
            )
            Point.objects.create(
                course=c,
                latitude=37.513272317072,
                longitude=127.09431687965,
                idx=1
            )
        return Response(ids, status=status.HTTP_200_OK)
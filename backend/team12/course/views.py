from django.db.models import Q, F
from django.db import transaction
from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from rest_framework import status, viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from course.serializers import CourseListSerializer, CourseDetailSerializer, CourseSerializer
from course.models import Course
from course.const import DRIVE
from django.shortcuts import get_object_or_404

def getUserDataFromReq(request):
    req_data = json.loads(request.body.decode())
    username = req_data['username']
    password = req_data['password']
    return username, password

def checkUnauthenticatedReq(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

def signup(request):
    if request.method == 'POST':
        username, password = getUserDataFromReq(request)
        User.objects.create_user(username=username, password=password)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

def signin(request):
    if request.method == 'POST':
        username, password = getUserDataFromReq(request)
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)

    else:
        return HttpResponseNotAllowed(['POST'])

def signout(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)

    else:
        return HttpResponseNotAllowed(['GET'])

class CourseViewSet(
        viewsets.GenericViewSet,
        generics.RetrieveDestroyAPIView,
    ):
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
        context = {
            "markers": request.data.get("markers", []),
            "path": request.data.get("path", [])
        }
        data = request.data.copy()
        data['author'] = request.user.id
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
    def update(self, request, pk=None):
        """Update Course"""
        course = get_object_or_404(Course, id=pk)
        course.delete()
        return self.create(request)

    # GET /course/?category=(string)
    # &search_keyword=(string)
    # &filter=(string)
    def list(self, request):
        """List Courses"""
        page = request.GET.get('page', '1')
        category = request.query_params.get("category", DRIVE)
        search_keyword = request.query_params.get("search_keyword", "")
        f_param = request.query_params.get("filter", False)
        
        courses = Course.objects.filter(category=category)
        if search_keyword:
            courses = courses.filter(
                Q(title__icontains=search_keyword) | 
                Q(description__icontains=search_keyword))
        courses = courses.order_by(F("created_at").desc())
        if f_param:
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
    
from django.db.models import Case, When, Q, Value, IntegerField, F
from django.db import transaction
from django.core.paginator import Paginator
from rest_framework import status, viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from course.serializers import CourseSerializer, CourseRetrieveSerializer
from course.models import Course
from typing import List
from team12.exceptions import NotFound


class CourseViewSet(
        viewsets.GenericViewSet,
        generics.RetrieveDestroyAPIView):
    """
    Generic ViewSet of Course Object.
    """
    queryset = Course.objects.all()
    permission_classes = []

    def get_serializer_class(self):
        if self.action in ["retrieve", "play"]:
            return CourseRetrieveSerializer
        elif self.action == "list":
            return CourseSerializer

    # POST /course
    @transaction.atomic
    def create(self, request):
        """Create Course"""
        return Response({}, status=status.HTTP_200_OK)


    # DELETE /course/:courseId
    @transaction.atomic
    def destroy(self, request, pk=None):
        """Destroy Course"""
        return super().destroy(request, pk=None)
    
    # GET /course/:courseId
    def retrieve(self, request, pk=None):
        """Retrieve Course"""
        return super().retrieve(request, pk=None)

    # GET /course/?search_type=(string)&search_keyword=(string)&major=(string)&credit=(string)
    def list(self, request):
        """List Courses"""
        
        return Response({}, status=status.HTTP_200_OK)
    
    # PUT /course/:courseId/play
    @action(methods=['PUT'], detail=True)
    @transaction.atomic
    def play(self, request, pk=None):
        try:
            target = self.queryset.get(pk=pk)
        except Course.DoesNotExist:
            return NotFound()
        target.u_counts += 1
        target.save()
        return Response(self.get_serializer(target).data, status=status.HTTP_200_OK)
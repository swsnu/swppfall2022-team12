from rest_framework import serializers
from course.models import *

class PointSerializer(serializers.ModelSerializer):
    """
    Point Model Serializer
    """
    class Meta:
        model = Point
        fields = (
            'latitude',
            'longitude'
        )

class CourseSerializer(serializers.ModelSerializer):
    """
    Course Model Serializer
    """
    class Meta:
        model = Course 
        fields = '__all__'

class CourseRetrieveSerializer(serializers.ModelSerializer):
    """
    Course Model Retrieve Serializer
    """
    start = serializers.SerializerMethodField()
    layover = serializers.SerializerMethodField()
    destination = serializers.SerializerMethodField()
    class Meta:
        model = Course 
        fields = (
            'start',
            'layover',
            'destination',
            'title',
            'description',
            'created_at',
            'u_counts',
            'e_time',
            'distance'
        )
    
    def get_start(self, course):
        return PointSerializer(course.start).data
    def get_layover(self, course):
        return PointSerializer(course.layover).data
    def get_destination(self, course):
        return PointSerializer(course.destination).data

class CourseListSerializer(serializers.ModelSerializer):
    """
    Course Model List Serializer
    """

    class Meta:
        model = Course 
        fields = (
            'id',
            'title',
            'description',
            'created_at',
            'u_counts',
            'e_time',
            'distance'
        )
    

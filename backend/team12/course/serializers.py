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
            'longitude',
            'idx'
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
    points = serializers.SerializerMethodField()
    class Meta:
        model = Course 
        fields = (
            'points',
            'title',
            'description',
            'created_at',
            'u_counts',
            'e_time',
            'distance'
        )
    
    def get_points(self, course):
        points = course.points.order_by('idx')
        return PointSerializer(points, many=True).data

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
    

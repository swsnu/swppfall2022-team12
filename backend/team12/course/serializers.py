from rest_framework import serializers
from course.models import *
from course.utils import create_points, set_tags
from team12.exceptions import FieldError
from tag.models import Tag

class MarkerSerializer(serializers.ModelSerializer):
    """
    Point Marker Model Serializer
    """
    position = serializers.SerializerMethodField()
    content = serializers.CharField(source='name')
    class Meta:
        model = Point
        fields = (
            'content',
            'image',
            'position',
            'idx'
        )
    
    def get_position(self, instance):
        return {
            'lat': float(instance.latitude),
            'lng': float(instance.longitude)
        }

class PathSerializer(serializers.ModelSerializer):
    """
    Point Path Model Serializer
    """
    lat = serializers.SerializerMethodField()
    lng = serializers.SerializerMethodField()
    class Meta:
        model = Point
        fields = (
            'lat',
            'lng',
            'idx'
        )

    def get_lat(self, instance):
        return float(instance.latitude)
    def get_lng(self, instance):
        return float(instance.longitude)
    
class CourseCreateSerializer(serializers.ModelSerializer):
    """
    Course Model Create Serializer
    """
    class Meta:
        model = Course 
        fields = (
            'author',
            'title',
            'description',
            'category',
            'u_counts',
            'e_time',
            'distance'
        )

    def validate(self, data):
        title = data.get('title')
        missing_fields = []
        if not title:
            missing_fields.append("title")
        
        description = data.get('description')
        if description:
            if not len(description) > 10:
                raise FieldError("description should be more than 10 characters.")
        else:
            missing_fields.append("description")

        e_time = data.get("e_time")
        if not e_time:
            missing_fields.append("e_time")
        distance = data.get("distance")
        if not distance:
            missing_fields.append("distance")

        markers = self.context.get("markers", [])
        if markers:
            if not len(markers) > 1:
                raise FieldError("markers should be more than 2.")
        else:
            missing_fields.append("markers")

        path = self.context.get("path", [])
        if not path:
            missing_fields.append("path")
        
        if len(missing_fields) > 0:
            raise FieldError(f"{missing_fields} fields missing.")
        return data

    def create(self, validated_data):
        course = Course.objects.create(**validated_data)
        create_points(self.context, course)
        set_tags(self.context['tags'], course)
        return course

class CourseDetailSerializer(serializers.ModelSerializer):
    """
    Course Model Detail Serializer
    """
    markers = serializers.SerializerMethodField()
    path = serializers.SerializerMethodField()
    p_counts = serializers.SerializerMethodField()
    author = serializers.CharField(source='author.username')
    tags = serializers.SerializerMethodField()
    class Meta:
        model = Course 
        fields = (
            'id',
            'author',
            'markers',
            'path',
            'p_counts',
            'title',
            'description',
            'created_at',
            'u_counts',
            'e_time',
            'distance',
            'tags',
            'rate'
        )
    
    def get_markers(self, course):
        markers = course.points.filter(category=MARKER).order_by('idx')
        return MarkerSerializer(markers, many=True).data

    def get_path(self, course):
        path = course.points.filter(category=PATH).order_by('idx')
        return PathSerializer(path, many=True).data

    def get_p_counts(self, course):
        return course.points.filter(category=MARKER).count()
    
    def get_tags(self, course):
        return course.tags.values_list('content', flat=True)
    

class CourseListSerializer(serializers.ModelSerializer):
    """
    Course Model List Serializer
    """
    author = serializers.CharField(source='author.username')
    class Meta:
        model = Course 
        fields = (
            'id',
            'author',
            'title',
            'description',
            'created_at',
            'u_counts',
            'e_time',
            'distance',
            'rate'
        )
    
class CourseUpdateSerializer(serializers.ModelSerializer):
    """
    Course Model Update Serializer
    """
    class Meta:
        model = Course
        fields = (
            'title',
            'description',
            'e_time',
            'distance'
        )
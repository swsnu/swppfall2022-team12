from rest_framework import serializers
from course.models import *
from team12.exceptions import FieldError

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
            'lat': instance.latitude,
            'lng': instance.longitude
        }

class PathSerializer(serializers.ModelSerializer):
    """
    Point Path Model Serializer
    """
    lat = serializers.CharField(source='latitude')
    lng = serializers.CharField(source='longitude')
    class Meta:
        model = Point
        fields = (
            'lat',
            'lng',
            'idx'
        )
    

class CourseSerializer(serializers.ModelSerializer):
    """
    Course Model Serializer
    """
    class Meta:
        model = Course 
        fields = (
            'title',
            'description',
            'category',
            'u_counts',
            'e_time',
            'distance'
        )
        extra_kwargs = {"e_time":{'format':'%H:%M'}}

    def validate(self, data):
        title = data.get('title')
        missing_fields = []
        if title:
            if not len(title) > 0:
                raise FieldError("title required.")
        else:
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
                if set(map(lambda x: tuple(x.keys()), markers)) != {('content', 'image', 'position')} or \
                    set(map(lambda x: tuple(x["position"].keys()), markers)) != {('lat', 'lng')}:
                    raise FieldError("markers keys must have 'content', 'image', 'position['lat' or 'lng']'.")
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
        points_list = []
        for idx, marker in enumerate(self.context['markers']):
            points_list.append(
                Point(
                    category=MARKER,
                    name=marker['content'],
                    image=marker['image'],
                    course=course,
                    longitude=marker['position']['lng'],
                    latitude=marker['position']['lat'],
                    idx=idx
                )
            )
        for idx, path in enumerate(self.context['path']):
            points_list.append(
                Point(
                    category=PATH,
                    course=course,
                    longitude=path['lng'],
                    latitude=path['lat'],
                    idx=idx
                )
            )
        Point.objects.bulk_create(points_list)
        return course

class CourseDetailSerializer(serializers.ModelSerializer):
    """
    Course Model Detail Serializer
    """
    markers = serializers.SerializerMethodField()
    path = serializers.SerializerMethodField()
    p_counts = serializers.SerializerMethodField()
    class Meta:
        model = Course 
        fields = (
            'id',
            'markers',
            'path',
            'p_counts',
            'title',
            'description',
            'created_at',
            'u_counts',
            'e_time',
            'distance'
        )
        extra_kwargs = {"e_time":{'format':'%H:%M'}}
    
    def get_markers(self, course):
        markers = course.points.filter(category=MARKER).order_by('idx')
        return MarkerSerializer(markers, many=True).data

    def get_path(self, course):
        path = course.points.filter(category=PATH).order_by('idx')
        return PathSerializer(path, many=True).data

    def get_p_counts(self, course):
        return course.points.filter(category=MARKER).count()

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
        extra_kwargs = {"e_time":{'format':'%H:%M'}}
    

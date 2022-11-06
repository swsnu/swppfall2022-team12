from rest_framework import serializers
from course.models import *
from team12.exceptions import FieldError

class PointSerializer(serializers.ModelSerializer):
    """
    Point Model Serializer
    """
    class Meta:
        model = Point
        fields = (
            'pid',
            'name',
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

        points = self.context.get("points", [])
        if points:
            if not len(points) > 1:
                raise FieldError("points should be more than 2.")
            else:
                if len(set(map(lambda x: tuple(x.keys()), points))) != 1 or \
                    set(points[0].keys())!={'name', 'pid', 'longitude', 'latitude'}:
                    raise FieldError("points keys must have 'name', 'pid', 'longitude', 'latitude'.")
        else:
            missing_fields.append("points")
        
        if len(missing_fields) > 0:
            raise FieldError(f"{missing_fields} fields missing.")
        return data

    def create(self, validated_data):
        course = Course.objects.create(**validated_data)
        points = self.context['points']
        points_list = []
        for idx, point in enumerate(points):
            points_list.append(
                Point(
                    pid=point['pid'],
                    name=point['name'],
                    course=course,
                    longitude=point['longitude'],
                    latitude=point['latitude'],
                    idx=idx
                )
            )
        Point.objects.bulk_create(points_list)
        return course

class CourseDetailSerializer(serializers.ModelSerializer):
    """
    Course Model Detail Serializer
    """
    points = serializers.SerializerMethodField()
    p_counts = serializers.SerializerMethodField()
    class Meta:
        model = Course 
        fields = (
            'id',
            'points',
            'p_counts',
            'title',
            'description',
            'created_at',
            'u_counts',
            'e_time',
            'distance'
        )
        extra_kwargs = {"e_time":{'format':'%H:%M'}}
    
    def get_points(self, course):
        points = course.points.order_by('idx')
        return PointSerializer(points, many=True).data
    def get_p_counts(self, course):
        return course.points.count()

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
    

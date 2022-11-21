from rest_framework import serializers
from review.models import Review
from user.models import User
from course.models import Course
from team12.exceptions import FieldError
from django.shortcuts import get_object_or_404

class ReviewSerializer(serializers.ModelSerializer):
    """
    Review Model List Serializer.
    """

    class Meta:
        model = Review 
        fields = (
            'content',
            'likes',
            'author',
            'rate',
            'created_at'
        )

class ReviewCreateSerializer(serializers.ModelSerializer):
    """
    Review Model Create Serializer.
    """

    class Meta:
        model = Review
        fields = (
            'author',
            'course',
            'rate',
            'content'
        )
    
    def validate(self, data):
        missing_fields = []
        if not data.get('course'):
            missing_fields.append('course')
        else: 
            _ = get_object_or_404(Course, id=data['course'])
        if not data.get('rate'):
            missing_fields.append('rate')
        else:
            if not 0 < data['rate'] < 6:
                raise FieldError("rate must be between 1 and 5.")
        if not data.get('content'):
            missing_fields.append('content')

        if len(missing_fields) > 0:
            raise FieldError(f"{missing_fields} fields missing.")
        return data
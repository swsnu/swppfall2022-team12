from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from user.models import User
from team12.exceptions import FieldError
from tag.models import Tag


class UserCreateSerializer(serializers.ModelSerializer):
    """
    User Model Create Serializer.
    """

    class Meta:
        model = User 
        fields = (
            'email',
            'password',
            'username'
        )
    
    def validate(self, data):
        missing_fields = []
        if not data.get('email'):
            missing_fields.append('email')
        if not data.get('username'):
            missing_fields.append('username')
        if not data.get('password'):
            missing_fields.append('password')

        if len(missing_fields) > 0:
            raise FieldError(f"{missing_fields} fields missing.")
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data['username']
        )
        tags = list(Tag.objects.filter(id__in=self.context['tags']))
        user.tags.set(tags)
        return user
    

class UserLoginSerializer(serializers.ModelSerializer):
    """
    User Model Login Serializer.
    """
    token = serializers.SerializerMethodField()

    class Meta:
        model = User 
        fields = (
            'email',
            'token'
        )
    
    def get_token(self, user):
        token = TokenObtainPairSerializer.get_token(user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        return {
            "access": access_token,
            "refresh": refresh_token
        }

    

class UserSerializer(serializers.ModelSerializer):
    """
    User Model Serializer.
    """
    tags = serializers.SerializerMethodField()

    class Meta:
        model = User 
        fields = (
            'email',
            'username',
            'tags'
        )

    def get_tags(self, instance):
        return instance.tags.values_list('content', flat=True)
    
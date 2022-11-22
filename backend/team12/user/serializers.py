from rest_framework import serializers
from user.models import User
from team12.exceptions import FieldError

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
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data['username']
        )

class UserSerializer(serializers.ModelSerializer):
    """
    User Model Serializer.
    """

    class Meta:
        model = User 
        fields = (
            'email',
            'username'
        )
    
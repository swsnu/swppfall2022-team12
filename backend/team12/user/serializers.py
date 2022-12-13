from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from user.models import User


class UserCreateSerializer(serializers.ModelSerializer):
    """
    User Model Create Serializer.
    """

    class Meta:
        model = User
        fields = ("email", "password", "ages", "gender", "username")

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserLoginSerializer(serializers.ModelSerializer):
    """
    User Model Login Serializer.
    """

    token = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("email", "username", "token", "tags")

    def get_token(self, user):
        token = TokenObtainPairSerializer.get_token(user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        return {"access": access_token, "refresh": refresh_token}

    def get_tags(self, user):
        return user.tags.values_list("id", flat=True)

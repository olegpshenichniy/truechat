from rest_framework import serializers

from .models import User, Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'avatar')


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'is_active', 'profile')

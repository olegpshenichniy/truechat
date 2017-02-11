from rest_framework import serializers
from django.core import exceptions
from django.contrib.auth import password_validation

from user.models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    password_repeat = serializers.CharField(max_length=128, required=True, label='Repeat password')

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password_repeat')

    def validate_password(self, password):
        password_validation.validate_password(password=password)
        return password

    def validate(self, attrs):
        try:
            # use django default validators
            password_validation.validate_password(password=attrs['password_repeat'])
            # compare passwords
            if attrs['password'] != attrs['password_repeat']:
                raise exceptions.ValidationError({'password_repeat': 'Does not equal password field.'})
        except exceptions.ValidationError as e:
            raise serializers.ValidationError(
                {'password_repeat': e.messages[0]}
            )
        return attrs

    def create(self, validated_data):
        del validated_data['password_repeat']

        return User.objects.create_user(**validated_data)

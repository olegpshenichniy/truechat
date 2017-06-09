from rest_framework import serializers

from .models import User, Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'avatar')


class UserListSerializer(serializers.ModelSerializer):
    profile_avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'profile_avatar')

    def get_profile_avatar(self, obj):
        try:
            return obj.profile.avatar_url
        except Profile.DoesNotExist as e:
            return None


class UserRetrieveUpdateSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile')


    def update(self, instance, validated_data):
        # http://www.django-rest-framework.org/api-guide/serializers/#writable-nested-representations
        # Unless the application properly enforces that this field is
        # always set, the follow could raise a `DoesNotExist`, which
        # would need to be handled.

        profile_validated_data = validated_data.pop('profile', None)

        if profile_validated_data:
            profile = instance.profile

            profile.avatar = profile_validated_data.get(
                'avatar',
                profile.avatar
            )

            profile.save()

        # save user
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()


        return instance
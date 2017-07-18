import numpy
from io import BytesIO
from PIL import Image

from rest_framework import serializers
from django.core import exceptions
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.contrib.auth import password_validation, get_user_model

from user.models import Profile


User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password_repeat = serializers.CharField(max_length=128, required=True, label='Repeat password')

    class Meta:
        model = User
        fields = ('id', 'chat_name', 'email', 'password', 'password_repeat')

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

        # generate username
        attrs['username'] = attrs['email'].replace('@', '_')

        return attrs

    def create(self, validated_data):
        del validated_data['password_repeat']
        validated_data.update({'is_active': False})

        # create profile instance
        user = User.objects.create_user(**validated_data)

        # generate random image
        imarray = numpy.random.rand(3, 3, 3) * 255
        im = Image.fromarray(imarray.astype('uint8')).convert('RGBA')
        im = im.resize((100, 100))

        # save to temp output
        im_io = BytesIO()
        im.save(im_io, format='PNG')
        im_io.seek(0)

        # create InMemoryUploadedFile to have ability save into django's ImageField without pain
        thumb_file = InMemoryUploadedFile(
            im_io,
            None,
            'generic_{}.png'.format(user.id),
            'image/png',
            im_io.getbuffer().nbytes,
            None
        )

        # create profile
        profile = Profile()
        profile.user = user
        profile.avatar = thumb_file
        profile.save()

        return user

import uuid
import base64
import random
import logging

import redis
from captcha.image import ImageCaptcha

from django.conf import settings
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.status import HTTP_503_SERVICE_UNAVAILABLE

from .serializers import CaptchaSerializer


logger = logging.getLogger(__name__)

pool = redis.ConnectionPool(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB)
redis_cli = redis.Redis(connection_pool=pool)


class RegistrationView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        return Response('register')


class GetCaptchaView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        rand_number = random.randint(1000, 9999)
        rand_operation = random.choice([i[0] for i in CaptchaSerializer.OPERATION_CHOICES])
        rand_second_number = random.randint(0, 20)
        secret_result = eval('{} {} {}'.format(rand_number, rand_operation, rand_second_number))

        image = ImageCaptcha()
        # create bytesio image
        data = image.generate(str(rand_number))
        # convert bytesio to base64
        base64image = base64.b64encode(data.getvalue())
        # from bytes to string
        base64image = base64image.decode("utf-8")

        serializer = CaptchaSerializer(data={
            'hash': str(uuid.uuid4()),
            'base64image': 'data:image/png;base64,{}'.format(base64image),
            'operation': rand_operation,
            'number': rand_second_number
        })

        if not serializer.is_valid():
            logger.error('CaptchaSerializer is not valid. Errors: {}'.format(serializer.errors))
            return Response(status=HTTP_503_SERVICE_UNAVAILABLE)

        # add hash and secret_result to the redis storage
        redis_cli.set(name=serializer.validated_data['hash'], value=secret_result, ex=90)

        return Response(serializer.validated_data)

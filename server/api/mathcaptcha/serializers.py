import logging

import redis

from rest_framework import serializers
from django.conf import settings


logger = logging.getLogger(__name__)

pool = redis.ConnectionPool(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB)
redis_cli = redis.Redis(connection_pool=pool)


class CaptchaSerializer(serializers.Serializer):
    OPERATION_CHOICES = (
        ('+', '+'),
        ('-', '-'),
        # ('/', '/'),
        # ('*', '*'),
    )

    key = serializers.CharField(max_length=100)
    base64image = serializers.CharField(max_length=100000)
    operation = serializers.ChoiceField(choices=OPERATION_CHOICES)
    number = serializers.IntegerField()


class CaptchaAnswerSerializer(serializers.Serializer):
    key = serializers.CharField(max_length=100)
    answer = serializers.IntegerField()

    def validate(self, attrs):
        # get answer
        answer = redis_cli.get(name=attrs['key'])

        if not answer:
            raise serializers.ValidationError({'key': 'Wrong or it was expired.'})

        if int(answer) != attrs['answer']:
            raise serializers.ValidationError({'answer': 'Wrong answer.'})

        return attrs

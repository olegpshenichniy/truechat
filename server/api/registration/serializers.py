from rest_framework import serializers


class CaptchaSerializer(serializers.Serializer):
    OPERATION_CHOICES = (
        ('+', '+'),
        ('-', '-'),
        # ('/', '/'),
        # ('*', '*'),
    )

    hash = serializers.CharField(max_length=100)
    base64image = serializers.CharField(max_length=100000)
    operation = serializers.ChoiceField(choices=OPERATION_CHOICES)
    number = serializers.IntegerField()
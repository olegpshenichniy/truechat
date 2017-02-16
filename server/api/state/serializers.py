from rest_framework import serializers
from django.utils.timezone import datetime


class StateSerializer(serializers.Serializer):
    """
    Contains information for the user.
    """
    is_anonymous = serializers.BooleanField(default=True)
    is_authenticated = serializers.BooleanField(default=False)
    datetime = serializers.DateTimeField(default=datetime.now())
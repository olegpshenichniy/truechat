import json

import redis
from rest_framework import serializers

from django.db.models import Q, Count
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'is_active')


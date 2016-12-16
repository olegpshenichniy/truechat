from rest_framework import generics
from rest_framework.exceptions import PermissionDenied, APIException, ParseError, NotFound

from django.contrib.auth.models import User

from .serializers import UserSerializer


class UserListAPIView(generics.ListAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_fields = ('id', 'username')

from rest_framework import generics
from rest_framework.exceptions import PermissionDenied, APIException, ParseError, NotFound

from .serializers import UserSerializer
from .models import User


class UserListAPIView(generics.ListAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_fields = ('id', 'username')

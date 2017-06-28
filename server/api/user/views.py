from rest_framework import generics
from rest_framework.exceptions import PermissionDenied, APIException, ParseError, NotFound

from .serializers import UserListSerializer, UserRetrieveUpdateSerializer
from .models import User


class UserListAPIView(generics.ListAPIView):
    model = User
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserListSerializer
    filter_fields = ('id', 'username')


class UserRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = UserRetrieveUpdateSerializer

    def update(self, request, *args, **kwargs):
        # only owner can update
        if request.user != self.get_object():
            raise PermissionDenied()

        return super(UserRetrieveUpdateAPIView, self).update(request, *args, **kwargs)


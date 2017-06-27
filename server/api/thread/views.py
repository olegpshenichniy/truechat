from rest_framework import generics
from rest_framework.exceptions import PermissionDenied, APIException, ParseError, NotFound

from django.conf import settings

from .models import PrivateThread, GroupThread
from .serializers import PrivateThreadListCreateSerializer, GroupThreadListCreateSerializer


class PrivateThreadListCreateAPIView(generics.ListCreateAPIView):
    model = PrivateThread
    serializer_class = PrivateThreadListCreateSerializer
    filter_fields = ('initiator',)

    def get_queryset(self):
        return PrivateThread.objects.filter(participants=self.request.user)


class GroupThreadListCreateAPIView(generics.ListCreateAPIView):
    model = GroupThread
    serializer_class = GroupThreadListCreateSerializer

    def get_queryset(self):
        return GroupThread.objects.filter(participants=self.request.user)



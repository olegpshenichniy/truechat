from rest_framework import generics
from rest_framework.exceptions import PermissionDenied, APIException, ParseError, NotFound

from django.conf import settings

from .models import PrivateThread, GroupThread
from .serializers import PrivateThreadListCreateSerializer, PrivateThreadRetrieveDestroySerializer
from .serializers import GroupThreadListCreateSerializer, GroupThreadRetrieveUpdateDestroySerializer


#########################
##### PrivateThread #####
#########################

class PrivateThreadListCreateAPIView(generics.ListCreateAPIView):
    model = PrivateThread
    serializer_class = PrivateThreadListCreateSerializer
    filter_fields = ('initiator',)

    def get_queryset(self):
        return PrivateThread.objects.filter(participants=self.request.user)


class PrivateThreadRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    model = PrivateThread
    serializer_class = PrivateThreadRetrieveDestroySerializer

    def get_queryset(self):
        return PrivateThread.objects.filter(participants=self.request.user)


    def delete(self, request, *args, **kwargs):
        # only participant can delete
        if request.user not in self.get_object().participants.all():
            raise PermissionDenied()

        return super(PrivateThreadRetrieveDestroyAPIView, self).delete(request, *args, **kwargs)


#######################
##### GroupThread #####
#######################

class GroupThreadListCreateAPIView(generics.ListCreateAPIView):
    model = GroupThread
    serializer_class = GroupThreadListCreateSerializer

    def get_queryset(self):
        return GroupThread.objects.filter(participants=self.request.user)


class GroupThreadRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    model = GroupThread
    serializer_class = GroupThreadRetrieveUpdateDestroySerializer

    def get_queryset(self):
        return GroupThread.objects.filter(participants=self.request.user)

    def delete(self, request, *args, **kwargs):
        # only owner can delete
        if request.user != self.get_object().owner:
            raise PermissionDenied()

        return super(GroupThreadRetrieveUpdateDestroyAPIView, self).delete(request, *args, **kwargs)

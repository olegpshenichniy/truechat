from rest_framework import generics
from rest_framework.exceptions import PermissionDenied

from django.utils.timezone import datetime

from .models import PrivateMessage, GroupMessage
from .serializers import PrivateMessageListCreateSerializer, PrivateMessageRetrieveUpdateDestroySerializer
from .serializers import GroupMessageListCreateSerializer, GroupMessageRetrieveUpdateDestroySerializer


##########################
##### PrivateMessage #####
##########################

class PrivateMessageListCreateAPIView(generics.ListCreateAPIView):
    model = PrivateMessage
    serializer_class = PrivateMessageListCreateSerializer
    filter_fields = ('thread',)

    def get_queryset(self):
        return PrivateMessage.objects.filter(thread__participants=self.request.user)

    def perform_create(self, serializer):
        instance = serializer.save()

        # update thread last message datetime
        instance.thread.last_message = datetime.now()
        instance.thread.save()



class PrivateMessageRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    model = PrivateMessage
    serializer_class = PrivateMessageRetrieveUpdateDestroySerializer

    def get_queryset(self):
        return PrivateMessage.objects.filter(thread__participants=self.request.user)

    def update(self, request, *args, **kwargs):
        if request.user != self.get_object().sender:
            raise PermissionDenied()

        return super(PrivateMessageRetrieveUpdateDestroyAPIView, self).update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if request.user != self.get_object().sender:
            raise PermissionDenied()

        return super(PrivateMessageRetrieveUpdateDestroyAPIView, self).delete(request, *args, **kwargs)


########################
##### GroupMessage #####
########################

class GroupMessageListCreateAPIView(generics.ListCreateAPIView):
    model = GroupMessage
    serializer_class = GroupMessageListCreateSerializer
    filter_fields = ('thread', 'sender', 'text')

    def get_queryset(self):
        return GroupMessage.objects.filter(thread__participants=self.request.user)


class GroupMessageRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    model = GroupMessage
    serializer_class = GroupMessageRetrieveUpdateDestroySerializer

    def get_queryset(self):
        return GroupMessage.objects.filter(thread__participants=self.request.user)

    def update(self, request, *args, **kwargs):
        if request.user != self.get_object().sender:
            raise PermissionDenied()

        return super(GroupMessageRetrieveUpdateDestroyAPIView, self).update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if request.user != self.get_object().sender:
            raise PermissionDenied()

        return super(GroupMessageRetrieveUpdateDestroyAPIView, self).delete(request, *args, **kwargs)

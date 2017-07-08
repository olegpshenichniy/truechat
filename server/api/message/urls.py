from django.conf.urls import url

from .views import PrivateMessageListCreateAPIView , PrivateMessageRetrieveUpdateDestroyAPIView
from .views import GroupMessageListCreateAPIView , GroupMessageRetrieveUpdateDestroyAPIView


urlpatterns = [

    url(r'^private/$', PrivateMessageListCreateAPIView.as_view(),
        name='private_message_list_create'),

    url(r'^private/(?P<pk>[0-9]+)/$', PrivateMessageRetrieveUpdateDestroyAPIView.as_view(),
        name='private_message_retrieve_update_destroy'),

    url(r'^group/$', GroupMessageListCreateAPIView.as_view(),
        name='group_message_list_create'),

    url(r'^group/(?P<pk>[0-9]+)/$', GroupMessageRetrieveUpdateDestroyAPIView.as_view(),
        name='group_message_retrieve_update_destroy'),
]

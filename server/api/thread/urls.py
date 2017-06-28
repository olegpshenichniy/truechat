from django.conf.urls import url

from .views import PrivateThreadListCreateAPIView, PrivateThreadRetrieveDestroyAPIView
from .views import GroupThreadListCreateAPIView, GroupThreadRetrieveUpdateDestroyAPIView


urlpatterns = [
    url(r'^private/$', PrivateThreadListCreateAPIView.as_view(),
        name='private_thread_list_create'),

    url(r'^private/(?P<pk>[0-9]+)/$', PrivateThreadRetrieveDestroyAPIView.as_view(),
        name='private_thread_retrieve_destroy'),

    url(r'^group/$', GroupThreadListCreateAPIView.as_view(),
        name='group_thread_list_create'),

    url(r'^group/(?P<pk>[0-9]+)/$', GroupThreadRetrieveUpdateDestroyAPIView.as_view(),
        name='group_thread_retrieve_update_destroy'),
]

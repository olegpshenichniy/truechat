from django.conf.urls import url

from .views import PrivateThreadListCreateAPIView, GroupThreadListCreateAPIView


urlpatterns = [
    url(r'^private/$', PrivateThreadListCreateAPIView.as_view(), name='private_thread_list_create'),
    url(r'^group/$', GroupThreadListCreateAPIView.as_view(), name='group_thread_list_create'),
]

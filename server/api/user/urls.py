from django.conf.urls import url

from .views import UserListAPIView, UserRetrieveUpdateAPIView


urlpatterns = [
    url(r'^$', UserListAPIView.as_view(), name='user_list'),
    url(r'^(?P<pk>[0-9]+)/$', UserRetrieveUpdateAPIView.as_view(), name='user_retrieve_update'),
]

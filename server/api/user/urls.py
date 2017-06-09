from django.conf.urls import url

from .views import UserListAPIView, UserRetrieveUpdateAPIView


urlpatterns = [
    url(r'^users/$', UserListAPIView.as_view(), name='user_list'),
    url(r'^users/(?P<pk>[0-9]+)/$', UserRetrieveUpdateAPIView.as_view(), name='user_retrieve_update'),
]

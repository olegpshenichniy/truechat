from django.conf.urls import url

from .views import RegistrationView, ActivateView


urlpatterns = [
    url(r'^$', RegistrationView.as_view(), name='registration'),
    url(r'^activate/(?P<hash>[\w+]{32})/$', ActivateView.as_view(), name='activate'),
]

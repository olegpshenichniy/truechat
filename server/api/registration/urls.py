from django.conf.urls import url

from .views import RegistrationView


urlpatterns = [
    url(r'^$', RegistrationView.as_view(), name='registration'),
]

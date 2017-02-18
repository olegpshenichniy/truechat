from django.conf.urls import url

from .views import CaptchaView


urlpatterns = [
    url(r'^$', CaptchaView.as_view(), name='get-validate'),
]

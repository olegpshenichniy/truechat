from django.conf.urls import url

from .views import GetCaptchaView


urlpatterns = [
    url(r'^$', GetCaptchaView.as_view(), name='get-captcha'),
]

from django.conf.urls import url

from .views import RegistrationView, GetCaptchaView


urlpatterns = [
    url(r'^$', RegistrationView.as_view(), name='registration'),
    url(r'^captcha/$', GetCaptchaView.as_view(), name='get-captcha'),
]

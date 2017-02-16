from django.conf.urls import url

from .views import StateView


urlpatterns = [
    url(r'^$', StateView.as_view(), name='state')
]

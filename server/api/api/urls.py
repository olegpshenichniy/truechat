from django.conf.urls import url, include
from django.contrib import admin

from rest_framework_swagger.views import get_swagger_view


urlpatterns = [

    # swagger API documentation tool
    url(r'^$', get_swagger_view(title='Truechat API')),

    url(r'^admin/', admin.site.urls),

    url(r'^api/', include('user.urls', namespace='api-user')),
]

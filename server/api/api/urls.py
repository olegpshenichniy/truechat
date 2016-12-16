from django.conf.urls import url, include
from django.contrib import admin

from rest_framework_swagger.views import get_swagger_view
from rest_framework_jwt.views import obtain_jwt_token


urlpatterns = [
    url(r'^admin/', admin.site.urls),

    # swagger API documentation tool
    url(r'^api/docs$', get_swagger_view(title='Truechat API')),

    # obtaining a JWP token via a POST
    url(r'^api/token-auth/', obtain_jwt_token),

    url(r'^api/', include('user.urls', namespace='api-user')),
]

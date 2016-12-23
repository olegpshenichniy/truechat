from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.contrib import admin

from rest_framework_swagger.views import get_swagger_view
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    # swagger API documentation tool
    url(r'^api/docs$', get_swagger_view(title='Truechat API')),

    # obtaining/refresh a JWP token via a POST
    url(r'^api/token-get/', obtain_jwt_token),
    url(r'^api/token-update/', refresh_jwt_token),
    url(r'^api/token-verify/', verify_jwt_token),

    # registration
    url(r'^api/registration/', include('registration.urls', namespace='api-registration')),

    url(r'^api/', include('user.urls', namespace='api-user')),
]

# during development serve media by django
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.contrib import admin

from rest_framework_swagger.views import get_swagger_view
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

urlpatterns = [
    # django admin
    url(r'^__admin__/', admin.site.urls),

    # swagger API documentation tool
    url(r'^api/docs/$', get_swagger_view(title='Truechat API')),

    # obtaining/refresh a JWP token via a POST
    url(r'^api/token/get/', obtain_jwt_token),
    url(r'^api/token/update/', refresh_jwt_token),
    url(r'^api/token/verify/', verify_jwt_token),

    # browsable API
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    # registration
    url(r'^api/registration/', include('registration.urls', namespace='api-registration')),

    # mathcaptcha
    url(r'^api/mathcaptcha/', include('mathcaptcha.urls', namespace='api-mathcaptcha')),

    # state
    url(r'^api/state/', include('state.urls', namespace='api-state')),

    # user
    url(r'^api/users/', include('user.urls', namespace='api-user')),

    # threads
    url(r'^api/threads/', include('thread.urls', namespace='api-thread')),

    # messages
    url(r'^api/messages/', include('message.urls', namespace='api-message')),
]

# during development serve media by django
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    import debug_toolbar

    urlpatterns = [
                      url(r'^__debug__/', include(debug_toolbar.urls)),
                  ] + urlpatterns

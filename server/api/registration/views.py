import hashlib
import random
from urllib.parse import urljoin

from rest_framework import status
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext_lazy as _
from django.conf import settings

from .serializers import UserRegistrationSerializer
from .models import AccountActivationHash


class RegistrationView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # create hexidigest using serializer python object id + user id + email + random number
            md = hashlib.md5()
            md.update(
                '{}{}{}{}'.format(
                    id(serializer),
                    serializer.instance.id,
                    serializer.instance.email,
                    random.randint(99, 999)
                ).encode()
            )
            _hash = md.hexdigest()

            # create hash model instance
            AccountActivationHash.objects.create(user=serializer.instance, hash=_hash)

            # activation link
            _link = urljoin(
                settings.BASE_URL,
                reverse('api-registration:activate', kwargs={'hash': _hash})
            )

            # send email
            send_mail(
                _('Welcome to truechat'),
                _('Activate your account by clicking this link. {}'.format(_link)),
                'signup@truechat.com',
                [serializer.validated_data['email']],
                fail_silently=False,
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivateView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, hash):
        try:
            account_activation = AccountActivationHash.objects.get(is_activated=False, hash=hash)
        except AccountActivationHash.DoesNotExist:
            raise NotFound()

        account_activation.user.is_active = True
        account_activation.user.save()
        account_activation.is_activated=True
        account_activation.save()

        return Response(status=status.HTTP_200_OK)

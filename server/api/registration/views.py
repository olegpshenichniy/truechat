import hashlib
import random

from rest_framework import status
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.utils.translation import ugettext_lazy as _

from .serializers import UserRegistrationSerializer
from .models import AccountActivationHash


class RegistrationView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # create hexidigest using user id + email + random number
            md = hashlib.md5()
            md.update(
                '{}{}{}'.format(
                    serializer.instance.id,
                    serializer.instance.email,
                    random.randint(99, 999)
                ).encode()
            )
            _hash = md.hexdigest()

            # create hash model instance
            AccountActivationHash.objects.create(user=serializer.instance, hash=_hash)

            # send email
            send_mail(
                _('Welcome to truechat'),
                _('Activate your account by clicking this link. {}'.format(_hash)), # TODO
                'signup@truechat.com',
                [serializer.validated_data['email']],
                fail_silently=False,
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

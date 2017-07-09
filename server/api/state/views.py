import logging

from rest_framework import status
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth import get_user_model

from user.serializers import UserListSerializer
from .serializers import StateSerializer

logger = logging.getLogger('truechat')


class StateView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        serializer = StateSerializer(data={
            'is_anonymous': request.user.is_anonymous(),
            'is_authenticated': request.user.is_authenticated(),
        })

        if not serializer.is_valid():
            logger.error('StateSerializer is not valid. Errors: {}'.format(serializer.errors))
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)

        resp_data = serializer.validated_data

        # add user data
        if request.user.is_authenticated():
            user_serializer = UserListSerializer(instance=get_user_model().objects.get(id=request.user.id))
            resp_data['current_user'] = user_serializer.data

        return Response(resp_data, status=status.HTTP_200_OK)

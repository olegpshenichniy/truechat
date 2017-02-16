import logging

from rest_framework import status
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import StateSerializer

logger = logging.getLogger(__name__)


class StateView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        serializer = StateSerializer(data={
            'is_anonymous': request.user.is_anonymous(),
            'is_authenticated': request.user.is_authenticated()
        })

        if not serializer.is_valid():
            logger.error('StateSerializer is not valid. Errors: {}'.format(serializer.errors))
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

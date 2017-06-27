from rest_framework import serializers

from .models import PrivateThread, GroupThread


class PrivateThreadListCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = PrivateThread
        fields = '__all__'


    def validate_initiator(self, initiator):
        if self.context['request'].user != initiator:
            raise serializers.ValidationError('Current user must be an initiator.')

        return initiator


    def validate_participants(self, participants):
        # participants without initiator
        participants = set(participants) - {self.context['request'].user}

        if not participants:
            raise serializers.ValidationError('Must contain one user different from current one.')

        if len(participants) != 1:
            raise serializers.ValidationError('Private thread can contain only one recepient.')

        # add initiator by default
        participants = participants | {self.context['request'].user}

        # check if such private thread already exists
        qs = PrivateThread.objects.all()

        for participant in participants:
            qs = qs.filter(participants=participant)

        if qs.exists():
            raise serializers.ValidationError('Private thread between selected users already exists.')

        return participants


class GroupThreadListCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = GroupThread
        fields = '__all__'
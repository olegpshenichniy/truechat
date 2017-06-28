from rest_framework import serializers

from .models import PrivateThread, GroupThread


#########################
##### PrivateThread #####
#########################

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


class PrivateThreadRetrieveDestroySerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivateThread
        fields = '__all__'


#######################
##### GroupThread #####
#######################

class GroupThreadListCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupThread
        fields = '__all__'

    def validate_owner(self, owner):
        if self.context['request'].user != owner:
            raise serializers.ValidationError('Current user must be an owner.')

        return owner

    def validate_name(self, name):
        if GroupThread.objects.filter(owner=self.context['request'].user, name=name).exists():
            raise serializers.ValidationError('You already have group chat with this name.')

        return name

    def validate_participants(self, participants):
        # add initiator by default
        participants = set(participants) | {self.context['request'].user}

        return participants


class GroupThreadRetrieveUpdateDestroySerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupThread
        fields = '__all__'

    def validate_name(self, name):
        if name == self.instance.name:
            return name

        if self.context['request'].user != self.instance.owner:
            raise serializers.ValidationError('Only group owner can change a name.')

        exists = GroupThread.objects.filter(
            owner=self.context['request'].user, name=name
        ).exclude(
            id=self.instance.id
        ).exists()

        if exists:
            raise serializers.ValidationError('You already have group chat with this name.')

        return name

    def validate_participants(self, participants):
        # not owner
        if self.context['request'].user != self.instance.owner:
            diff = set(self.instance.participants.all()) - set(participants)

            # participant (not owner) can remove only himself
            if diff and diff != {self.context['request'].user}:
                raise serializers.ValidationError('Not owner can remove only himself from the group.')

        # owner
        else:
            if self.instance.owner not in participants:
                raise serializers.ValidationError('Owner can not remove himself from his own group.')

        return participants

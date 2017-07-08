from rest_framework import serializers

from .models import PrivateMessage, GroupMessage


##########################
##### PrivateMessage #####
##########################

class PrivateMessageListCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivateMessage
        fields = '__all__'
        read_only_fields = ('sender',)

    def validate_thread(self, thread):
        if not thread.participants.filter(id=self.context['request'].user.id).exists():
            raise serializers.ValidationError('Thread does not exist')

        return thread

    def validate(self, attrs):
        attrs['sender'] = self.context['request'].user

        return attrs


class PrivateMessageRetrieveUpdateDestroySerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivateMessage
        fields = '__all__'
        read_only_fields = ('sender', 'thread')


########################
##### GroupMessage #####
########################

class GroupMessageListCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMessage
        fields = '__all__'
        read_only_fields = ('sender',)

    def validate_thread(self, thread):
        if not thread.participants.filter(id=self.context['request'].user.id).exists():
            raise serializers.ValidationError('Thread does not exist')

        return thread

    def validate(self, attrs):
        attrs['sender'] = self.context['request'].user

        return attrs


class GroupMessageRetrieveUpdateDestroySerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMessage
        fields = '__all__'
        read_only_fields = ('sender', 'thread')

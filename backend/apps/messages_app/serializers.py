from rest_framework import serializers
from .models import Conversation, Message
from apps.users.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender_detail = UserSerializer(source='sender', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_detail', 'body', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'is_read', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    other_participant = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'related_property', 'last_message', 'unread_count', 'other_participant', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_last_message(self, obj):
        msg = obj.last_message
        if msg:
            return {'body': msg.body[:80], 'created_at': msg.created_at, 'sender_id': msg.sender_id}
        return None

    def get_unread_count(self, obj):
        user = self.context['request'].user
        return obj.messages.filter(is_read=False).exclude(sender=user).count()

    def get_other_participant(self, obj):
        user = self.context['request'].user
        other = obj.participants.exclude(id=user.id).first()
        if other:
            return UserSerializer(other).data
        return None

from rest_framework import generics, permissions
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class ConversationListCreateView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Conversation.objects.none()
        return Conversation.objects.filter(
            participants=self.request.user
        ).prefetch_related('participants', 'messages').order_by('-messages__created_at')

    def perform_create(self, serializer):
        conv = serializer.save()
        conv.participants.add(self.request.user)
        other_id = self.request.data.get('other_user_id')
        if other_id:
            try:
                other = User.objects.get(pk=other_id)
                conv.participants.add(other)
            except User.DoesNotExist:
                pass


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conv_id = self.kwargs['conversation_id']
        return Message.objects.filter(
            conversation_id=conv_id,
            conversation__participants=self.request.user
        )

    def perform_create(self, serializer):
        conv_id = self.kwargs['conversation_id']
        serializer.save(
            sender=self.request.user,
            conversation_id=conv_id
        )

    def list(self, request, *args, **kwargs):
        # Mark messages as read on list
        self.get_queryset().exclude(sender=request.user).update(is_read=True)
        return super().list(request, *args, **kwargs)

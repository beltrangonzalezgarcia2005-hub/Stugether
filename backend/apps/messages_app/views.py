from django.db.models import Max
from rest_framework import generics, permissions, status
from rest_framework.response import Response
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
        return (
            Conversation.objects
            .filter(participants=self.request.user)
            .prefetch_related('participants', 'messages')
            .annotate(last_msg_at=Max('messages__created_at'))
            .order_by('-last_msg_at')
            .distinct()
        )

    def perform_create(self, serializer):
        other_id  = self.request.data.get('other_user_id')
        prop_id   = self.request.data.get('property')
        me        = self.request.user

        try:
            other = User.objects.get(pk=other_id)
        except (User.DoesNotExist, TypeError):
            other = None

        # Reuse existing conversation between these two users for this property
        if other:
            qs = Conversation.objects.filter(participants=me).filter(participants=other)
            if prop_id:
                qs = qs.filter(related_property_id=prop_id)
            existing = qs.first()
            if existing:
                # Attach the found conversation so the serializer returns it
                self._existing_conv = existing
                return

        conv = serializer.save()
        conv.participants.add(me)
        if other:
            conv.participants.add(other)
        self._existing_conv = conv

    def create(self, request, *args, **kwargs):
        self._existing_conv = None
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        out = ConversationSerializer(self._existing_conv, context={'request': request})
        return Response(out.data, status=status.HTTP_200_OK)


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
            conversation_id=conv_id,
        )

    def list(self, request, *args, **kwargs):
        self.get_queryset().exclude(sender=request.user).update(is_read=True)
        return super().list(request, *args, **kwargs)

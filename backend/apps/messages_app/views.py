from django.conf import settings
from django.core.mail import send_mail
from django.db.models import Max
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.contrib.auth import get_user_model
from apps.users.permissions import IsEmailVerified

User = get_user_model()


def _notify_new_message(msg):
    sender = msg.sender
    conv = msg.conversation
    prop = conv.related_property

    snippet = msg.body[:200] + ('…' if len(msg.body) > 200 else '')
    prop_line = f'<br><span style="color:#64748B;font-size:13px">Propiedad: <strong>{prop.title}</strong></span>' if prop else ''
    link = f"{settings.FRONTEND_URL}/panel/mensajes"

    for recipient in conv.participants.exclude(pk=sender.pk):
        prefs = recipient.notification_preferences or {}
        if not prefs.get('mensajes', True):
            continue

        html = f"""<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <tr>
          <td style="background:#2563EB;padding:32px 40px;text-align:center">
            <span style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px">Stuguether</span>
            <p style="margin:6px 0 0;font-size:13px;color:#BFDBFE;letter-spacing:0.5px">Tu hogar estudiantil</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 32px">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1E293B">Nuevo mensaje 💬</p>
            <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.6">
              Hola <strong style="color:#1E293B">{recipient.first_name}</strong>,<br>
              <strong style="color:#1E293B">{sender.first_name} {sender.last_name}</strong> te ha enviado un mensaje:{prop_line}
            </p>
            <div style="background:#F8FAFC;border-left:4px solid #2563EB;border-radius:4px;padding:16px 20px;margin:0 0 28px;font-size:15px;color:#334155;line-height:1.6">
              {snippet}
            </div>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#2563EB;border-radius:10px">
                  <a href="{link}" style="display:inline-block;padding:16px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none">
                    Ver mensaje →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="padding:0 40px"><hr style="border:none;border-top:1px solid #E2E8F0;margin:0"></td></tr>
        <tr>
          <td style="padding:24px 40px;text-align:center">
            <p style="margin:0;font-size:12px;color:#CBD5E1">
              Puedes desactivar estas notificaciones desde tu panel en Configuración → Notificaciones.
            </p>
            <p style="margin:12px 0 0;font-size:11px;color:#E2E8F0">© Stuguether · noreply@stuguether.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

        send_mail(
            subject=f'{sender.first_name} te ha enviado un mensaje en Stuguether',
            message=(
                f'Hola {recipient.first_name},\n\n'
                f'{sender.first_name} {sender.last_name} te ha enviado un mensaje:\n\n'
                f'"{snippet}"\n\n'
                f'Responde desde: {link}\n\n'
                f'— El equipo de Stuguether'
            ),
            html_message=html,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient.email],
            fail_silently=True,
        )


class ConversationListCreateView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmailVerified]

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
        me        = self.request.user

        try:
            other = User.objects.get(pk=other_id)
        except (User.DoesNotExist, TypeError):
            other = None

        # Reuse existing conversation between these two users for this property
        if other:
            qs = Conversation.objects.filter(participants=me).filter(participants=other)
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
    permission_classes = [permissions.IsAuthenticated, IsEmailVerified]

    def get_queryset(self):
        conv_id = self.kwargs['conversation_id']
        return Message.objects.filter(
            conversation_id=conv_id,
            conversation__participants=self.request.user
        )

    def perform_create(self, serializer):
        conv_id = self.kwargs['conversation_id']
        msg = serializer.save(sender=self.request.user, conversation_id=conv_id)
        _notify_new_message(msg)

    def list(self, request, *args, **kwargs):
        self.get_queryset().exclude(sender=request.user).update(is_read=True)
        return super().list(request, *args, **kwargs)

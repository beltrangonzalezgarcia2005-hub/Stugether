from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, DocumentSerializer, PublicUserSerializer
from .models import Document, EmailVerificationToken

User = get_user_model()

TOKEN_EXPIRY_HOURS = 24


def _send_verification_email(user, token_obj):
    link = f"{settings.FRONTEND_URL}/verificar-email?token={token_obj.token}"
    send_mail(
        subject='Verifica tu cuenta en Stuguether',
        message=(
            f'Hola {user.first_name},\n\n'
            f'Haz clic en el siguiente enlace para verificar tu cuenta:\n{link}\n\n'
            f'El enlace caduca en {TOKEN_EXPIRY_HOURS} horas.\n\n'
            f'Si no has creado una cuenta, ignora este mensaje.\n\n'
            f'— El equipo de Stuguether'
        ),
        html_message=(
            f'<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">'
            f'<h2 style="color:#2563EB;margin-bottom:8px">Stuguether</h2>'
            f'<h3 style="font-weight:700;margin-bottom:16px">Verifica tu cuenta</h3>'
            f'<p style="color:#555;line-height:1.6">Hola <strong>{user.first_name}</strong>, '
            f'gracias por registrarte. Haz clic en el botón para activar tu cuenta:</p>'
            f'<a href="{link}" style="display:inline-block;margin:24px 0;padding:14px 28px;'
            f'background:#2563EB;color:white;border-radius:8px;text-decoration:none;'
            f'font-weight:700;font-size:15px">Verificar mi cuenta</a>'
            f'<p style="color:#999;font-size:13px">O copia este enlace en tu navegador:<br>'
            f'<a href="{link}" style="color:#2563EB;word-break:break-all">{link}</a></p>'
            f'<p style="color:#bbb;font-size:12px;margin-top:32px">'
            f'El enlace caduca en {TOKEN_EXPIRY_HOURS} horas. Si no has creado una cuenta, ignora este mensaje.</p>'
            f'</div>'
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token_obj, _ = EmailVerificationToken.objects.get_or_create(user=user)
        _send_verification_email(user, token_obj)
        return Response(
            {'detail': f'Cuenta creada. Hemos enviado un email de verificación a {user.email}.'},
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        token_str = request.query_params.get('token')
        if not token_str:
            return Response({'detail': 'Token requerido.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token_obj = EmailVerificationToken.objects.select_related('user').get(token=token_str)
        except EmailVerificationToken.DoesNotExist:
            return Response({'detail': 'Token inválido o ya utilizado.'}, status=status.HTTP_400_BAD_REQUEST)

        expiry = token_obj.created_at + timedelta(hours=TOKEN_EXPIRY_HOURS)
        if timezone.now() > expiry:
            token_obj.delete()
            return Response({'detail': 'El enlace ha caducado. Solicita uno nuevo.'}, status=status.HTTP_400_BAD_REQUEST)

        user = token_obj.user
        user.is_verified = True
        user.save(update_fields=['is_verified'])
        token_obj.delete()

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user, context={'request': request}).data,
        })


class ResendVerificationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't leak whether the email exists
            return Response({'detail': 'Si el email está registrado, recibirás un nuevo enlace.'})

        if user.is_verified:
            return Response({'detail': 'Esta cuenta ya está verificada.'})

        token_obj, _ = EmailVerificationToken.objects.get_or_create(user=user)
        # Reset token so the timer restarts
        from django.utils import timezone as tz
        if (tz.now() - token_obj.created_at) < timedelta(minutes=1):
            return Response({'detail': 'Espera un momento antes de solicitar otro enlace.'})

        token_obj.delete()
        new_token = EmailVerificationToken.objects.create(user=user)
        _send_verification_email(user, new_token)
        return Response({'detail': 'Enlace reenviado. Revisa tu bandeja de entrada.'})


class PublicUserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = PublicUserSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class DocumentListCreateView(generics.ListCreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Document.objects.none()
        return Document.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, DocumentSerializer, PublicUserSerializer
from .models import Document, EmailVerificationToken
from .permissions import IsEmailVerified

User = get_user_model()

TOKEN_EXPIRY_HOURS = 24


def _send_verification_email(user, token_obj):
    link = f"{settings.FRONTEND_URL}/verificar-email?token={token_obj.token}"
    html = f"""<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr>
          <td style="background:#2563EB;padding:32px 40px;text-align:center">
            <span style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px">Stuguether</span>
            <p style="margin:6px 0 0;font-size:13px;color:#BFDBFE;letter-spacing:0.5px">Tu hogar estudiantil</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1E293B">Verifica tu cuenta ✉️</p>
            <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.6">
              Hola <strong style="color:#1E293B">{user.first_name}</strong>, gracias por unirte a Stuguether.<br>
              Haz clic en el botón para activar tu cuenta y empezar a buscar piso.
            </p>

            <table cellpadding="0" cellspacing="0" style="margin:0 0 32px">
              <tr>
                <td style="background:#2563EB;border-radius:10px">
                  <a href="{link}"
                     style="display:inline-block;padding:16px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.2px">
                    Verificar mi cuenta →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 8px;font-size:13px;color:#94A3B8">
              Si el botón no funciona, copia y pega este enlace en tu navegador:
            </p>
            <p style="margin:0;font-size:12px;word-break:break-all">
              <a href="{link}" style="color:#2563EB">{link}</a>
            </p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 40px"><hr style="border:none;border-top:1px solid #E2E8F0;margin:0"></td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;text-align:center">
            <p style="margin:0 0 6px;font-size:12px;color:#CBD5E1">
              Este enlace caduca en <strong>{TOKEN_EXPIRY_HOURS} horas</strong>.
            </p>
            <p style="margin:0;font-size:12px;color:#CBD5E1">
              Si no has creado una cuenta en Stuguether, ignora este mensaje con total seguridad.
            </p>
            <p style="margin:16px 0 0;font-size:11px;color:#E2E8F0">© Stuguether · noreply@stuguether.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>"""
    send_mail(
        subject='Verifica tu cuenta en Stuguether',
        message=(
            f'Hola {user.first_name},\n\n'
            f'Haz clic en el siguiente enlace para verificar tu cuenta:\n{link}\n\n'
            f'El enlace caduca en {TOKEN_EXPIRY_HOURS} horas.\n\n'
            f'Si no has creado una cuenta, ignora este mensaje.\n\n'
            f'— El equipo de Stuguether'
        ),
        html_message=html,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email', '').strip()
        try:
            user = User.objects.get(email=email)
            if not user.is_active and not user.is_verified:
                return Response(
                    {
                        'detail': 'Debes verificar tu email antes de iniciar sesión.',
                        'unverified': True,
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        except User.DoesNotExist:
            pass
        return super().post(request, *args, **kwargs)


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
        user.is_active = True
        user.save(update_fields=['is_verified', 'is_active'])
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

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        sp = getattr(instance, 'student_profile', None)
        if sp and not sp.profile_public:
            if not request.user.is_authenticated or request.user.pk != instance.pk:
                return Response({'detail': 'Este perfil es privado.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class MeView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=['is_active'])


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password', '')
        new_password = request.data.get('new_password', '')
        confirm_new_password = request.data.get('confirm_new_password', '')

        errors = {}
        if not user.check_password(current_password):
            errors['current_password'] = ['La contraseña actual no es correcta.']
        if len(new_password) < 8:
            errors['new_password'] = ['La nueva contraseña debe tener al menos 8 caracteres.']
        if new_password and new_password == current_password:
            errors['new_password'] = ['La nueva contraseña debe ser diferente a la actual.']
        if new_password != confirm_new_password:
            errors['confirm_new_password'] = ['Las contraseñas no coinciden.']

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save(update_fields=['password'])
        return Response({'detail': 'Contraseña actualizada correctamente.'}, status=status.HTTP_200_OK)


class DocumentListCreateView(generics.ListCreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmailVerified]

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


class UserPublicPropertiesView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        from apps.properties.models import Property
        user_pk = self.kwargs['pk']
        try:
            target = User.objects.get(pk=user_pk, is_active=True)
        except User.DoesNotExist:
            return Property.objects.none()
        sp = getattr(target, 'student_profile', None)
        if sp and not sp.profile_public:
            if not self.request.user.is_authenticated or self.request.user.pk != target.pk:
                return Property.objects.none()
        return (
            Property.objects.filter(owner=target, is_active=True)
            .prefetch_related('images', 'amenities', 'propertyuniversity_set__university', 'favorited_by')
            .order_by('-created_at')
        )

    def get_serializer_class(self):
        from apps.properties.serializers import PropertyListSerializer
        return PropertyListSerializer

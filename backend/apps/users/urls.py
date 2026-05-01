from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, MeView, DocumentListCreateView, DocumentDetailView,
    PublicUserProfileView, VerifyEmailView, ResendVerificationView,
    ChangePasswordView, UserPublicPropertiesView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    path('me/', MeView.as_view(), name='auth-me'),
    path('verify-email/', VerifyEmailView.as_view(), name='auth-verify-email'),
    path('resend-verification/', ResendVerificationView.as_view(), name='auth-resend-verification'),
    path('documents/', DocumentListCreateView.as_view(), name='document-list'),
    path('documents/<int:pk>/', DocumentDetailView.as_view(), name='document-detail'),
    path('users/<int:pk>/', PublicUserProfileView.as_view(), name='user-public-profile'),
    path('users/<int:pk>/properties/', UserPublicPropertiesView.as_view(), name='user-public-properties'),
    path('change-password/', ChangePasswordView.as_view(), name='auth-change-password'),
]

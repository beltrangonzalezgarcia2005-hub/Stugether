from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.utils import timezone
from .models import Reservation
from .serializers import ReservationSerializer, ReservationStatusSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class ReservationListCreateView(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_owner:
            return Reservation.objects.filter(
                property__owner=user
            ).select_related('student', 'property')
        return Reservation.objects.filter(student=user).select_related('property', 'student')


class ReservationDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ReservationStatusSerializer
        return ReservationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_owner:
            return Reservation.objects.filter(property__owner=user)
        return Reservation.objects.filter(student=user)

    def perform_update(self, serializer):
        new_status = serializer.validated_data.get('status')
        kwargs = {}
        if new_status == Reservation.STATUS_ACCEPTED:
            kwargs['accepted_at'] = timezone.now()
        elif new_status == Reservation.STATUS_CONFIRMED:
            kwargs['confirmed_at'] = timezone.now()
        serializer.save(**kwargs)

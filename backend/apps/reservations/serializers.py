from rest_framework import serializers
from .models import Reservation
from apps.properties.serializers import PropertyListSerializer
from apps.users.serializers import UserSerializer


class ReservationSerializer(serializers.ModelSerializer):
    property_detail = PropertyListSerializer(source='property', read_only=True)
    student_detail = UserSerializer(source='student', read_only=True)
    property = serializers.PrimaryKeyRelatedField(
        queryset=__import__('apps.properties.models', fromlist=['Property']).Property.objects.all()
    )

    class Meta:
        model = Reservation
        fields = [
            'id', 'property', 'property_detail', 'student_detail',
            'start_date', 'end_date', 'months', 'monthly_price',
            'deposit', 'service_fee', 'total', 'status', 'payment_status',
            'notes', 'created_at', 'accepted_at',
        ]
        read_only_fields = ['id', 'service_fee', 'total', 'status', 'payment_status', 'created_at', 'accepted_at']

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)


class ReservationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['status']

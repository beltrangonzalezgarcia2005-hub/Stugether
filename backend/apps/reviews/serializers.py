from rest_framework import serializers
from .models import Review
from apps.users.serializers import UserSerializer


class ReviewSerializer(serializers.ModelSerializer):
    student_detail = UserSerializer(source='student', read_only=True)
    property_id = serializers.IntegerField(source='property.id', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'property_id', 'student_detail', 'rating', 'comment',
            'period_start', 'period_end', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)

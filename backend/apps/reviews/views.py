from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer


class PropertyReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Review.objects.filter(property_id=self.kwargs['property_id']).select_related('student')

    def perform_create(self, serializer):
        serializer.save(
            student=self.request.user,
            property_id=self.kwargs['property_id']
        )

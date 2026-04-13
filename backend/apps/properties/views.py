from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Property, University, Favorite
from .serializers import (
    PropertyListSerializer, PropertyDetailSerializer,
    PropertyCreateSerializer, UniversitySerializer, FavoriteSerializer
)
from .filters import PropertyFilter


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user


class PropertyListCreateView(generics.ListCreateAPIView):
    queryset = Property.objects.filter(is_active=True).prefetch_related(
        'images', 'amenities', 'propertyuniversity_set__university', 'favorited_by'
    )
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = PropertyFilter
    search_fields = ['title', 'address', 'city', 'neighborhood']
    ordering_fields = ['price_month', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PropertyCreateSerializer
        return PropertyListSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = super().get_queryset()
        featured = self.request.query_params.get('featured')
        if featured:
            qs = qs.filter(is_featured=True)
        return qs


class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.filter(is_active=True)
    permission_classes = [IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PropertyCreateSerializer
        return PropertyDetailSerializer


class UniversityListView(generics.ListAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [SearchFilter]
    search_fields = ['name', 'city']


class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('property')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FavoriteDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def get_object(self):
        property_id = self.kwargs.get('property_id')
        return self.get_queryset().get(property_id=property_id)


class PropertyImageUploadView(generics.CreateAPIView):
    """POST /api/properties/<pk>/images/ — Upload one image per request (multipart)"""
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, pk=None):
        try:
            prop = Property.objects.get(pk=pk, owner=request.user)
        except Property.DoesNotExist:
            return Response({'detail': 'No encontrado o sin permiso.'}, status=status.HTTP_404_NOT_FOUND)

        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'detail': 'Se requiere un archivo de imagen.'}, status=status.HTTP_400_BAD_REQUEST)

        order = prop.images.count()
        from .models import PropertyImage
        img = PropertyImage.objects.create(property=prop, image=image_file, order=order)
        return Response({
            'id': img.id,
            'image': request.build_absolute_uri(img.image.url),
            'order': img.order,
        }, status=status.HTTP_201_CREATED)


class OwnerPropertyListView(generics.ListAPIView):
    """GET /api/properties/mine/ — List authenticated owner's properties"""
    serializer_class = PropertyListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user).prefetch_related(
            'images', 'amenities', 'propertyuniversity_set__university'
        )


class PropertyAmenityView(generics.GenericAPIView):
    """POST /api/properties/<pk>/amenities/ — Add amenity to property"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk=None):
        try:
            prop = Property.objects.get(pk=pk, owner=request.user)
        except Property.DoesNotExist:
            return Response({'detail': 'No encontrado o sin permiso.'}, status=status.HTTP_404_NOT_FOUND)
        key = request.data.get('key')
        if not key:
            return Response({'detail': 'Falta el campo key.'}, status=status.HTTP_400_BAD_REQUEST)
        from .models import PropertyAmenity
        PropertyAmenity.objects.get_or_create(property=prop, key=key)
        return Response({'key': key}, status=status.HTTP_201_CREATED)

import math
import unicodedata
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Property, University, Campus, Favorite
from .serializers import (
    PropertyListSerializer, PropertyDetailSerializer,
    PropertyCreateSerializer, UniversitySerializer, FavoriteSerializer
)
from .filters import PropertyFilter

CAMPUS_RADIUS_KM = 3
UNIVERSITY_RADIUS_KM = 5


def _haversine_km(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2
         + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


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

    def filter_queryset(self, queryset):
        campus_id = self.request.query_params.get('campus')
        university_name = self.request.query_params.get('university')

        if campus_id:
            try:
                campus = Campus.objects.get(id=campus_id)
                if campus.lat and campus.lng:
                    ids = [
                        p.id for p in queryset
                        if p.lat and p.lng
                        and _haversine_km(p.lat, p.lng, campus.lat, campus.lng) <= CAMPUS_RADIUS_KM
                    ]
                    queryset = queryset.filter(id__in=ids)
            except Campus.DoesNotExist:
                pass
            university_name = None

        if university_name:
            needle = _strip_accents(university_name)
            unis = [u for u in University.objects.prefetch_related('campuses').all()
                    if needle in _strip_accents(u.name)]
            campus_points = [
                (c.lat, c.lng)
                for u in unis
                for c in u.campuses.all()
                if c.lat and c.lng
            ]
            if campus_points:
                ids = [
                    p.id for p in queryset
                    if p.lat and p.lng
                    and any(
                        _haversine_km(p.lat, p.lng, clat, clng) <= UNIVERSITY_RADIUS_KM
                        for clat, clng in campus_points
                    )
                ]
                queryset = queryset.filter(id__in=ids)

        mutable = self.request.query_params.copy()
        mutable.pop('campus', None)
        mutable.pop('university', None)
        self.request._request.GET = mutable

        return super().filter_queryset(queryset)


class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.filter(is_active=True)
    permission_classes = [IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PropertyCreateSerializer
        return PropertyDetailSerializer


def _strip_accents(text):
    return unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('ascii').lower()


class UniversityListView(generics.ListAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def list(self, request, *args, **kwargs):
        search = request.query_params.get('search', '').strip()
        if not search:
            return Response([])
        needle = _strip_accents(search)
        qs = University.objects.prefetch_related('campuses').all()
        results = [u for u in qs if needle in _strip_accents(u.name) or needle in _strip_accents(u.city or '')]
        serializer = self.get_serializer(results[:20], many=True)
        return Response(serializer.data)


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
    """
    POST /api/properties/<pk>/amenities/ — Add a single amenity.
    PUT  /api/properties/<pk>/amenities/ — Replace all amenities atomically.
    """
    permission_classes = [permissions.IsAuthenticated]

    def _get_property(self, pk):
        try:
            return Property.objects.get(pk=pk, owner=self.request.user)
        except Property.DoesNotExist:
            return None

    def post(self, request, pk=None):
        prop = self._get_property(pk)
        if prop is None:
            return Response({'detail': 'No encontrado o sin permiso.'}, status=status.HTTP_404_NOT_FOUND)
        key = request.data.get('key')
        if not key:
            return Response({'detail': 'Falta el campo key.'}, status=status.HTTP_400_BAD_REQUEST)
        from .models import PropertyAmenity
        PropertyAmenity.objects.get_or_create(property=prop, key=key)
        return Response({'key': key}, status=status.HTTP_201_CREATED)

    def put(self, request, pk=None):
        prop = self._get_property(pk)
        if prop is None:
            return Response({'detail': 'No encontrado o sin permiso.'}, status=status.HTTP_404_NOT_FOUND)
        keys = request.data.get('keys', [])
        from .models import PropertyAmenity
        prop.amenities.all().delete()
        for key in keys:
            PropertyAmenity.objects.create(property=prop, key=key)
        return Response({'keys': keys})

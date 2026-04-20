from rest_framework import serializers
from .models import Property, PropertyImage, PropertyAmenity, PropertyUniversity, University, Favorite
from apps.users.serializers import UserSerializer


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name', 'city', 'lat', 'lng']


class PropertyImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'order']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url
        return None


class PropertyAmenitySerializer(serializers.ModelSerializer):
    label = serializers.CharField(source='get_key_display', read_only=True)

    class Meta:
        model = PropertyAmenity
        fields = ['key', 'label']


class PropertyUniversitySerializer(serializers.ModelSerializer):
    university = UniversitySerializer(read_only=True)

    class Meta:
        model = PropertyUniversity
        fields = ['university', 'minutes_walk', 'minutes_transit']


class PropertyListSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    amenities = PropertyAmenitySerializer(many=True, read_only=True)
    nearby_universities = PropertyUniversitySerializer(
        source='propertyuniversity_set', many=True, read_only=True
    )
    avg_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'address', 'city', 'neighborhood', 'lat', 'lng',
            'property_type', 'price_month', 'deposit', 'room_m2', 'total_m2',
            'companions', 'bathrooms', 'floor', 'elevator', 'pets_allowed',
            'gender_pref', 'is_verified', 'is_featured',
            'images', 'amenities', 'nearby_universities',
            'avg_rating', 'review_count', 'owner_name', 'is_favorited', 'created_at',
        ]

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False


class PropertyDetailSerializer(PropertyListSerializer):
    owner = UserSerializer(read_only=True)
    description = serializers.CharField()

    class Meta(PropertyListSerializer.Meta):
        fields = PropertyListSerializer.Meta.fields + ['description', 'owner', 'updated_at']


class PropertyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'id',
            'title', 'description', 'address', 'city', 'neighborhood', 'lat', 'lng',
            'property_type', 'price_month', 'deposit', 'room_m2', 'total_m2',
            'companions', 'bathrooms', 'floor', 'elevator', 'pets_allowed', 'gender_pref',
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class FavoriteSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)
    property_id = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(), source='property', write_only=True
    )

    class Meta:
        model = Favorite
        fields = ['id', 'property', 'property_id', 'created_at']
        read_only_fields = ['id', 'created_at']

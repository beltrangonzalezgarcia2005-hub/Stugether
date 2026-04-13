import django_filters
from .models import Property


class PropertyFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price_month', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price_month', lookup_expr='lte')
    property_type = django_filters.CharFilter(field_name='property_type')
    max_companions = django_filters.NumberFilter(field_name='companions', lookup_expr='lte')
    gender_pref = django_filters.CharFilter(field_name='gender_pref')
    pets_allowed = django_filters.BooleanFilter()
    is_verified = django_filters.BooleanFilter()
    city = django_filters.CharFilter(lookup_expr='icontains')
    university = django_filters.CharFilter(
        field_name='universities__name', lookup_expr='icontains'
    )
    amenity = django_filters.CharFilter(method='filter_amenity')

    class Meta:
        model = Property
        fields = ['property_type', 'pets_allowed', 'is_verified', 'city']

    def filter_amenity(self, queryset, name, value):
        return queryset.filter(amenities__key=value)

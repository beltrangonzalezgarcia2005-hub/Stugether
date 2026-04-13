from django.contrib import admin
from .models import Property, PropertyImage, PropertyAmenity, PropertyUniversity, University, Favorite

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 0

class PropertyAmenityInline(admin.TabularInline):
    model = PropertyAmenity
    extra = 0

class PropertyUniversityInline(admin.TabularInline):
    model = PropertyUniversity
    extra = 0

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'city', 'price_month', 'property_type', 'is_verified', 'is_active', 'is_featured')
    list_filter = ('property_type', 'is_verified', 'is_active', 'is_featured', 'city')
    search_fields = ('title', 'address', 'owner__email')
    inlines = [PropertyImageInline, PropertyAmenityInline, PropertyUniversityInline]
    actions = ['verify_properties', 'feature_properties']

    def verify_properties(self, request, queryset):
        queryset.update(is_verified=True)
    verify_properties.short_description = 'Marcar como verificadas'

    def feature_properties(self, request, queryset):
        queryset.update(is_featured=True)
    feature_properties.short_description = 'Destacar en landing page'

@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'lat', 'lng')
    search_fields = ('name', 'city')

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'property', 'created_at')

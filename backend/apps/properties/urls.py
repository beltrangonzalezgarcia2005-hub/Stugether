from django.urls import path
from .views import (
    PropertyListCreateView, PropertyDetailView,
    UniversityListView, FavoriteListCreateView, FavoriteDeleteView,
    PropertyImageUploadView, OwnerPropertyListView, PropertyAmenityView,
)

urlpatterns = [
    path('', PropertyListCreateView.as_view(), name='property-list'),
    path('mine/', OwnerPropertyListView.as_view(), name='property-mine'),
    path('<int:pk>/', PropertyDetailView.as_view(), name='property-detail'),
    path('<int:pk>/images/', PropertyImageUploadView.as_view(), name='property-image-upload'),
    path('<int:pk>/amenities/', PropertyAmenityView.as_view(), name='property-amenity-add'),
    path('universities/', UniversityListView.as_view(), name='university-list'),
    path('favorites/', FavoriteListCreateView.as_view(), name='favorite-list'),
    path('favorites/<int:property_id>/', FavoriteDeleteView.as_view(), name='favorite-delete'),
]

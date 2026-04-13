from django.urls import path
from .views import PropertyReviewListCreateView

urlpatterns = [
    path('property/<int:property_id>/', PropertyReviewListCreateView.as_view(), name='review-list'),
]

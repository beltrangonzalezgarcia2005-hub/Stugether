from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings


class Review(models.Model):
    reservation = models.OneToOneField(
        'reservations.Reservation', on_delete=models.CASCADE, related_name='review'
    )
    property = models.ForeignKey(
        'properties.Property', on_delete=models.CASCADE, related_name='reviews'
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews_written'
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    period_start = models.DateField()
    period_end = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Reseña {self.rating}★ – {self.student.email} → {self.property.title}'

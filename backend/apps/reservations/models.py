from django.db import models
from django.conf import settings
from decimal import Decimal


class Reservation(models.Model):
    STATUS_PENDING = 'PENDING'
    STATUS_ACCEPTED = 'ACCEPTED'
    STATUS_CONFIRMED = 'CONFIRMED'
    STATUS_CANCELLED = 'CANCELLED'
    STATUS_COMPLETED = 'COMPLETED'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pendiente'),
        (STATUS_ACCEPTED, 'Aceptada'),
        (STATUS_CONFIRMED, 'Confirmada'),
        (STATUS_CANCELLED, 'Cancelada'),
        (STATUS_COMPLETED, 'Completada'),
    ]

    PAYMENT_ESCROW = 'ESCROW'
    PAYMENT_RELEASED = 'RELEASED'
    PAYMENT_REFUNDED = 'REFUNDED'
    PAYMENT_CHOICES = [
        (PAYMENT_ESCROW, 'En custodia (Escrow)'),
        (PAYMENT_RELEASED, 'Liberado al propietario'),
        (PAYMENT_REFUNDED, 'Devuelto al estudiante'),
    ]

    SERVICE_FEE_RATE = Decimal('0.07')  # 7%

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations_as_student'
    )
    property = models.ForeignKey(
        'properties.Property', on_delete=models.CASCADE, related_name='reservations'
    )
    start_date = models.DateField()
    end_date = models.DateField()
    months = models.PositiveSmallIntegerField()
    monthly_price = models.DecimalField(max_digits=8, decimal_places=2)
    deposit = models.DecimalField(max_digits=8, decimal_places=2)
    service_fee = models.DecimalField(max_digits=8, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default=STATUS_PENDING)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default=PAYMENT_ESCROW)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Auto-calculate totals on save
        if self.monthly_price and self.months and self.deposit:
            subtotal = self.monthly_price * self.months
            self.service_fee = (subtotal * self.SERVICE_FEE_RATE).quantize(Decimal('0.01'))
            self.total = subtotal + self.deposit + self.service_fee
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Reserva #{self.pk} – {self.student.email} → {self.property.title}'

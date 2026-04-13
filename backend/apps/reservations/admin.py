from django.contrib import admin
from .models import Reservation

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'property', 'start_date', 'end_date', 'monthly_price', 'status', 'payment_status', 'created_at')
    list_filter = ('status', 'payment_status')
    search_fields = ('student__email', 'property__title')
    readonly_fields = ('service_fee', 'total', 'created_at', 'accepted_at', 'confirmed_at')
    actions = ['release_payment']

    def release_payment(self, request, queryset):
        queryset.filter(payment_status='ESCROW').update(payment_status='RELEASED')
    release_payment.short_description = 'Liberar pago al propietario'

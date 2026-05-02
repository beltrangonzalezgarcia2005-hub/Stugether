from django.db import models
from django.conf import settings


class University(models.Model):
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)

    class Meta:
        verbose_name_plural = 'Universities'
        ordering = ['name']

    def __str__(self):
        return f'{self.name} – {self.city}'


class Property(models.Model):
    TYPE_ROOM = 'ROOM'
    TYPE_FULL = 'FULL'
    TYPE_STUDIO = 'STUDIO'
    TYPE_CHOICES = [
        (TYPE_ROOM, 'Habitación'),
        (TYPE_FULL, 'Piso entero'),
        (TYPE_STUDIO, 'Estudio'),
    ]

    GENDER_NONE = 'NONE'
    GENDER_FEMALE = 'FEMALE'
    GENDER_MALE = 'MALE'
    GENDER_CHOICES = [
        (GENDER_NONE, 'Sin preferencia'),
        (GENDER_FEMALE, 'Solo chicas'),
        (GENDER_MALE, 'Solo chicos'),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='properties'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    address = models.CharField(max_length=300)
    city = models.CharField(max_length=100)
    neighborhood = models.CharField(max_length=100, blank=True)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    property_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default=TYPE_ROOM)
    price_month = models.DecimalField(max_digits=8, decimal_places=2)
    deposit = models.DecimalField(max_digits=8, decimal_places=2)
    room_m2 = models.PositiveSmallIntegerField(null=True, blank=True)
    total_m2 = models.PositiveSmallIntegerField(null=True, blank=True)
    companions = models.PositiveSmallIntegerField(default=0)
    bathrooms = models.PositiveSmallIntegerField(default=1)
    floor = models.CharField(max_length=10, blank=True)
    elevator = models.BooleanField(default=False)
    pets_allowed = models.BooleanField(default=False)
    gender_pref = models.CharField(max_length=10, choices=GENDER_CHOICES, default=GENDER_NONE)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    universities = models.ManyToManyField(University, through='PropertyUniversity', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Properties'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} – {self.city}'

    @property
    def avg_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            return round(sum(r.rating for r in reviews) / reviews.count(), 1)
        return None

    @property
    def review_count(self):
        return self.reviews.count()


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='properties/')
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'Imagen {self.order} – {self.property.title}'


class PropertyAmenity(models.Model):
    AMENITY_WIFI = 'WIFI'
    AMENITY_UTILITIES = 'UTILITIES'
    AMENITY_FURNISHED = 'FURNISHED'
    AMENITY_PARKING = 'PARKING'
    AMENITY_AC = 'AC'
    AMENITY_HEATING = 'HEATING'
    AMENITY_WASHER = 'WASHER'
    AMENITY_DESK = 'DESK'
    AMENITY_ERGONOMIC_CHAIR = 'ERGONOMIC_CHAIR'
    AMENITY_ELEVATOR = 'ELEVATOR'
    AMENITY_CHOICES = [
        (AMENITY_WIFI, 'WiFi alta velocidad'),
        (AMENITY_UTILITIES, 'Gastos incluidos'),
        (AMENITY_FURNISHED, 'Amueblado'),
        (AMENITY_PARKING, 'Parking'),
        (AMENITY_AC, 'Aire acondicionado'),
        (AMENITY_HEATING, 'Calefacción'),
        (AMENITY_WASHER, 'Lavadora'),
        (AMENITY_DESK, 'Escritorio estudio'),
        (AMENITY_ERGONOMIC_CHAIR, 'Silla ergonómica'),
        (AMENITY_ELEVATOR, 'Ascensor'),
    ]

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='amenities')
    key = models.CharField(max_length=20, choices=AMENITY_CHOICES)

    class Meta:
        unique_together = ('property', 'key')

    def __str__(self):
        return f'{self.get_key_display()} – {self.property.title}'


class Campus(models.Model):
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name='campuses')
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100, blank=True)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)

    class Meta:
        ordering = ['university__name', 'name']
        verbose_name_plural = 'Campuses'

    def __str__(self):
        return f'{self.university.name} — {self.name}'


class PropertyUniversity(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    university = models.ForeignKey(University, on_delete=models.CASCADE)
    campus = models.ForeignKey('Campus', null=True, blank=True, on_delete=models.SET_NULL)
    minutes_walk = models.PositiveSmallIntegerField(null=True, blank=True)
    minutes_transit = models.PositiveSmallIntegerField(null=True, blank=True)

    class Meta:
        unique_together = ('property', 'university')

    def __str__(self):
        return f'{self.property.title} → {self.university.name} ({self.minutes_walk} min)'


class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites'
    )
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'property')

    def __str__(self):
        return f'{self.user.email} ♥ {self.property.title}'

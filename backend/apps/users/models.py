import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_STUDENT = 'STUDENT'
    ROLE_OWNER = 'OWNER'
    ROLE_ADMIN = 'ADMIN'
    ROLE_CHOICES = [
        (ROLE_STUDENT, 'Estudiante'),
        (ROLE_OWNER, 'Propietario'),
        (ROLE_ADMIN, 'Administrador'),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=ROLE_STUDENT)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    notification_preferences = models.JSONField(default=dict, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return f'{self.get_full_name()} ({self.email})'

    @property
    def is_student(self):
        return self.role == self.ROLE_STUDENT

    @property
    def is_owner(self):
        return self.role == self.ROLE_OWNER


class StudentProfile(models.Model):
    HABIT_NO_SMOKER   = 'NO_SMOKER'
    HABIT_PET_FRIENDLY = 'PET_FRIENDLY'
    HABIT_STUDIOUS    = 'STUDIOUS'
    HABIT_SOCIAL      = 'SOCIAL'
    HABIT_EARLY_RISER = 'EARLY_RISER'
    HABIT_SPORTY      = 'SPORTY'
    HABIT_TIDY        = 'TIDY'

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student_profile')
    university = models.CharField(max_length=200, blank=True)
    degree = models.CharField(max_length=200, blank=True)
    enrollment_doc = models.FileField(upload_to='documents/enrollment/', null=True, blank=True)
    iban = models.CharField(max_length=34, blank=True)
    enrollment_verified = models.BooleanField(default=False)

    age          = models.PositiveSmallIntegerField(null=True, blank=True)
    course       = models.PositiveSmallIntegerField(null=True, blank=True)
    city         = models.CharField(max_length=100, blank=True)
    roommate_bio = models.TextField(blank=True)
    habits       = models.JSONField(default=list, blank=True)
    profile_public = models.BooleanField(default=True)

    def __str__(self):
        return f'Estudiante: {self.user.get_full_name()}'


class OwnerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='owner_profile')
    company_name = models.CharField(max_length=200, blank=True)
    property_title_doc = models.FileField(upload_to='documents/property_titles/', null=True, blank=True)
    identity_doc = models.FileField(upload_to='documents/identity/', null=True, blank=True)
    identity_verified = models.BooleanField(default=False)
    member_since = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'Propietario: {self.user.get_full_name()}'


class Document(models.Model):
    TYPE_DNI = 'DNI'
    TYPE_ENROLLMENT = 'ENROLLMENT'
    TYPE_IBAN = 'IBAN'
    TYPE_CONTRACT = 'CONTRACT'
    TYPE_PROPERTY_TITLE = 'PROPERTY_TITLE'
    TYPE_CHOICES = [
        (TYPE_DNI, 'DNI / Pasaporte'),
        (TYPE_ENROLLMENT, 'Matrícula universitaria'),
        (TYPE_IBAN, 'IBAN domiciliación'),
        (TYPE_CONTRACT, 'Contrato de arrendamiento'),
        (TYPE_PROPERTY_TITLE, 'Título de propiedad'),
    ]

    STATUS_PENDING = 'PENDING'
    STATUS_IN_REVIEW = 'IN_REVIEW'
    STATUS_APPROVED = 'APPROVED'
    STATUS_REJECTED = 'REJECTED'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pendiente'),
        (STATUS_IN_REVIEW, 'En revisión'),
        (STATUS_APPROVED, 'Aprobado'),
        (STATUS_REJECTED, 'Rechazado'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='documents')
    doc_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    file = models.FileField(upload_to='documents/misc/')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)

    def __str__(self):
        return f'{self.get_doc_type_display()} – {self.user.email}'


class EmailVerificationToken(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='email_token')
    token = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Token verificación: {self.user.email}'

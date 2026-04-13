from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, StudentProfile, OwnerProfile, Document

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_verified', 'date_joined')
    list_filter = ('role', 'is_verified', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    fieldsets = UserAdmin.fieldsets + (
        ('Stugether', {'fields': ('role', 'phone', 'bio', 'is_verified')}),
    )

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'university', 'degree', 'enrollment_verified')
    list_filter = ('enrollment_verified',)
    search_fields = ('user__email', 'university')

@admin.register(OwnerProfile)
class OwnerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'company_name', 'identity_verified', 'member_since')
    list_filter = ('identity_verified',)

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('user', 'doc_type', 'status', 'uploaded_at', 'reviewed_at')
    list_filter = ('doc_type', 'status')
    search_fields = ('user__email',)
    actions = ['approve_documents', 'reject_documents']

    def approve_documents(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='APPROVED', reviewed_at=timezone.now())
    approve_documents.short_description = 'Aprobar documentos seleccionados'

    def reject_documents(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='REJECTED', reviewed_at=timezone.now())
    reject_documents.short_description = 'Rechazar documentos seleccionados'

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import StudentProfile, OwnerProfile, Document

User = get_user_model()


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['university', 'degree', 'iban', 'enrollment_verified',
                  'age', 'course', 'city', 'roommate_bio', 'habits']
        read_only_fields = ['enrollment_verified']


class PublicStudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['university', 'degree', 'enrollment_verified',
                  'age', 'course', 'city', 'roommate_bio', 'habits']
        read_only_fields = fields


class OwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerProfile
        fields = ['company_name', 'identity_verified', 'member_since']


class UserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    owner_profile = OwnerProfileSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    # Writable flattened student-profile fields
    university   = serializers.CharField(required=False, allow_blank=True, write_only=True)
    degree       = serializers.CharField(required=False, allow_blank=True, write_only=True)
    age          = serializers.IntegerField(required=False, allow_null=True, write_only=True)
    course       = serializers.IntegerField(required=False, allow_null=True, write_only=True)
    city         = serializers.CharField(required=False, allow_blank=True, write_only=True)
    roommate_bio = serializers.CharField(required=False, allow_blank=True, write_only=True)
    habits       = serializers.ListField(child=serializers.CharField(), required=False, write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'role', 'avatar', 'phone', 'bio', 'is_verified', 'created_at',
            'student_profile', 'owner_profile',
            'university', 'degree', 'age', 'course', 'city', 'roommate_bio', 'habits',
        ]
        read_only_fields = ['id', 'is_verified', 'created_at', 'role']

    def get_full_name(self, obj):
        return obj.get_full_name()

    def update(self, instance, validated_data):
        profile_fields = ['university', 'degree', 'age', 'course', 'city', 'roommate_bio', 'habits']
        profile_data = {f: validated_data.pop(f) for f in profile_fields if f in validated_data}
        instance = super().update(instance, validated_data)
        if profile_data:
            profile, _ = StudentProfile.objects.get_or_create(user=instance)
            for attr, val in profile_data.items():
                setattr(profile, attr, val)
            profile.save()
        return instance


class PublicUserSerializer(serializers.ModelSerializer):
    student_profile = PublicStudentProfileSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'full_name', 'avatar',
                  'bio', 'is_verified', 'created_at', 'student_profile']

    def get_full_name(self, obj):
        return obj.get_full_name()

    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.avatar:
            return request.build_absolute_uri(obj.avatar.url) if request else obj.avatar.url
        return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    university = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'password', 'password_confirm',
            'university',
        ]

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Las contraseñas no coinciden.'})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('password_confirm')
        university = validated_data.pop('university', '')

        validated_data['username'] = validated_data['email'].split('@')[0]
        validated_data['role'] = User.ROLE_STUDENT

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        StudentProfile.objects.create(user=user, university=university)

        return user


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'doc_type', 'file', 'status', 'uploaded_at', 'reviewed_at', 'rejection_reason']
        read_only_fields = ['id', 'status', 'uploaded_at', 'reviewed_at', 'rejection_reason']

from rest_framework import permissions


class IsEmailVerified(permissions.BasePermission):
    message = 'Debes verificar tu email antes de realizar esta acción.'

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_verified
        )

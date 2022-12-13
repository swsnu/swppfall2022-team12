from rest_framework import permissions


class IsOwnerOrCreateReadOnly(permissions.BasePermission):
    """
    Only object's owner can update / delete object.
    Not owner but Authenticated user can create / get objects.
    """

    message = "Not allowed."

    def has_permission(self, request, view):
        if request.method == "POST":
            return request.user.is_authenticated
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user

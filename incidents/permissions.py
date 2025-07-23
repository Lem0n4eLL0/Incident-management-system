from rest_framework.permissions import BasePermission

class IsManagerOrAdmin(BasePermission):
    """
    Разрешает доступ только для руководителей и администраторов.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in ['manager', 'admin']
        )

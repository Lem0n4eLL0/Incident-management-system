from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import User
from .serializers import UserSerializer
from .permissions import IsAdmin
from .serializers import UserSerializer, UserCreateByAdminSerializer, UserSelfUpdateSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

from .serializers import CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.select_related('unit').all()
        return User.objects.select_related('unit').filter(id=user.id)


    def get_serializer_class(self):
        user = self.request.user
        if self.action in ['create', 'update', 'partial_update']:
            if user.role == 'admin':
                return UserCreateByAdminSerializer
            return UserSelfUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == 'create' or self.action == 'destroy':
            return [IsAdmin()]
        if self.action in ['update', 'partial_update']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        if request.user.role != 'admin' and request.user.id != self.get_object().id:
            raise PermissionDenied("Вы можете редактировать только свой профиль.")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if request.user.role != 'admin' and request.user.id != self.get_object().id:
            raise PermissionDenied("Вы можете редактировать только свой профиль.")
        return super().partial_update(request, *args, **kwargs)

    def get_serializer_context(self):
        return {'request': self.request}

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response.data['success'] = True
        return response



class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            data = response.data
            data['success'] = True
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({'success': False}, status=response.status_code)

class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            data = response.data
            data['success'] = True
            return Response(data, status=status.HTTP_200_OK)
        except Exception:
            return Response({'success': False}, status=status.HTTP_401_UNAUTHORIZED)



@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def logout_user(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        tokens = OutstandingToken.objects.filter(user=user)
        for token in tokens:
            _, _ = BlacklistedToken.objects.get_or_create(token=token)
        return Response({'detail': f'User {user.email} successfully logged out.'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def logout_all_users(request):
    tokens = OutstandingToken.objects.all()
    for token in tokens:
        _, _ = BlacklistedToken.objects.get_or_create(token=token)
    return Response({'detail': 'All users successfully logged out.'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([permissions.IsAdminUser])
def soft_delete_user(request, user_id):
    try:
        user = User.all_objects.get(pk=user_id)  # доступ к удалённым
        user.is_deleted = True
        user.save()
        return Response({'detail': 'User soft-deleted.'})
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# Create your views here.

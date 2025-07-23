"""
URL configuration for incident_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from users.views import CustomTokenObtainPairView
from users.views import CustomTokenRefreshView, CustomTokenVerifyView
from users.views import logout_user, logout_all_users

from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView, TokenVerifyView,
)

from incidents.views import IncidentViewSet, soft_delete_incident
from users.views import soft_delete_user

from users.views import current_user_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/token/verify/', CustomTokenVerifyView.as_view(), name='token_verify'),
    path('api/', include('users.urls')),
    path('api/incidents/', include('incidents.urls')),
    path('logout_user/<uuid:user_id>/', logout_user, name='logout_user'),
    path('logout_all_users/', logout_all_users, name='logout_all_users'),
    path('soft_delete_user/<uuid:user_id>/', soft_delete_user, name='soft_delete_user'),
    path('me/', current_user_view, name='current-user'),

]

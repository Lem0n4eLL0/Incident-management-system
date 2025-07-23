import uuid
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager,
)

from users.managers import ActiveUserManager, UserManager

class Unit(models.Model):
    id   = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=128, unique=True)

    def __str__(self):
        return self.name

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError('Email обязателен')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra):
        extra.setdefault('role', User.Role.ADMIN)
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra)

class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        EMPLOYEE = 'employee', 'сотрудник'
        MANAGER  = 'manager',  'руководитель'
        ADMIN    = 'admin',    'администратор'

    id        = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email     = models.EmailField(unique=True)
    login = models.CharField(max_length=64, unique=True)
    full_name = models.CharField(max_length=128)
    unit      = models.ForeignKey(Unit, on_delete=models.PROTECT, related_name='users')
    position  = models.CharField(max_length=64)
    telephone = models.CharField(max_length=32)
    role      = models.CharField(max_length=16, choices=Role.choices, default=Role.EMPLOYEE)

    is_active = models.BooleanField(default=True)
    is_staff  = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    is_deleted = models.BooleanField(default=False) # флаг мягкого удаления
    objects = ActiveUserManager()  # фильтрует удалённых
    all_objects = UserManager()  # доступ ко всем

    USERNAME_FIELD = 'login'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.full_name

# Create your models here.

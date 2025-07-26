from rest_framework import serializers
from .models import User, Unit
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from django.utils import timezone

from django.utils.dateformat import format as django_date_format
from django.utils.timezone import now

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login

from django.db import IntegrityError
from rest_framework.exceptions import ValidationError

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ('id', 'name')

class UserSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    unit = serializers.SlugRelatedField(
            queryset=Unit.objects.all(),
            slug_field='name'
        )


 #   full_name_display = serializers.SerializerMethodField()

    last_login = serializers.SerializerMethodField()
    is_active = serializers.BooleanField(required=False)
    is_staff = serializers.BooleanField(read_only=True)
    password = serializers.CharField(write_only=True)
#    role_display = serializers.SerializerMethodField() # Для подгонки полей фронт-бэк
    role = serializers.ChoiceField(choices=User.Role.choices)

    class Meta:
        model = User
        fields = (
            'id', 'role', 'login', 'full_name', 'unit',
            'position', 'telephone', 'email',
            'token',
            'last_login', 'is_active', 'is_staff', 'password'
        )


        read_only_fields = ('id', 'role', 'email')


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if not request or request.user.role != User.Role.ADMIN:
            for field in ['last_login', 'is_active', 'is_staff', 'password', 'token']:
                self.fields.pop(field, None)

    def get_last_login(self, obj):
        return obj.last_login.isoformat() if obj.last_login else ''




    def _get_latest_token(self, obj):
        tokens = OutstandingToken.objects.filter(user=obj).order_by('-created_at')
        return tokens.first() if tokens.exists() else None



    def get_token(self, obj):
        request = self.context.get('request')
        if not request or request.user.role != User.Role.ADMIN:
            return ''

        token = OutstandingToken.objects.filter(user=obj).order_by('-created_at').first()
        if not token:
            return ''

        return TokenInfoSerializer(token).data



    def get_full_name_display(self, obj):
        name = obj.full_name
        if obj.is_deleted:
            name += " (удалён)"
        return name

    def update(self, instance, validated_data):
        role = validated_data.get('role', instance.role)

        
        if role == 'admin':
            instance.is_staff = True
            instance.is_superuser = True
        else:
            instance.is_staff = False
            instance.is_superuser = False

        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance

class UserCreateByAdminSerializer(serializers.ModelSerializer):
    unit = serializers.CharField()
    password = serializers.CharField(write_only=True, required=False)  
    login = serializers.CharField(required=True)  
    role = serializers.ChoiceField(choices=User.Role.choices) 
    is_active = serializers.BooleanField(required=False)

    class Meta:
        model = User
        fields = (
            'email', 'login', 'password', 'full_name', 'unit', 'position', 'telephone', 'role', 'is_active'
        )

    def create(self, validated_data):

        unit_name = validated_data.pop('unit')
        unit, _ = Unit.objects.get_or_create(name=unit_name) 

        validated_data['unit'] = unit

        password = validated_data.pop('password')

        
        role = validated_data.get('role')
        if role == 'admin':
            validated_data['is_staff'] = True
            validated_data['is_superuser'] = True

        user = User(**validated_data)
        user.set_password(password)


        try:
            user.save()
        except IntegrityError:
            raise ValidationError({'login': 'Пользователь с таким логином уже существует.'})


        return user

    def update(self, instance, validated_data):

        unit_name = validated_data.pop('unit', None)
        if unit_name:
            unit, _ = Unit.objects.get_or_create(name=unit_name)
            validated_data['unit'] = unit

        password = validated_data.pop('password', None)

        role = validated_data.get('role', instance.role)

        
        if role == 'admin':
            instance.is_staff = True
            instance.is_superuser = True
        else:
            instance.is_staff = False
            instance.is_superuser = False

        is_active = validated_data.get('is_active')
        if is_active is not None:
            instance.is_active = is_active

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance

    def validate_login(self, value):
        instance = getattr(self, 'instance', None)
        existing = User.objects.filter(login=value)

        if instance:
            existing = existing.exclude(id=instance.id)

        if existing.exists():
            raise ValidationError("Пользователь с таким логином уже существует.")
        return value



class UserSelfUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'telephone')

class TokenInfoSerializer(serializers.ModelSerializer):
    is_blacklisted = serializers.SerializerMethodField()
    created_at_formatted = serializers.SerializerMethodField()
    expires_at_formatted = serializers.SerializerMethodField()
    token_timer = serializers.SerializerMethodField()

    class Meta:
        model = OutstandingToken
        fields = (
            'jti', 'is_blacklisted',
            'created_at_formatted', 'expires_at_formatted', 'token_timer',
        )



    def get_is_blacklisted(self, obj):
        return hasattr(obj, 'blacklistedtoken')

    def get_created_at_formatted(self, obj):
        return django_date_format(obj.created_at, "F j, Y, P")  

    def get_expires_at_formatted(self, obj):
        return django_date_format(obj.expires_at, "F j, Y, P")

    def get_token_timer(self, obj):
        delta = obj.expires_at - now()
        total_seconds = int(delta.total_seconds())

        if total_seconds < 0:
            return "expired"

        days = total_seconds // 86400
        hours = (total_seconds % 86400) // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60

        return f"{days} days; {hours:02d}h {minutes:02d}m {seconds:02d}s"

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    login = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')

        try:
            user = User.objects.get(login=login)
        except User.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Неверный логин или пароль'})

        if not user.check_password(password):
            raise serializers.ValidationError({'detail': 'Неверный логин или пароль'})

        if not user.is_active:
            raise serializers.ValidationError({'detail': 'Пользователь деактивирован'})

        update_last_login(None, user)

        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['login']  

class UserRestrictedSerializer(serializers.ModelSerializer):
    unit = serializers.CharField(source='unit.name', read_only=True)
    role = serializers.ChoiceField(choices=User.Role.choices)
    class Meta:
        model = User
        fields = [
            'id',
            'role',
            'full_name',
            'unit',
            'position',
            'telephone',
            'email',
        ]
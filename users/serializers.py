from rest_framework import serializers
from .models import User, Unit
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from django.utils import timezone

from django.utils.dateformat import format as django_date_format
from django.utils.timezone import now

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

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
#    unit = UnitSerializer(read_only=True) 
#    unit = serializers.CharField(source='unit.name', read_only=True) #Для подгонки полей фронт-бэк
#    unit_id = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all(), source='unit', write_only=True)

 #   full_name_display = serializers.SerializerMethodField()

    last_login = serializers.SerializerMethodField()
    is_active = serializers.BooleanField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    password = serializers.CharField(write_only=True)
#    role_display = serializers.SerializerMethodField() # Для подгонки полей фронт-бэк
    role = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'role', 'login', 'full_name', 'unit',
            'position', 'telephone', 'email',
            'token',
            'last_login', 'is_active', 'is_staff', 'password'
        )

# убрал 'unit_id', 'role_display', для подгонки    'full_name_display',
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


#Для подгонки полей фронт-бэк
    def get_role_display(self, obj):
        return obj.get_role_display()

    def get_full_name_display(self, obj):
        name = obj.full_name
        if obj.is_deleted:
            name += " (удалён)"
        return name

class UserCreateByAdminSerializer(serializers.ModelSerializer):
    unit = serializers.CharField()
    password = serializers.CharField(write_only=True, required=False)  # при update пароль может не передаваться
    login = serializers.CharField(required=True)  # <--- добавили поле

    class Meta:
        model = User
        fields = (
            'email', 'login', 'password', 'full_name', 'unit', 'position', 'telephone', 'role'
        )

    def create(self, validated_data):

        unit_name = validated_data.pop('unit')
        unit, _ = Unit.objects.get_or_create(name=unit_name)  # ← ключевой момент

        validated_data['unit'] = unit

        password = validated_data.pop('password')

        # 👉 Назначаем админ-флаги, если роль — admin
        role = validated_data.get('role')
        if role == 'admin':
            validated_data['is_staff'] = True
            validated_data['is_superuser'] = True

        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):

        unit_name = validated_data.pop('unit', None)
        if unit_name:
            unit, _ = Unit.objects.get_or_create(name=unit_name)
            validated_data['unit'] = unit

        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance

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

    #    fields = (
    #        'jti', 'created_at', 'expires_at', 'is_blacklisted',
    #        'created_at_formatted', 'expires_at_formatted', 'expires_in_pretty',
    #    )

    def get_is_blacklisted(self, obj):
        return hasattr(obj, 'blacklistedtoken')

    def get_created_at_formatted(self, obj):
        return django_date_format(obj.created_at, "F j, Y, P")  # July 20, 2025, 9:59 a.m.

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

        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['login']  # исключаем login

class UserRestrictedSerializer(serializers.ModelSerializer):
    unit = serializers.CharField(source='unit.name', read_only=True)
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
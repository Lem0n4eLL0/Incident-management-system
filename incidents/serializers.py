from rest_framework import serializers
from .models import Incident
from users.serializers import UserSerializer

class IncidentSerializer(serializers.ModelSerializer):
    incident_number = serializers.CharField(required=False, allow_blank=True)
    author = UserSerializer(read_only=True)
    unit = serializers.SerializerMethodField()  # ← добавляем поле unit (строковое имя)

    class Meta:
        model = Incident
        fields = (
            'id', 'incident_number', 'type', 'date', 'unit', 'description',
            'author', 'status', 'measures_taken', 'responsible',
        )
        read_only_fields = ('id', 'author')

    def get_unit(self, obj):
        return str(obj.unit_snapshot.name) if obj.unit_snapshot else None

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['author'] = user
        validated_data['unit_snapshot'] = user.unit
        return super().create(validated_data)

    def validate_incident_number(self, value):

        if not value.strip():
            raise serializers.ValidationError("Номер инцидента не может быть пустым.")

        # Ищем все объекты с таким же номером
        qs = Incident.all_objects.filter(incident_number=value)

        # Исключаем текущий объект при обновлении
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError("Инцидент с таким номером уже существует.")
        return value

    def update(self, instance, validated_data):
        # Защитная логика (вдруг в будущем кто-то поставит required=False)
        if 'incident_number' in validated_data:
            incident_number = validated_data['incident_number']
            if not incident_number.strip():
                raise serializers.ValidationError({"incident_number": "Номер не может быть пустым."})
            instance.incident_number = incident_number

        # Обновление остальных полей
        for attr, value in validated_data.items():
            if attr != 'incident_number':
                setattr(instance, attr, value)

        instance.save()
        return instance

from rest_framework import serializers
from .models import Incident
from users.serializers import UserSerializer

class IncidentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Incident
        fields = (
            'id', 'incident_number', 'type', 'date', 'description',
            'author', 'status', 'measures_taken', 'responsible',
        )
        read_only_fields = ('id', 'author')

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['author'] = user
        validated_data['unit_snapshot'] = user.unit
        return super().create(validated_data)

    def validate_incident_number(self, value):
        # Проверяем существование записи, включая мягко удалённые
        if Incident.all_objects.filter(incident_number=value).exists():
            raise serializers.ValidationError(
                "Инцидент с таким номером уже существует."
            )
        return value
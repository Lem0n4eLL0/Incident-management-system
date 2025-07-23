import uuid
from django.db import models
from django.conf import settings
from users.models import Unit

from common.managers import ActiveManager, AllManager

class Incident(models.Model):
    class Type(models.TextChoices):
        ACCIDENT = 'авария', 'авария'
        INCIDENT = 'инцидент', 'инцидент'
        INJURY   = 'травма', 'травма'
        FIRE     = 'пожар', 'пожар'
        OTHER    = 'другое', 'другое'

    class Status(models.TextChoices):
        WORK  = 'в работе', 'в работе'
        DONE  = 'завершено', 'завершено'
        CHECK = 'на рассмотрении', 'на рассмотрении'

    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident_number = models.CharField(max_length=32, unique=True, db_index=True)
    type            = models.CharField(max_length=16, choices=Type.choices)
    date            = models.DateTimeField(db_index=True)
    description     = models.TextField()
    author          = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='incidents')
    unit_snapshot   = models.ForeignKey(Unit, on_delete=models.PROTECT, related_name='incidents')
    status          = models.CharField(max_length=16, choices=Status.choices, default=Status.WORK, blank=True)
    measures_taken  = models.TextField(blank=True)
    responsible     = models.CharField(max_length=128, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_deleted = models.BooleanField(default=False) # флаг мягкого удаления
    objects = ActiveManager()  # для активных (не удалённых)
    all_objects = AllManager()  # для всех, включая удалённых

    class Meta:
        indexes = [
            models.Index(fields=['type']),
            models.Index(fields=['status']),
        ]

# Create your models here.

from django.contrib import admin

from .models import Unit, User
from incidents.models import Incident

admin.site.register(Unit)
admin.site.register(User)
admin.site.register(Incident)

# Register your models here.

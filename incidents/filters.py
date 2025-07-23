import django_filters as df
from .models import Incident

class IncidentFilter(df.FilterSet):
    type   = df.CharFilter(field_name='type', lookup_expr='iexact')
    status = df.CharFilter(field_name='status', lookup_expr='iexact')
    unit   = df.UUIDFilter(field_name='unit_snapshot')
    date_after  = df.DateFilter(field_name='date', lookup_expr='gte')
    date_before = df.DateFilter(field_name='date', lookup_expr='lte')

    search = df.CharFilter(method='filter_search')

    class Meta:
        model = Incident
        fields = ['type', 'status']

    def filter_search(self, queryset, name, value):
        return queryset.filter(description__icontains=value)
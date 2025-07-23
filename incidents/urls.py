from rest_framework.routers import DefaultRouter
from .views import IncidentViewSet
from django.urls import path, include
from .views import IncidentAnalyticsAPIView

from .views import IncidentReportXLSXAPIView

from .views import IncidentSummaryAPIView

from .views import IncidentViewSet, soft_delete_incident
from .views import soft_delete_incident


router = DefaultRouter()
router.register('items', IncidentViewSet, basename='incident')

urlpatterns = [
    path('', include(router.urls)),
   # path('analytics/', IncidentAnalyticsAPIView.as_view(), name='incident-analytics'),
    path('analytics/report-xlsx/', IncidentReportXLSXAPIView.as_view(), name='incident-report-xlsx'),
   # path('summary/', IncidentSummaryAPIView.as_view(), name='incident-summary'),
    path('soft_delete_incident/<uuid:incident_id>/', soft_delete_incident, name='soft_delete_incident'),

]

#router.register('', IncidentViewSet)
#urlpatterns = router.urls
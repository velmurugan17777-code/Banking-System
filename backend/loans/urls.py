from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoanViewSet, LoanPaymentViewSet

router = DefaultRouter()
router.register(r'payments', LoanPaymentViewSet)
router.register(r'', LoanViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

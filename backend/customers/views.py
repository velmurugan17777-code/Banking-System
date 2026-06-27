from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Customer
from .serializers import CustomerSerializer, CustomerListSerializer, CustomerDetailSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    """ViewSet for managing bank customers."""
    queryset = Customer.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'risk_level', 'kyc_verified', 'gender', 'country', 'city']
    search_fields = ['first_name', 'last_name', 'email', 'phone', 'id_number']
    ordering_fields = ['created_at', 'first_name', 'last_name', 'email']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return CustomerListSerializer
        if self.action == 'retrieve':
            return CustomerDetailSerializer
        return CustomerSerializer

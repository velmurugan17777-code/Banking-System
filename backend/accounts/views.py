from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Account
from .serializers import AccountSerializer, AccountListSerializer


class AccountViewSet(viewsets.ModelViewSet):
    """ViewSet for managing bank accounts."""
    queryset = Account.objects.select_related('customer').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['account_type', 'status', 'currency', 'customer']
    search_fields = ['account_number', 'customer__first_name', 'customer__last_name']
    ordering_fields = ['opened_at', 'balance', 'account_number']
    ordering = ['-opened_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return AccountListSerializer
        return AccountSerializer

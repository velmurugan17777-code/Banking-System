from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Transaction
from .serializers import TransactionSerializer, TransactionListSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing transactions."""
    queryset = Transaction.objects.select_related('account__customer').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['transaction_type', 'status', 'category', 'account']
    search_fields = ['reference_number', 'description', 'account__account_number',
                     'account__customer__first_name', 'account__customer__last_name']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return TransactionListSerializer
        return TransactionSerializer

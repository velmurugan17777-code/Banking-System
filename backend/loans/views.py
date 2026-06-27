from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Loan, LoanPayment
from .serializers import LoanSerializer, LoanListSerializer, LoanPaymentSerializer


class LoanViewSet(viewsets.ModelViewSet):
    """ViewSet for managing loans."""
    queryset = Loan.objects.select_related('customer').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['loan_type', 'status', 'customer', 'collateral_type']
    search_fields = ['customer__first_name', 'customer__last_name']
    ordering_fields = ['applied_at', 'amount', 'interest_rate']
    ordering = ['-applied_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return LoanListSerializer
        return LoanSerializer


class LoanPaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing loan payments."""
    queryset = LoanPayment.objects.select_related('loan__customer').all()
    serializer_class = LoanPaymentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['loan', 'status']

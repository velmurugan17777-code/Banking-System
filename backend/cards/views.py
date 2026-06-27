from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Card
from .serializers import CardSerializer, CardListSerializer


class CardViewSet(viewsets.ModelViewSet):
    """ViewSet for managing cards."""
    queryset = Card.objects.select_related('customer', 'account').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['card_type', 'status', 'network', 'customer']
    search_fields = ['card_number', 'customer__first_name', 'customer__last_name']
    ordering_fields = ['issued_at', 'credit_limit', 'current_balance']
    ordering = ['-issued_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return CardListSerializer
        return CardSerializer

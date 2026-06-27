from rest_framework import serializers
from .models import Card


class CardSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    masked_number = serializers.ReadOnlyField()
    utilization_rate = serializers.ReadOnlyField()

    class Meta:
        model = Card
        fields = '__all__'

    def get_customer_name(self, obj):
        return obj.customer.full_name


class CardListSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    masked_number = serializers.ReadOnlyField()
    utilization_rate = serializers.ReadOnlyField()

    class Meta:
        model = Card
        fields = ('id', 'customer', 'customer_name', 'card_number',
                  'masked_number', 'card_type', 'network', 'credit_limit',
                  'current_balance', 'utilization_rate', 'status',
                  'expiry_date', 'issued_at')

    def get_customer_name(self, obj):
        return obj.customer.full_name

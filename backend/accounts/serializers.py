from rest_framework import serializers
from .models import Account


class AccountSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = '__all__'

    def get_customer_name(self, obj):
        return obj.customer.full_name


class AccountListSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = ('id', 'account_number', 'account_type', 'balance',
                  'currency', 'status', 'customer', 'customer_name',
                  'interest_rate', 'opened_at')

    def get_customer_name(self, obj):
        return obj.customer.full_name

from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    account_number = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = '__all__'

    def get_account_number(self, obj):
        return obj.account.account_number

    def get_customer_name(self, obj):
        return obj.account.customer.full_name


class TransactionListSerializer(serializers.ModelSerializer):
    account_number = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ('id', 'account', 'account_number', 'customer_name',
                  'transaction_type', 'amount', 'balance_after',
                  'description', 'reference_number', 'status',
                  'category', 'created_at')

    def get_account_number(self, obj):
        return obj.account.account_number

    def get_customer_name(self, obj):
        return obj.account.customer.full_name

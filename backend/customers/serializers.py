from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    accounts_count = serializers.SerializerMethodField()
    total_balance = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = '__all__'

    def get_accounts_count(self, obj):
        return obj.accounts.count() if hasattr(obj, 'accounts') else 0

    def get_total_balance(self, obj):
        if hasattr(obj, 'accounts'):
            total = obj.accounts.filter(status='active').aggregate(
                total=models.Sum('balance')
            )['total']
            return float(total) if total else 0.0
        return 0.0


class CustomerListSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Customer
        fields = ('id', 'first_name', 'last_name', 'full_name', 'email',
                  'phone', 'status', 'risk_level', 'kyc_verified',
                  'city', 'country', 'created_at')


# Fix the import for the aggregate
from django.db import models as db_models

class CustomerDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    accounts_count = serializers.SerializerMethodField()
    total_balance = serializers.SerializerMethodField()
    loans_count = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = '__all__'

    def get_accounts_count(self, obj):
        return obj.accounts.count()

    def get_total_balance(self, obj):
        total = obj.accounts.filter(status='active').aggregate(
            total=db_models.Sum('balance')
        )['total']
        return float(total) if total else 0.0

    def get_loans_count(self, obj):
        return obj.loans.count() if hasattr(obj, 'loans') else 0

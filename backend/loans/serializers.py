from rest_framework import serializers
from .models import Loan, LoanPayment


class LoanPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanPayment
        fields = '__all__'


class LoanSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    payments = LoanPaymentSerializer(many=True, read_only=True)
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Loan
        fields = '__all__'

    def get_customer_name(self, obj):
        return obj.customer.full_name

    def get_progress_percentage(self, obj):
        if obj.amount and float(obj.amount) > 0:
            return round(float(obj.total_paid) / float(obj.amount) * 100, 1)
        return 0.0


class LoanListSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Loan
        fields = ('id', 'customer', 'customer_name', 'loan_type', 'amount',
                  'interest_rate', 'tenure_months', 'emi_amount', 'status',
                  'outstanding_amount', 'total_paid', 'progress_percentage',
                  'next_payment_date', 'applied_at')

    def get_customer_name(self, obj):
        return obj.customer.full_name

    def get_progress_percentage(self, obj):
        if obj.amount and float(obj.amount) > 0:
            return round(float(obj.total_paid) / float(obj.amount) * 100, 1)
        return 0.0

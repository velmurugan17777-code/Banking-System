from django.contrib import admin
from .models import Loan, LoanPayment


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ('customer', 'loan_type', 'amount', 'interest_rate', 'status', 'emi_amount')
    list_filter = ('loan_type', 'status', 'collateral_type')
    search_fields = ('customer__first_name', 'customer__last_name')


@admin.register(LoanPayment)
class LoanPaymentAdmin(admin.ModelAdmin):
    list_display = ('loan', 'amount', 'payment_date', 'status')
    list_filter = ('status',)

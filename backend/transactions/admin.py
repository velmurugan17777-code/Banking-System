from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('reference_number', 'account', 'transaction_type', 'amount', 'status', 'category', 'created_at')
    list_filter = ('transaction_type', 'status', 'category')
    search_fields = ('reference_number', 'description')

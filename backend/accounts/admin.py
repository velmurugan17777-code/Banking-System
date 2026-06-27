from django.contrib import admin
from .models import Account


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('account_number', 'customer', 'account_type', 'balance', 'currency', 'status')
    list_filter = ('account_type', 'status', 'currency')
    search_fields = ('account_number', 'customer__first_name', 'customer__last_name')

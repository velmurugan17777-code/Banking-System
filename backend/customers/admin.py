from django.contrib import admin
from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone', 'status', 'risk_level', 'kyc_verified')
    list_filter = ('status', 'risk_level', 'kyc_verified', 'gender', 'country')
    search_fields = ('first_name', 'last_name', 'email', 'phone')

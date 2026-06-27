from django.contrib import admin
from .models import Card


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('card_number', 'customer', 'card_type', 'network', 'status', 'credit_limit')
    list_filter = ('card_type', 'status', 'network')
    search_fields = ('card_number', 'customer__first_name', 'customer__last_name')

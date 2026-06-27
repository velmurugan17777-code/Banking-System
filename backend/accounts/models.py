from django.db import models
from customers.models import Customer
import random
import string


class Account(models.Model):
    """Bank account model."""

    TYPE_CHOICES = [
        ('savings', 'Savings'),
        ('checking', 'Checking'),
        ('business', 'Business'),
        ('fixed_deposit', 'Fixed Deposit'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('dormant', 'Dormant'),
        ('closed', 'Closed'),
        ('frozen', 'Frozen'),
    ]

    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
        ('INR', 'Indian Rupee'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='accounts')
    account_number = models.CharField(max_length=20, unique=True)
    account_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='savings')
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    opened_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-opened_at']

    def __str__(self):
        return f"{self.account_number} - {self.customer.full_name}"

    def save(self, *args, **kwargs):
        if not self.account_number:
            self.account_number = self.generate_account_number()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_account_number():
        """Generate a unique 10-digit account number."""
        prefix = '10'
        suffix = ''.join(random.choices(string.digits, k=8))
        return prefix + suffix

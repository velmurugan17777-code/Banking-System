from django.db import models
from customers.models import Customer
from accounts.models import Account


class Card(models.Model):
    """Bank card model."""

    TYPE_CHOICES = [
        ('credit', 'Credit Card'),
        ('debit', 'Debit Card'),
        ('prepaid', 'Prepaid Card'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('blocked', 'Blocked'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]

    NETWORK_CHOICES = [
        ('visa', 'Visa'),
        ('mastercard', 'Mastercard'),
        ('amex', 'American Express'),
        ('rupay', 'RuPay'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='cards')
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='cards')
    card_number = models.CharField(max_length=19, unique=True)
    card_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    network = models.CharField(max_length=15, choices=NETWORK_CHOICES, default='visa')
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    current_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    daily_limit = models.DecimalField(max_digits=10, decimal_places=2, default=5000.00)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='active')
    expiry_date = models.DateField()
    cvv = models.CharField(max_length=4, default='***')
    issued_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-issued_at']

    def __str__(self):
        return f"{self.card_type} - ****{self.card_number[-4:]}"

    @property
    def masked_number(self):
        return f"**** **** **** {self.card_number[-4:]}"

    @property
    def utilization_rate(self):
        if self.credit_limit and float(self.credit_limit) > 0:
            return round(float(self.current_balance) / float(self.credit_limit) * 100, 1)
        return 0.0

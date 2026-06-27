from django.db import models
from accounts.models import Account
import uuid


class Transaction(models.Model):
    """Bank transaction model."""

    TYPE_CHOICES = [
        ('credit', 'Credit'),
        ('debit', 'Debit'),
        ('transfer', 'Transfer'),
    ]

    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
        ('reversed', 'Reversed'),
    ]

    CATEGORY_CHOICES = [
        ('salary', 'Salary'),
        ('utilities', 'Utilities'),
        ('shopping', 'Shopping'),
        ('transfer', 'Transfer'),
        ('loan_payment', 'Loan Payment'),
        ('interest', 'Interest'),
        ('fee', 'Fee'),
        ('food', 'Food & Dining'),
        ('entertainment', 'Entertainment'),
        ('healthcare', 'Healthcare'),
        ('education', 'Education'),
        ('travel', 'Travel'),
        ('other', 'Other'),
    ]

    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    balance_after = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    description = models.CharField(max_length=255, blank=True, default='')
    reference_number = models.CharField(max_length=50, unique=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    recipient_account = models.CharField(max_length=20, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_type} - {self.amount} ({self.reference_number})"

    def save(self, *args, **kwargs):
        if not self.reference_number:
            self.reference_number = f"TXN-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)

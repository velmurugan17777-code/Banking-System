from django.db import models
from customers.models import Customer


class Loan(models.Model):
    """Loan application and management model."""

    TYPE_CHOICES = [
        ('personal', 'Personal Loan'),
        ('home', 'Home Loan'),
        ('auto', 'Auto Loan'),
        ('business', 'Business Loan'),
        ('education', 'Education Loan'),
    ]

    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('disbursed', 'Disbursed'),
        ('closed', 'Closed'),
        ('rejected', 'Rejected'),
    ]

    COLLATERAL_CHOICES = [
        ('property', 'Property'),
        ('vehicle', 'Vehicle'),
        ('gold', 'Gold'),
        ('fixed_deposit', 'Fixed Deposit'),
        ('none', 'None'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='loans')
    loan_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    tenure_months = models.IntegerField()
    emi_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_paid = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    outstanding_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')

    # Collateral
    collateral_type = models.CharField(max_length=20, choices=COLLATERAL_CHOICES, default='none')
    collateral_value = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)

    # Dates
    applied_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    disbursed_at = models.DateTimeField(null=True, blank=True)
    next_payment_date = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.loan_type} - {self.amount} ({self.customer.full_name})"

    def save(self, *args, **kwargs):
        if self.amount and self.interest_rate and self.tenure_months:
            # Calculate EMI: P * r * (1+r)^n / ((1+r)^n - 1)
            p = float(self.amount)
            r = float(self.interest_rate) / 12 / 100
            n = self.tenure_months
            if r > 0:
                self.emi_amount = round(p * r * (1 + r) ** n / ((1 + r) ** n - 1), 2)
            else:
                self.emi_amount = round(p / n, 2)
        if not self.outstanding_amount:
            self.outstanding_amount = self.amount
        super().save(*args, **kwargs)


class LoanPayment(models.Model):
    """Individual loan payment record."""

    STATUS_CHOICES = [
        ('paid', 'Paid'),
        ('pending', 'Pending'),
        ('overdue', 'Overdue'),
    ]

    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    principal_component = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    interest_component = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    payment_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['payment_date']

    def __str__(self):
        return f"Payment {self.amount} for {self.loan}"

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Avg, Q
from django.db.models.functions import TruncMonth, TruncDay
from django.utils import timezone
from datetime import timedelta

from customers.models import Customer
from accounts.models import Account
from transactions.models import Transaction
from loans.models import Loan
from cards.models import Card


class DashboardView(APIView):
    """Dashboard KPIs and summary data."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

        # Customer stats
        total_customers = Customer.objects.count()
        active_customers = Customer.objects.filter(status='active').count()
        new_customers_30d = Customer.objects.filter(created_at__gte=thirty_days_ago).count()

        # Account stats
        total_accounts = Account.objects.count()
        active_accounts = Account.objects.filter(status='active').count()
        total_deposits = Account.objects.filter(status='active').aggregate(
            total=Sum('balance'))['total'] or 0

        # Account type distribution
        account_distribution = list(
            Account.objects.filter(status='active')
            .values('account_type')
            .annotate(count=Count('id'), total_balance=Sum('balance'))
            .order_by('account_type')
        )

        # Transaction stats
        total_transactions = Transaction.objects.count()
        recent_transactions_count = Transaction.objects.filter(
            created_at__gte=thirty_days_ago).count()
        transaction_volume = Transaction.objects.filter(
            created_at__gte=thirty_days_ago,
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Recent transactions
        recent_transactions = list(
            Transaction.objects.select_related('account__customer')
            .order_by('-created_at')[:10]
            .values('id', 'transaction_type', 'amount', 'status',
                    'description', 'category', 'reference_number',
                    'created_at', 'account__account_number',
                    'account__customer__first_name',
                    'account__customer__last_name')
        )

        # Loan stats
        total_loans = Loan.objects.count()
        active_loans = Loan.objects.filter(status='disbursed').count()
        total_loan_amount = Loan.objects.filter(
            status='disbursed').aggregate(total=Sum('amount'))['total'] or 0
        pending_approvals = Loan.objects.filter(
            status__in=['applied', 'under_review']).count()

        # Card stats
        total_cards = Card.objects.count()
        active_cards = Card.objects.filter(status='active').count()

        # Monthly revenue (from transaction fees — simulated as 0.1% of transactions)
        monthly_revenue = list(
            Transaction.objects.filter(
                status='completed',
                created_at__gte=now - timedelta(days=365)
            )
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(
                volume=Sum('amount'),
                count=Count('id')
            )
            .order_by('month')
        )

        return Response({
            'customers': {
                'total': total_customers,
                'active': active_customers,
                'new_30d': new_customers_30d,
            },
            'accounts': {
                'total': total_accounts,
                'active': active_accounts,
                'total_deposits': float(total_deposits),
                'distribution': account_distribution,
            },
            'transactions': {
                'total': total_transactions,
                'recent_count': recent_transactions_count,
                'volume_30d': float(transaction_volume),
                'recent': recent_transactions,
            },
            'loans': {
                'total': total_loans,
                'active': active_loans,
                'total_amount': float(total_loan_amount),
                'pending_approvals': pending_approvals,
            },
            'cards': {
                'total': total_cards,
                'active': active_cards,
            },
            'monthly_revenue': monthly_revenue,
        })


class RevenueAnalyticsView(APIView):
    """Revenue analytics data."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()

        monthly_data = list(
            Transaction.objects.filter(
                status='completed',
                created_at__gte=now - timedelta(days=365)
            )
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(
                total_volume=Sum('amount'),
                transaction_count=Count('id'),
                avg_amount=Avg('amount')
            )
            .order_by('month')
        )

        # By category
        category_data = list(
            Transaction.objects.filter(
                status='completed',
                created_at__gte=now - timedelta(days=90)
            )
            .values('category')
            .annotate(
                total=Sum('amount'),
                count=Count('id')
            )
            .order_by('-total')
        )

        return Response({
            'monthly': monthly_data,
            'by_category': category_data,
        })


class CustomerGrowthView(APIView):
    """Customer growth analytics."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()

        monthly_growth = list(
            Customer.objects.filter(
                created_at__gte=now - timedelta(days=365)
            )
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(new_customers=Count('id'))
            .order_by('month')
        )

        # Status distribution
        status_dist = list(
            Customer.objects.values('status')
            .annotate(count=Count('id'))
        )

        # Risk distribution
        risk_dist = list(
            Customer.objects.values('risk_level')
            .annotate(count=Count('id'))
        )

        # Geographic distribution
        geo_dist = list(
            Customer.objects.values('country')
            .annotate(count=Count('id'))
            .order_by('-count')[:10]
        )

        return Response({
            'monthly_growth': monthly_growth,
            'status_distribution': status_dist,
            'risk_distribution': risk_dist,
            'geographic_distribution': geo_dist,
        })

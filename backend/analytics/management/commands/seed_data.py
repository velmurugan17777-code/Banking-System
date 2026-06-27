"""
Management command to seed the database with realistic demo data.
Creates customers, accounts, transactions, loans, and cards.
"""
import random
from datetime import timedelta, date
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model

from customers.models import Customer
from accounts.models import Account
from transactions.models import Transaction
from loans.models import Loan, LoanPayment
from cards.models import Card

User = get_user_model()

FIRST_NAMES_MALE = [
    'James', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
    'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Steven',
    'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy',
    'Ronald', 'Edward', 'Jason', 'Jeffrey',
]

FIRST_NAMES_FEMALE = [
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan',
    'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret',
    'Sandra', 'Ashley', 'Dorothy', 'Kimberly', 'Emily', 'Donna', 'Michelle',
    'Carol', 'Amanda', 'Melissa', 'Deborah',
]

LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
    'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
    'Ramirez', 'Lewis', 'Robinson',
]

CITIES = [
    ('New York', 'NY', 'United States'),
    ('Los Angeles', 'CA', 'United States'),
    ('Chicago', 'IL', 'United States'),
    ('Houston', 'TX', 'United States'),
    ('Phoenix', 'AZ', 'United States'),
    ('San Francisco', 'CA', 'United States'),
    ('Seattle', 'WA', 'United States'),
    ('Boston', 'MA', 'United States'),
    ('Denver', 'CO', 'United States'),
    ('Atlanta', 'GA', 'United States'),
    ('Miami', 'FL', 'United States'),
    ('Dallas', 'TX', 'United States'),
    ('London', 'England', 'United Kingdom'),
    ('Toronto', 'Ontario', 'Canada'),
    ('Sydney', 'NSW', 'Australia'),
    ('Mumbai', 'Maharashtra', 'India'),
    ('Berlin', 'Berlin', 'Germany'),
    ('Tokyo', 'Tokyo', 'Japan'),
    ('Paris', 'Ile-de-France', 'France'),
    ('Singapore', 'Singapore', 'Singapore'),
]

STREETS = [
    '123 Main St', '456 Oak Ave', '789 Pine Rd', '321 Elm St',
    '654 Maple Dr', '987 Cedar Ln', '147 Birch Way', '258 Walnut Blvd',
    '369 Cherry Ct', '741 Spruce Pl', '852 Willow Rd', '963 Ash St',
]

TRANSACTION_DESCRIPTIONS = {
    'salary': ['Monthly Salary', 'Quarterly Bonus', 'Annual Bonus', 'Freelance Payment'],
    'utilities': ['Electric Bill', 'Water Bill', 'Gas Bill', 'Internet Service', 'Phone Bill'],
    'shopping': ['Amazon Purchase', 'Walmart Shopping', 'Target Purchase', 'Best Buy Electronics'],
    'transfer': ['Wire Transfer', 'Bank Transfer', 'Peer Transfer', 'International Transfer'],
    'food': ['Restaurant Dining', 'Grocery Store', 'Coffee Shop', 'Food Delivery'],
    'entertainment': ['Netflix Subscription', 'Spotify Premium', 'Movie Tickets', 'Concert Tickets'],
    'healthcare': ['Doctor Visit', 'Pharmacy Purchase', 'Lab Tests', 'Health Insurance'],
    'education': ['Tuition Fee', 'Book Purchase', 'Online Course', 'Workshop Fee'],
    'travel': ['Flight Booking', 'Hotel Stay', 'Car Rental', 'Train Ticket'],
    'other': ['ATM Withdrawal', 'Miscellaneous', 'Cash Deposit', 'Check Deposit'],
}


class Command(BaseCommand):
    help = 'Seed the database with realistic demo data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--customers', type=int, default=50,
            help='Number of customers to create (default: 50)'
        )

    def handle(self, *args, **options):
        num_customers = options['customers']
        self.stdout.write(self.style.WARNING('Seeding Banking CRM database...'))

        # Create admin user if not exists
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@bankingcrm.com',
                password='admin123',
                first_name='System',
                last_name='Administrator',
                role='admin',
                phone='+1-555-0100',
            )
            self.stdout.write(self.style.SUCCESS('   Admin user created (admin/admin123)'))

        # Create demo users
        demo_users = [
            ('manager', 'manager@bankingcrm.com', 'manager123', 'Sarah', 'Connor', 'manager'),
            ('teller', 'teller@bankingcrm.com', 'teller123', 'John', 'Doe', 'teller'),
            ('viewer', 'viewer@bankingcrm.com', 'viewer123', 'Jane', 'Smith', 'viewer'),
        ]
        for username, email, password, first, last, role in demo_users:
            if not User.objects.filter(username=username).exists():
                User.objects.create_user(
                    username=username, email=email, password=password,
                    first_name=first, last_name=last, role=role, phone='+1-555-0101',
                )
        self.stdout.write(self.style.SUCCESS('   Demo users created'))

        # Create customers
        now = timezone.now()
        customers = []
        for i in range(num_customers):
            gender = random.choice(['male', 'female'])
            first_name = random.choice(FIRST_NAMES_MALE if gender == 'male' else FIRST_NAMES_FEMALE)
            last_name = random.choice(LAST_NAMES)
            city, state, country = random.choice(CITIES)

            customer = Customer(
                first_name=first_name,
                last_name=last_name,
                email=f"{first_name.lower()}.{last_name.lower()}{i}@email.com",
                phone=f"+1-555-{random.randint(1000, 9999)}",
                date_of_birth=date(
                    random.randint(1960, 2000),
                    random.randint(1, 12),
                    random.randint(1, 28)
                ),
                gender=gender,
                address=random.choice(STREETS),
                city=city,
                state=state,
                country=country,
                zip_code=f"{random.randint(10000, 99999)}",
                id_type=random.choice(['passport', 'national_id', 'drivers_license', 'voter_id']),
                id_number=f"ID-{random.randint(100000, 999999)}",
                kyc_verified=random.random() > 0.15,
                status=random.choices(['active', 'inactive', 'suspended'], weights=[85, 10, 5])[0],
                risk_level=random.choices(['low', 'medium', 'high'], weights=[60, 30, 10])[0],
            )
            # Set created_at to a random date in the past year
            customer.save()
            days_ago = random.randint(0, 365)
            Customer.objects.filter(pk=customer.pk).update(
                created_at=now - timedelta(days=days_ago)
            )
            customer.refresh_from_db()
            customers.append(customer)

        self.stdout.write(self.style.SUCCESS(f'   {num_customers} customers created'))

        # Create accounts (1-3 per customer)
        account_types = ['savings', 'checking', 'business', 'fixed_deposit']
        accounts = []
        for customer in customers:
            num_accounts = random.randint(1, 3)
            used_types = set()
            for _ in range(num_accounts):
                atype = random.choice([t for t in account_types if t not in used_types])
                used_types.add(atype)
                balance = Decimal(str(round(random.uniform(500, 150000), 2)))
                interest_rates = {
                    'savings': Decimal('3.50'),
                    'checking': Decimal('0.50'),
                    'business': Decimal('2.00'),
                    'fixed_deposit': Decimal(str(round(random.uniform(5.0, 8.5), 2))),
                }
                account = Account(
                    customer=customer,
                    account_type=atype,
                    balance=balance,
                    currency=random.choices(['USD', 'EUR', 'GBP', 'INR'], weights=[70, 10, 10, 10])[0],
                    status=random.choices(['active', 'dormant', 'closed', 'frozen'], weights=[80, 10, 5, 5])[0],
                    interest_rate=interest_rates[atype],
                )
                account.save()
                accounts.append(account)

        self.stdout.write(self.style.SUCCESS(f'   {len(accounts)} accounts created'))

        # Create transactions (5-15 per account for active accounts)
        active_accounts = [a for a in accounts if a.status == 'active']
        txn_count = 0
        for account in active_accounts:
            num_txns = random.randint(5, 15)
            balance = float(account.balance)
            for j in range(num_txns):
                txn_type = random.choices(
                    ['credit', 'debit', 'transfer'],
                    weights=[40, 40, 20]
                )[0]
                category = random.choice(list(TRANSACTION_DESCRIPTIONS.keys()))
                description = random.choice(TRANSACTION_DESCRIPTIONS[category])
                amount = round(random.uniform(10, 5000), 2)

                if txn_type == 'credit':
                    balance += amount
                else:
                    balance = max(0, balance - amount)

                days_ago = random.randint(0, 180)
                txn = Transaction(
                    account=account,
                    transaction_type=txn_type,
                    amount=Decimal(str(amount)),
                    balance_after=Decimal(str(round(balance, 2))),
                    description=description,
                    status=random.choices(
                        ['completed', 'pending', 'failed', 'reversed'],
                        weights=[80, 10, 7, 3]
                    )[0],
                    category=category,
                    recipient_account=f"10{random.randint(10000000, 99999999)}" if txn_type == 'transfer' else '',
                )
                txn.save()
                Transaction.objects.filter(pk=txn.pk).update(
                    created_at=now - timedelta(days=days_ago, hours=random.randint(0, 23))
                )
                txn_count += 1

        self.stdout.write(self.style.SUCCESS(f'   {txn_count} transactions created'))

        # Create loans (0-2 per customer)
        loan_types = ['personal', 'home', 'auto', 'business', 'education']
        loan_count = 0
        for customer in customers[:35]:  # ~70% of customers have loans
            num_loans = random.randint(1, 2)
            for _ in range(num_loans):
                ltype = random.choice(loan_types)
                amount_ranges = {
                    'personal': (5000, 50000),
                    'home': (100000, 500000),
                    'auto': (15000, 80000),
                    'business': (50000, 300000),
                    'education': (10000, 100000),
                }
                min_amt, max_amt = amount_ranges[ltype]
                amount = Decimal(str(round(random.uniform(min_amt, max_amt), 2)))
                interest = Decimal(str(round(random.uniform(4.5, 15.0), 2)))
                tenure = random.choice([12, 24, 36, 48, 60, 120, 180, 240])

                status = random.choices(
                    ['applied', 'under_review', 'approved', 'disbursed', 'closed', 'rejected'],
                    weights=[10, 10, 10, 40, 20, 10]
                )[0]

                total_paid = Decimal('0.00')
                outstanding = amount
                if status in ['disbursed', 'closed']:
                    paid_pct = random.uniform(0.1, 0.9) if status == 'disbursed' else 1.0
                    total_paid = Decimal(str(round(float(amount) * paid_pct, 2)))
                    outstanding = amount - total_paid

                collateral = random.choice(['property', 'vehicle', 'gold', 'fixed_deposit', 'none'])
                collateral_val = Decimal(str(round(float(amount) * random.uniform(1.0, 1.5), 2))) if collateral != 'none' else Decimal('0.00')

                days_ago = random.randint(30, 400)
                loan = Loan(
                    customer=customer,
                    loan_type=ltype,
                    amount=amount,
                    interest_rate=interest,
                    tenure_months=tenure,
                    total_paid=total_paid,
                    outstanding_amount=outstanding,
                    status=status,
                    collateral_type=collateral,
                    collateral_value=collateral_val,
                    next_payment_date=date.today() + timedelta(days=random.randint(1, 30)) if status == 'disbursed' else None,
                )
                loan.save()
                Loan.objects.filter(pk=loan.pk).update(
                    applied_at=now - timedelta(days=days_ago)
                )
                loan_count += 1

        self.stdout.write(self.style.SUCCESS(f'   {loan_count} loans created'))

        # Create cards (0-2 per customer)
        card_networks = ['visa', 'mastercard', 'amex', 'rupay']
        card_count = 0
        for customer in customers[:40]:  # ~80% have cards
            customer_accounts = [a for a in accounts if a.customer_id == customer.id and a.status == 'active']
            if not customer_accounts:
                continue
            num_cards = random.randint(1, 2)
            for _ in range(num_cards):
                card_type = random.choice(['credit', 'debit', 'prepaid'])
                credit_limit = Decimal(str(round(random.uniform(1000, 50000), 2))) if card_type == 'credit' else Decimal('0.00')
                current_bal = Decimal(str(round(float(credit_limit) * random.uniform(0, 0.8), 2))) if card_type == 'credit' else Decimal('0.00')

                card = Card(
                    customer=customer,
                    account=random.choice(customer_accounts),
                    card_number=f"{random.randint(4000, 5999)}{random.randint(1000000000000, 9999999999999)}",
                    card_type=card_type,
                    network=random.choice(card_networks),
                    credit_limit=credit_limit,
                    current_balance=current_bal,
                    daily_limit=Decimal(str(random.choice([2000, 5000, 10000, 25000]))),
                    status=random.choices(['active', 'blocked', 'expired'], weights=[80, 10, 10])[0],
                    expiry_date=date.today() + timedelta(days=random.randint(30, 1095)),
                )
                card.save()
                card_count += 1

        self.stdout.write(self.style.SUCCESS(f'   {card_count} cards created'))

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write(self.style.SUCCESS(' Database seeded successfully!'))
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write('')
        self.stdout.write(f'   Customers:    {num_customers}')
        self.stdout.write(f'   Accounts:     {len(accounts)}')
        self.stdout.write(f'   Transactions: {txn_count}')
        self.stdout.write(f'    Loans:        {loan_count}')
        self.stdout.write(f'   Cards:        {card_count}')
        self.stdout.write('')
        self.stdout.write(self.style.WARNING('  Login credentials:'))
        self.stdout.write(f'   admin/admin123 (Administrator)')
        self.stdout.write(f'   manager/manager123 (Branch Manager)')
        self.stdout.write(f'   teller/teller123 (Bank Teller)')
        self.stdout.write(f'   viewer/viewer123 (Viewer)')

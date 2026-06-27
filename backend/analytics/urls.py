from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.DashboardView.as_view(), name='analytics-dashboard'),
    path('revenue/', views.RevenueAnalyticsView.as_view(), name='analytics-revenue'),
    path('customer-growth/', views.CustomerGrowthView.as_view(), name='analytics-customer-growth'),
]

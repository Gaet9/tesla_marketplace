import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricsCard from './components/MetricsCard';
import UserManagementTable from './components/UserManagementTable';
import OfferModerationPanel from './components/OfferModerationPanel';
import AnalyticsCharts from './components/AnalyticsCharts';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeOffers: 0,
    totalMessages: 0,
    monthlyRevenue: 0
  });

  // Mock admin user - replace with actual auth check
  const adminUser = {
    id: "admin-1",
    name: "Admin User",
    email: "admin@teslamarketplace.com",
    role: "admin",
    avatar: null
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'users', label: 'User Management', icon: 'Users' },
    { id: 'offers', label: 'Offer Moderation', icon: 'Car' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' }
  ];

  // Mock data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData({
        totalUsers: 1247,
        activeOffers: 156,
        totalMessages: 3892,
        monthlyRevenue: 48200
      });
      
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  // Check admin access
  useEffect(() => {
    if (!adminUser || adminUser?.role !== 'admin') {
      navigate('/tesla-marketplace-home');
    }
  }, [adminUser, navigate]);

  const handleQuickAction = (action) => {
    console.log(`Executing quick action: ${action}`);
    
    switch (action) {
      case 'announcement': console.log('Opening announcement creator...');
        break;
      case 'export-users':
        console.log('Exporting user data...');
        break;
      case 'maintenance': console.log('Opening maintenance panel...');
        break;
      case 'backup': console.log('Starting database backup...');
        break;
      case 'reports': setActiveTab('offers');
        break;
      case 'featured': console.log('Opening featured listings manager...');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="Total Users"
                value={isLoading ? "..." : dashboardData?.totalUsers?.toLocaleString()}
                change="+12.5%"
                changeType="positive"
                icon="Users"
                iconColor="text-accent"
              />
              <MetricsCard
                title="Active Offers"
                value={isLoading ? "..." : dashboardData?.activeOffers?.toLocaleString()}
                change="+8.3%"
                changeType="positive"
                icon="Car"
                iconColor="text-success"
              />
              <MetricsCard
                title="Total Messages"
                value={isLoading ? "..." : dashboardData?.totalMessages?.toLocaleString()}
                change="+15.7%"
                changeType="positive"
                icon="MessageSquare"
                iconColor="text-blue-500"
              />
              <MetricsCard
                title="Monthly Revenue"
                value={isLoading ? "..." : `$${dashboardData?.monthlyRevenue?.toLocaleString()}`}
                change="+22.1%"
                changeType="positive"
                icon="DollarSign"
                iconColor="text-warning"
              />
            </div>
            {/* Quick Actions and Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <QuickActions onActionClick={handleQuickAction} />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
            {/* Overview Analytics */}
            <div>
              <AnalyticsCharts />
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">User Management</h2>
                <p className="text-muted-foreground">Manage user accounts, permissions, and activity</p>
              </div>
              <Button
                variant="default"
                onClick={() => console.log('Export user data')}
                iconName="Download"
                iconPosition="left"
              >
                Export Data
              </Button>
            </div>
            <UserManagementTable />
          </div>
        );

      case 'offers':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Offer Moderation</h2>
                <p className="text-muted-foreground">Review, approve, and manage vehicle listings</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => console.log('Bulk approve')}
                  iconName="CheckCircle"
                  iconPosition="left"
                >
                  Bulk Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => console.log('Bulk reject')}
                  iconName="XCircle"
                  iconPosition="left"
                >
                  Bulk Reject
                </Button>
              </div>
            </div>
            <OfferModerationPanel />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
                <p className="text-muted-foreground">Detailed insights and performance metrics</p>
              </div>
              <Button
                variant="outline"
                onClick={() => console.log('Generate report')}
                iconName="FileText"
                iconPosition="left"
              >
                Generate Report
              </Button>
            </div>
            <AnalyticsCharts />
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading && activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/tesla-marketplace-home')}
                className="flex items-center space-x-2 tesla-transition hover:opacity-80"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-accent">
                  <Icon name="Zap" size={20} color="white" />
                </div>
                <span className="text-xl font-bold text-card-foreground">Tesla Marketplace</span>
              </button>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <div className="hidden sm:flex items-center space-x-2">
                <Icon name="Shield" size={20} className="text-accent" />
                <span className="text-lg font-semibold text-card-foreground">Admin Dashboard</span>
              </div>
            </div>

            {/* Admin User Info */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-card-foreground">{adminUser?.name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                <Icon name="Shield" size={16} color="white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => handleTabChange(tab?.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap tesla-transition ${
                  activeTab === tab?.id
                    ? 'border-accent text-accent' :'border-transparent text-muted-foreground hover:text-card-foreground hover:border-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Shield" size={16} />
              <span>Tesla Marketplace Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <span className="text-sm text-muted-foreground">
                © {new Date()?.getFullYear()} Tesla Marketplace. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
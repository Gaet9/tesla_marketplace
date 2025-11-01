import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const AdminNotificationBadge = ({ 
  user = null, 
  className = "",
  showDetails = false,
  onNotificationClick = () => {}
}) => {
  const [notifications, setNotifications] = useState({
    pendingListings: 0,
    reportedUsers: 0,
    systemAlerts: 0,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock notification data - replace with actual API calls
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminNotifications();
      
      // Set up real-time updates (mock interval)
      const interval = setInterval(fetchAdminNotifications, 30000); // 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [user, fetchAdminNotifications]);

  const fetchAdminNotifications = async () => {
    try {
      setIsLoading(true);
      
      // Mock API call - replace with actual service
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockData = {
        pendingListings: Math.floor(Math.random() * 5) + 1,
        reportedUsers: Math.floor(Math.random() * 3),
        systemAlerts: Math.floor(Math.random() * 2),
      };
      
      mockData.total = mockData?.pendingListings + mockData?.reportedUsers + mockData?.systemAlerts;
      
      setNotifications(mockData);
    } catch (error) {
      console.error('Failed to fetch admin notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = (type) => {
    onNotificationClick(type, notifications?.[type]);
  };

  // Don't render if user is not admin
  if (!user || user?.role !== 'admin') {
    return null;
  }

  const notificationItems = [
    {
      key: 'pendingListings',
      label: 'Pending Listings',
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      count: notifications?.pendingListings
    },
    {
      key: 'reportedUsers',
      label: 'Reported Users',
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      count: notifications?.reportedUsers
    },
    {
      key: 'systemAlerts',
      label: 'System Alerts',
      icon: 'Bell',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      count: notifications?.systemAlerts
    }
  ];

  if (showDetails) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Shield" size={16} className="text-accent" />
          <span className="text-sm font-semibold text-foreground">Admin Notifications</span>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
          )}
        </div>
        {notificationItems?.map((item) => (
          <button
            key={item?.key}
            onClick={() => handleNotificationClick(item?.key)}
            className={`flex items-center justify-between w-full p-3 rounded-lg tesla-transition hover:bg-muted/50 ${
              item?.count > 0 ? item?.bgColor : 'bg-muted/20'
            }`}
            disabled={item?.count === 0}
          >
            <div className="flex items-center space-x-3">
              <Icon 
                name={item?.icon} 
                size={16} 
                className={item?.count > 0 ? item?.color : 'text-muted-foreground'} 
              />
              <span className={`text-sm ${
                item?.count > 0 ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {item?.label}
              </span>
            </div>
            
            {item?.count > 0 && (
              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                item?.key === 'pendingListings' ? 'bg-warning text-warning-foreground' :
                item?.key === 'reportedUsers' ? 'bg-error text-error-foreground' :
                'bg-accent text-accent-foreground'
              }`}>
                {item?.count > 99 ? '99+' : item?.count}
              </div>
            )}
          </button>
        ))}
        {notifications?.total === 0 && !isLoading && (
          <div className="text-center py-4">
            <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">All caught up!</p>
          </div>
        )}
      </div>
    );
  }

  // Compact badge version
  return (
    <div className={`relative inline-flex ${className}`}>
      {notifications?.total > 0 && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="flex items-center justify-center h-5 w-5 bg-error rounded-full">
            <span className="text-xs font-bold text-white">
              {notifications?.total > 9 ? '9+' : notifications?.total}
            </span>
          </div>
          
          {/* Priority indicator for critical notifications */}
          {notifications?.reportedUsers > 0 && (
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-warning rounded-full animate-pulse"></div>
          )}
        </div>
      )}
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute -top-1 -right-1 h-3 w-3">
          <div className="animate-spin rounded-full h-full w-full border-b border-accent"></div>
        </div>
      )}
    </div>
  );
};

// Notification summary component for dashboard
export const AdminNotificationSummary = ({ user, onViewAll = () => {} }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Admin Notifications</h3>
        <button
          onClick={onViewAll}
          className="text-sm text-accent hover:text-accent/80 tesla-transition"
        >
          View All
        </button>
      </div>
      
      <AdminNotificationBadge 
        user={user} 
        showDetails={true}
        onNotificationClick={(type, count) => {
          console.log(`Clicked ${type} with ${count} notifications`);
          onViewAll(type);
        }}
      />
    </div>
  );
};

// Hook for admin notifications
export const useAdminNotifications = (user) => {
  const [notifications, setNotifications] = useState({
    pendingListings: 0,
    reportedUsers: 0,
    systemAlerts: 0,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      // Implementation would go here
      setIsLoading(false);
    }
  }, [user]);

  return { notifications, isLoading };
};

export default AdminNotificationBadge;
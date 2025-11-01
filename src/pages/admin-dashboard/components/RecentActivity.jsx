import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecentActivity = () => {
  const activities = [
  {
    id: "1",
    type: "user_registration",
    user: {
      name: "Alex Thompson",
      email: "alex.thompson@email.com",
      avatar: "https://images.unsplash.com/photo-1663720527180-4c60a78fe3b7",
      avatarAlt: "Professional headshot of young man with dark hair in casual shirt"
    },
    action: "registered",
    target: "new account",
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    icon: "UserPlus",
    iconColor: "text-success"
  },
  {
    id: "2",
    type: "listing_created",
    user: {
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      avatar: "https://images.unsplash.com/photo-1717329817976-2762c73d38ff",
      avatarAlt: "Professional headshot of woman with blonde hair in business attire"
    },
    action: "created listing",
    target: "2023 Tesla Model Y Performance",
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    icon: "Plus",
    iconColor: "text-accent"
  },
  {
    id: "3",
    type: "listing_approved",
    user: {
      name: "Admin System",
      email: "system@teslamarketplace.com",
      avatar: null,
      avatarAlt: "System administrator avatar"
    },
    action: "approved listing",
    target: "2022 Tesla Model S Plaid",
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    icon: "CheckCircle",
    iconColor: "text-success"
  },
  {
    id: "4",
    type: "user_reported",
    user: {
      name: "John Smith",
      email: "john.smith@email.com",
      avatar: "https://images.unsplash.com/photo-1538155421123-6a79813f5deb",
      avatarAlt: "Professional headshot of middle-aged man with brown hair in dark suit"
    },
    action: "reported user",
    target: "suspicious activity",
    timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
    icon: "AlertTriangle",
    iconColor: "text-error"
  },
  {
    id: "5",
    type: "message_sent",
    user: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      avatar: "https://images.unsplash.com/photo-1734456611474-13245d164868",
      avatarAlt: "Professional headshot of Hispanic woman with dark hair in blue blouse"
    },
    action: "sent message",
    target: "regarding Tesla Model 3",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    icon: "MessageSquare",
    iconColor: "text-blue-500"
  },
  {
    id: "6",
    type: "listing_updated",
    user: {
      name: "Michael Chen",
      email: "michael.chen@email.com",
      avatar: "https://images.unsplash.com/photo-1503087065990-e2ef69dc88b4",
      avatarAlt: "Professional headshot of Asian man with black hair in gray sweater"
    },
    action: "updated listing",
    target: "2021 Tesla Model X",
    timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
    icon: "Edit",
    iconColor: "text-warning"
  }];


  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getActivityTypeLabel = (type) => {
    const labels = {
      user_registration: 'User Registration',
      listing_created: 'New Listing',
      listing_approved: 'Listing Approved',
      user_reported: 'User Report',
      message_sent: 'Message',
      listing_updated: 'Listing Update'
    };
    return labels?.[type] || 'Activity';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log('View all activities')}
          iconName="ExternalLink"
          iconPosition="right">

          View All
        </Button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity) =>
        <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 tesla-transition">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              {activity?.user?.avatar ?
            <Image
              src={activity?.user?.avatar}
              alt={activity?.user?.avatarAlt}
              className="h-10 w-10 rounded-full object-cover" /> :


            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <Icon name="User" size={16} className="text-muted-foreground" />
                </div>
            }
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-card-foreground">
                    <span className="font-medium">{activity?.user?.name}</span>
                    <span className="text-muted-foreground"> {activity?.action} </span>
                    <span className="font-medium">{activity?.target}</span>
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {getActivityTypeLabel(activity?.type)}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {getTimeAgo(activity?.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Activity Icon */}
                <div className={`p-1.5 rounded-full bg-muted/50`}>
                  <Icon name={activity?.icon} size={14} className={activity?.iconColor} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Activity Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-card-foreground">24</div>
            <div className="text-xs text-muted-foreground">Today</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-card-foreground">156</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-card-foreground">1,247</div>
            <div className="text-xs text-muted-foreground">This Month</div>
          </div>
        </div>
      </div>
    </div>);

};

export default RecentActivity;
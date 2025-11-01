import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActions = ({ onActionClick = () => {} }) => {
  const quickActions = [
    {
      id: 'create-announcement',
      title: 'Create Announcement',
      description: 'Send platform-wide notifications to users',
      icon: 'Megaphone',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      action: 'announcement'
    },
    {
      id: 'export-users',
      title: 'Export User Data',
      description: 'Download user analytics and reports',
      icon: 'Download',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      action: 'export-users'
    },
    {
      id: 'system-maintenance',
      title: 'System Maintenance',
      description: 'Schedule or perform system updates',
      icon: 'Settings',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      action: 'maintenance'
    },
    {
      id: 'backup-data',
      title: 'Backup Database',
      description: 'Create system backup and restore points',
      icon: 'Database',
      color: 'text-success',
      bgColor: 'bg-success/10',
      action: 'backup'
    },
    {
      id: 'review-reports',
      title: 'Review Reports',
      description: 'Check user reports and flagged content',
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      action: 'reports'
    },
    {
      id: 'manage-featured',
      title: 'Featured Listings',
      description: 'Promote and manage featured vehicle listings',
      icon: 'Star',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      action: 'featured'
    }
  ];

  const handleActionClick = (action) => {
    onActionClick(action);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Quick Actions</h3>
        <Icon name="Zap" size={20} className="text-accent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => handleActionClick(action?.action)}
            className={`p-4 rounded-lg border border-border tesla-transition hover:border-accent/50 hover:tesla-shadow-md text-left group ${action?.bgColor}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${action?.bgColor} group-hover:scale-110 tesla-transition`}>
                <Icon name={action?.icon} size={20} className={action?.color} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-card-foreground mb-1 group-hover:text-accent tesla-transition">
                  {action?.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {action?.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {/* Additional Quick Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">24</div>
            <div className="text-xs text-muted-foreground">Pending Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">98.5%</div>
            <div className="text-xs text-muted-foreground">System Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning mb-1">3</div>
            <div className="text-xs text-muted-foreground">Active Reports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground mb-1">156</div>
            <div className="text-xs text-muted-foreground">Online Users</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
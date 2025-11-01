import React from 'react';
import Icon from '../../../components/AppIcon';

const AnalyticsWidget = ({ analytics }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000)?.toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000)?.toFixed(1) + 'K';
    }
    return num?.toString();
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return 'TrendingUp';
    if (change < 0) return 'TrendingDown';
    return 'Minus';
  };

  const metrics = [
    {
      title: 'Total Views',
      value: analytics?.totalViews,
      change: analytics?.viewsChange,
      icon: 'Eye',
      color: 'text-blue-500'
    },
    {
      title: 'Inquiries',
      value: analytics?.totalInquiries,
      change: analytics?.inquiriesChange,
      icon: 'MessageCircle',
      color: 'text-green-500'
    },
    {
      title: 'Profile Visits',
      value: analytics?.profileVisits,
      change: analytics?.profileVisitsChange,
      icon: 'User',
      color: 'text-purple-500'
    },
    {
      title: 'Response Rate',
      value: `${analytics?.responseRate}%`,
      change: analytics?.responseRateChange,
      icon: 'Clock',
      color: 'text-orange-500',
      isPercentage: true
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Performance Analytics
        </h3>
        <div className="text-xs text-muted-foreground">
          Last 30 days
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics?.map((metric, index) => (
          <div key={index} className="bg-muted/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`h-8 w-8 rounded-lg bg-muted/30 flex items-center justify-center ${metric?.color}`}>
                <Icon name={metric?.icon} size={16} />
              </div>
              
              {metric?.change !== 0 && (
                <div className={`flex items-center space-x-1 ${getChangeColor(metric?.change)}`}>
                  <Icon name={getChangeIcon(metric?.change)} size={12} />
                  <span className="text-xs font-medium">
                    {Math.abs(metric?.change)}{metric?.isPercentage ? 'pp' : '%'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-2xl font-bold text-card-foreground mb-1">
              {metric?.isPercentage ? metric?.value : formatNumber(metric?.value)}
            </div>
            
            <div className="text-xs text-muted-foreground">
              {metric?.title}
            </div>
          </div>
        ))}
      </div>
      {/* Quick Insights */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-card-foreground mb-3">
          Quick Insights
        </h4>
        
        <div className="space-y-2">
          {analytics?.insights?.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm">
              <Icon 
                name={insight?.type === 'positive' ? 'TrendingUp' : insight?.type === 'negative' ? 'TrendingDown' : 'Info'} 
                size={14} 
                className={
                  insight?.type === 'positive' ? 'text-success' : 
                  insight?.type === 'negative'? 'text-error' : 'text-accent'
                } 
              />
              <span className="text-muted-foreground">{insight?.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWidget;
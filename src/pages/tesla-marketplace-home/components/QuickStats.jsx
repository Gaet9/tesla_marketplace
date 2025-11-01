import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ 
  totalVehicles = 0,
  averagePrice = 0,
  newestYear = 0,
  featuredCount = 0,
  className = "" 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  const stats = [
    {
      label: 'Total Vehicles',
      value: totalVehicles?.toLocaleString(),
      icon: 'Car',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Average Price',
      value: formatPrice(averagePrice),
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Newest Model',
      value: newestYear?.toString(),
      icon: 'Calendar',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Featured Listings',
      value: featuredCount?.toString(),
      icon: 'Star',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats?.map((stat, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-4 tesla-shadow-sm tesla-transition hover:tesla-shadow-md"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">{stat?.label}</p>
              <p className="text-lg font-semibold text-card-foreground truncate">
                {stat?.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
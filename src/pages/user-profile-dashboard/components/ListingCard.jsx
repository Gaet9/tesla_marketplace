import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ListingCard = ({ listing, onEdit = () => {}, onDelete = () => {}, onPromote = () => {} }) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'sold':
        return 'text-muted-foreground bg-muted/20';
      case 'expired':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted/20';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US')?.format(num);
  };

  const getDaysActive = (createdAt) => {
    const days = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleViewDetails = () => {
    navigate(`/tesla-offer-details?id=${listing?.id}`);
  };

  const handleEdit = () => {
    navigate(`/create-tesla-listing?edit=${listing?.id}`);
    onEdit(listing?.id);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      onDelete(listing?.id);
    }
  };

  const handlePromote = () => {
    onPromote(listing?.id);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden tesla-shadow-sm tesla-transition hover:tesla-shadow-md">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={listing?.images?.[0]}
          alt={`${listing?.year} ${listing?.model} ${listing?.variant} in ${listing?.color} - front exterior view in parking lot`}
          className="w-full h-full object-cover tesla-transition hover:scale-105"
        />
        
        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(listing?.status)}`}>
          {listing?.status?.charAt(0)?.toUpperCase() + listing?.status?.slice(1)}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setShowActions(!showActions)}
            className="h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center tesla-transition hover:bg-background"
          >
            <Icon name="MoreVertical" size={16} />
          </button>
          
          {showActions && (
            <div className="absolute top-10 right-0 bg-popover border border-border rounded-lg tesla-shadow-lg z-10 min-w-32">
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted/50 tesla-transition"
              >
                <Icon name="Edit" size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={handlePromote}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted/50 tesla-transition"
                disabled={listing?.status !== 'active'}
              >
                <Icon name="TrendingUp" size={14} />
                <span>Promote</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 tesla-transition"
              >
                <Icon name="Trash2" size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Content Section */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-card-foreground truncate">
              {listing?.year} {listing?.model} {listing?.variant}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatNumber(listing?.mileage)} miles • {listing?.location}
            </p>
          </div>
          <div className="text-right ml-3">
            <div className="text-xl font-bold text-accent">
              {formatPrice(listing?.price)}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-muted-foreground mb-1">
              <Icon name="Eye" size={14} />
              <span className="text-xs">Views</span>
            </div>
            <div className="text-sm font-semibold text-card-foreground">
              {formatNumber(listing?.metrics?.views)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-muted-foreground mb-1">
              <Icon name="MessageCircle" size={14} />
              <span className="text-xs">Inquiries</span>
            </div>
            <div className="text-sm font-semibold text-card-foreground">
              {listing?.metrics?.inquiries}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-muted-foreground mb-1">
              <Icon name="Calendar" size={14} />
              <span className="text-xs">Days Active</span>
            </div>
            <div className="text-sm font-semibold text-card-foreground">
              {getDaysActive(listing?.createdAt)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleViewDetails}
            iconName="Eye"
            iconPosition="left"
            className="flex-1"
          >
            View Details
          </Button>
          
          {listing?.status === 'active' && (
            <Button
              variant="default"
              onClick={handleEdit}
              iconName="Edit"
              iconPosition="left"
              className="flex-1"
            >
              Edit Listing
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
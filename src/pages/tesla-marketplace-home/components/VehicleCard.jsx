import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VehicleCard = ({ 
  vehicle, 
  onViewDetails = () => {}, 
  onContactSeller = () => {},
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

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-US')?.format(mileage);
  };

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden tesla-shadow-md tesla-transition group hover:tesla-shadow-lg hover:scale-[1.02] ${className}`}>
      {/* Vehicle Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={vehicle?.image}
          alt={vehicle?.imageAlt}
          className="w-full h-full object-cover tesla-transition group-hover:scale-105"
        />
        
        {/* Badge for featured/new listings */}
        {vehicle?.isFeatured && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-semibold">
            Featured
          </div>
        )}
        
        {/* Price overlay */}
        <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-md font-bold">
          {formatPrice(vehicle?.price)}
        </div>
      </div>
      {/* Vehicle Details */}
      <div className="p-4">
        {/* Model and Year */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-card-foreground truncate">
            {vehicle?.model} {vehicle?.year}
          </h3>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="Calendar" size={14} />
            <span className="text-sm">{vehicle?.year}</span>
          </div>
        </div>

        {/* Mileage and Battery */}
        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="Gauge" size={14} />
            <span className="text-sm">{formatMileage(vehicle?.mileage)} mi</span>
          </div>
          {vehicle?.batteryHealth && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Battery" size={14} />
              <span className="text-sm">{vehicle?.batteryHealth}%</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {vehicle?.description}
        </p>

        {/* Seller Info */}
        <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-border">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
            <Icon name="User" size={16} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-foreground truncate">
              {vehicle?.sellerName}
            </p>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="MapPin" size={12} />
              <span className="text-xs truncate">{vehicle?.location}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 })?.map((_, i) => (
              <Icon
                key={i}
                name="Star"
                size={12}
                className={i < Math.floor(vehicle?.sellerRating) ? 'text-warning fill-current' : 'text-muted'}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => onViewDetails(vehicle)}
            iconName="Eye"
            iconPosition="left"
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="default"
            onClick={() => onContactSeller(vehicle)}
            iconName="MessageCircle"
            iconPosition="left"
            className="flex-1"
          >
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
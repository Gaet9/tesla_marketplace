import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SavedOfferCard = ({ offer, onRemove = () => {}, onContact = () => {} }) => {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

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

  const formatSavedDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewDetails = () => {
    router?.push(`/tesla-offer-details?id=${offer?.id}`);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(offer?.id);
    } catch (error) {
      console.error('Failed to remove saved offer:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleContact = () => {
    onContact(offer?.id, offer?.seller);
  };

  const getAvailabilityStatus = (status) => {
    switch (status) {
      case 'available':
        return { text: 'Available', color: 'text-success' };
      case 'pending':
        return { text: 'Pending Sale', color: 'text-warning' };
      case 'sold':
        return { text: 'Sold', color: 'text-error' };
      default:
        return { text: 'Unknown', color: 'text-muted-foreground' };
    }
  };

  const availability = getAvailabilityStatus(offer?.status);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden tesla-shadow-sm tesla-transition hover:tesla-shadow-md">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={offer?.images?.[0]}
          alt={`${offer?.year} ${offer?.model} ${offer?.variant} in ${offer?.color} - exterior view showcasing sleek design`}
          className="w-full h-full object-cover tesla-transition hover:scale-105"
        />
        
        {/* Saved Badge */}
        <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold">
          <Icon name="Heart" size={12} className="inline mr-1" />
          Saved
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="absolute top-3 right-3 h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center tesla-transition hover:bg-background disabled:opacity-50"
          aria-label="Remove from saved offers"
        >
          {isRemoving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
          ) : (
            <Icon name="X" size={16} />
          )}
        </button>
      </div>
      {/* Content Section */}
      <div className="p-4">
        {/* Title and Status */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-card-foreground truncate">
              {offer?.year} {offer?.model} {offer?.variant}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatNumber(offer?.mileage)} miles • {offer?.location}
            </p>
          </div>
          <div className="text-right ml-3">
            <div className="text-xl font-bold text-accent mb-1">
              {formatPrice(offer?.price)}
            </div>
            <div className={`text-xs font-medium ${availability?.color}`}>
              {availability?.text}
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center space-x-2 mb-3 p-2 bg-muted/20 rounded-md">
          {offer?.seller?.avatar ? (
            <Image
              src={offer?.seller?.avatar}
              alt={`Profile photo of ${offer?.seller?.name} - professional headshot with confident smile`}
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
              <Icon name="User" size={12} />
            </div>
          )}
          <span className="text-sm text-muted-foreground">
            Sold by {offer?.seller?.name}
          </span>
          {offer?.seller?.verified && (
            <Icon name="CheckCircle" size={14} className="text-success" />
          )}
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="Battery" size={12} />
            <span>{offer?.batteryHealth}% Battery</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="Zap" size={12} />
            <span>{offer?.range} mi Range</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="Calendar" size={12} />
            <span>Saved {formatSavedDate(offer?.savedAt)}</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="MapPin" size={12} />
            <span>{offer?.distance} miles away</span>
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
          
          {offer?.status === 'available' && (
            <Button
              variant="default"
              onClick={handleContact}
              iconName="MessageCircle"
              iconPosition="left"
              className="flex-1"
            >
              Contact Seller
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedOfferCard;
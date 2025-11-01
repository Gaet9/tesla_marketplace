import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SellerInformation = ({ seller = {}, onContactSeller = () => {} }) => {
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={`full-${i}`} name="Star" size={16} className="text-warning fill-current" />
      );
    }
    
    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={16} className="text-warning fill-current" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
      );
    }
    
    return stars;
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-bold text-card-foreground flex items-center space-x-2">
        <Icon name="User" size={20} className="text-accent" />
        <span>Seller Information</span>
      </h3>
      {/* Seller Profile */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {seller?.avatar ? (
            <Image
              src={seller?.avatar}
              alt={seller?.avatarAlt || `${seller?.name || 'Seller'} profile photo`}
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <Icon name="User" size={24} color="white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-card-foreground truncate">
            {seller?.name || "Tesla Owner"}
          </h4>
          
          {/* Verification Badge */}
          {seller?.isVerified && (
            <div className="flex items-center space-x-1 mt-1">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-success font-medium">Verified Seller</span>
            </div>
          )}
          
          {/* Rating */}
          {seller?.rating && (
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center space-x-1">
                {renderRating(seller?.rating)}
              </div>
              <span className="text-sm text-muted-foreground">
                {seller?.rating?.toFixed(1)} ({seller?.reviewCount || 0} reviews)
              </span>
            </div>
          )}
          
          {/* Location */}
          {seller?.location && (
            <div className="flex items-center space-x-2 mt-2">
              <Icon name="MapPin" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{seller?.location}</span>
            </div>
          )}
        </div>
      </div>
      {/* Seller Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-card-foreground">
            {seller?.totalListings || 0}
          </div>
          <div className="text-sm text-muted-foreground">Active Listings</div>
        </div>
        
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-card-foreground">
            {seller?.soldVehicles || 0}
          </div>
          <div className="text-sm text-muted-foreground">Vehicles Sold</div>
        </div>
      </div>
      {/* Additional Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Member since:</span>
          <span className="text-card-foreground font-medium">
            {formatJoinDate(seller?.joinDate)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Response time:</span>
          <span className="text-card-foreground font-medium">
            {seller?.responseTime || "Within 24 hours"}
          </span>
        </div>
        
        {seller?.languages && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Languages:</span>
            <span className="text-card-foreground font-medium">
              {seller?.languages}
            </span>
          </div>
        )}
      </div>
      {/* Bio */}
      {seller?.bio && (
        <div className="pt-4 border-t border-border">
          <h5 className="text-sm font-semibold text-card-foreground mb-2">About the Seller</h5>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {seller?.bio}
          </p>
        </div>
      )}
      {/* Contact Button */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="default"
          fullWidth
          iconName="MessageCircle"
          iconPosition="left"
          onClick={onContactSeller}
          className="mb-3"
        >
          Contact Seller
        </Button>
        
        {/* Additional Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            iconName="Phone"
            iconPosition="left"
            disabled={!seller?.phone}
          >
            Call
          </Button>
          
          <Button
            variant="outline"
            iconName="Share"
            iconPosition="left"
          >
            Share
          </Button>
        </div>
      </div>
      {/* Safety Notice */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h6 className="text-sm font-semibold text-warning mb-1">Safety Tips</h6>
            <p className="text-xs text-muted-foreground">
              Always meet in a public place, inspect the vehicle thoroughly, and verify all documentation before making any payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInformation;
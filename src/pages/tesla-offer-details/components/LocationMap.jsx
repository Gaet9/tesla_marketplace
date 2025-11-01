import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationMap = ({ location = {}, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { 
    address = "Location not specified",
    city = "",
    state = "",
    zipCode = "",
    coordinates = { lat: 37.7749, lng: -122.4194 } // Default to San Francisco
  } = location;

  const fullAddress = [address, city, state, zipCode]?.filter(Boolean)?.join(", ");
  const mapSrc = `https://www.google.com/maps?q=${coordinates?.lat},${coordinates?.lng}&z=14&output=embed`;

  const handleDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates?.lat},${coordinates?.lng}`;
    window.open(directionsUrl, '_blank');
  };

  const handleViewLarger = () => {
    const mapsUrl = `https://www.google.com/maps?q=${coordinates?.lat},${coordinates?.lng}&z=15`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
          <Icon name="MapPin" size={20} className="text-accent" />
          <span>Vehicle Location</span>
        </h3>
        
        {/* Address */}
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">{fullAddress}</p>
          {coordinates && (
            <p className="text-xs text-muted-foreground mt-1">
              Coordinates: {coordinates?.lat?.toFixed(6)}, {coordinates?.lng?.toFixed(6)}
            </p>
          )}
        </div>
      </div>
      {/* Map Container */}
      <div className={`relative bg-muted ${isExpanded ? 'h-96' : 'h-48'} tesla-transition-slow`}>
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title={`Vehicle location at ${fullAddress}`}
          referrerPolicy="no-referrer-when-downgrade"
          src={mapSrc}
          className="border-0"
        />
        
        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-10 h-10 bg-background/90 hover:bg-background rounded-lg flex items-center justify-center tesla-shadow-md tesla-transition"
            aria-label={isExpanded ? "Collapse map" : "Expand map"}
          >
            <Icon name={isExpanded ? "Minimize2" : "Maximize2"} size={16} />
          </button>
          
          <button
            onClick={handleViewLarger}
            className="w-10 h-10 bg-background/90 hover:bg-background rounded-lg flex items-center justify-center tesla-shadow-md tesla-transition"
            aria-label="View in Google Maps"
          >
            <Icon name="ExternalLink" size={16} />
          </button>
        </div>
        
        {/* Loading State Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-muted pointer-events-none">
          <div className="text-center">
            <Icon name="MapPin" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <Button
          variant="default"
          fullWidth
          iconName="Navigation"
          iconPosition="left"
          onClick={handleDirections}
        >
          Get Directions
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            iconName="MapPin"
            iconPosition="left"
            onClick={handleViewLarger}
          >
            View Map
          </Button>
          
          <Button
            variant="outline"
            iconName="Share"
            iconPosition="left"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Vehicle Location',
                  text: `Check out this Tesla at ${fullAddress}`,
                  url: window.location?.href
                });
              } else {
                navigator.clipboard?.writeText(window.location?.href);
              }
            }}
          >
            Share
          </Button>
        </div>
        
        {/* Distance Info */}
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground pt-2 border-t border-border">
          <Icon name="Clock" size={14} />
          <span>Estimated viewing time: 30-45 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
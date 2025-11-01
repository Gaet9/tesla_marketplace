import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LocationSelector = ({ 
  location = {}, 
  onLocationChange, 
  errors = {},
  currentStep 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Mock location suggestions - in real app, use Google Places API or similar
  const mockSuggestions = [
    {
      id: 1,
      address: "123 Main Street, San Francisco, CA 94102",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    {
      id: 2,
      address: "456 Oak Avenue, Los Angeles, CA 90210",
      city: "Los Angeles", 
      state: "CA",
      zipCode: "90210",
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    {
      id: 3,
      address: "789 Pine Road, Austin, TX 73301",
      city: "Austin",
      state: "TX", 
      zipCode: "73301",
      coordinates: { lat: 30.2672, lng: -97.7431 }
    },
    {
      id: 4,
      address: "321 Elm Street, Seattle, WA 98101",
      city: "Seattle",
      state: "WA",
      zipCode: "98101", 
      coordinates: { lat: 47.6062, lng: -122.3321 }
    },
    {
      id: 5,
      address: "654 Maple Drive, Miami, FL 33101",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      coordinates: { lat: 25.7617, lng: -80.1918 }
    }
  ];

  useEffect(() => {
    if (searchQuery?.length > 2) {
      setIsSearching(true);
      // Simulate API delay
      const timer = setTimeout(() => {
        const filtered = mockSuggestions?.filter(suggestion =>
          suggestion?.address?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          suggestion?.city?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          suggestion?.state?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          suggestion?.zipCode?.includes(searchQuery)
        );
        setSuggestions(filtered);
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleLocationSelect = (selectedLocation) => {
    onLocationChange({
      address: selectedLocation?.address,
      city: selectedLocation?.city,
      state: selectedLocation?.state,
      zipCode: selectedLocation?.zipCode,
      coordinates: selectedLocation?.coordinates
    });
    setSearchQuery(selectedLocation?.address);
    setSuggestions([]);
    setShowMap(true);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          
          // Mock reverse geocoding - in real app, use Google Geocoding API
          const mockAddress = {
            address: "Current Location, San Francisco, CA 94102",
            city: "San Francisco",
            state: "CA", 
            zipCode: "94102",
            coordinates: { lat: latitude, lng: longitude }
          };
          
          handleLocationSelect(mockAddress);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enter your address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const clearLocation = () => {
    onLocationChange({});
    setSearchQuery('');
    setShowMap(false);
  };

  if (currentStep !== 3) return null;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Vehicle Location</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Enter the location where the vehicle can be viewed and picked up by potential buyers.
        </p>

        <div className="space-y-4">
          {/* Address Search */}
          <div className="relative">
            <Input
              label="Address"
              type="text"
              placeholder="Enter street address, city, or ZIP code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              error={errors?.address}
              required
            />
            
            {/* Search Suggestions */}
            {suggestions?.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md tesla-shadow-md z-10 max-h-60 overflow-y-auto">
                {suggestions?.map((suggestion) => (
                  <button
                    key={suggestion?.id}
                    onClick={() => handleLocationSelect(suggestion)}
                    className="flex items-start space-x-3 w-full p-3 text-left hover:bg-muted/50 tesla-transition border-b border-border last:border-b-0"
                  >
                    <Icon name="MapPin" size={16} className="text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-popover-foreground">{suggestion?.address}</p>
                      <p className="text-xs text-muted-foreground">
                        {suggestion?.city}, {suggestion?.state} {suggestion?.zipCode}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Loading Indicator */}
            {isSearching && (
              <div className="absolute right-3 top-9 mt-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
              </div>
            )}
          </div>

          {/* Current Location Button */}
          <Button
            variant="outline"
            onClick={getCurrentLocation}
            iconName="Navigation"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Use Current Location
          </Button>

          {/* Manual Entry Fields */}
          {location?.address && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
              <Input
                label="City"
                type="text"
                value={location?.city || ''}
                onChange={(e) => onLocationChange({ ...location, city: e?.target?.value })}
                error={errors?.city}
                required
              />
              
              <Input
                label="State"
                type="text"
                value={location?.state || ''}
                onChange={(e) => onLocationChange({ ...location, state: e?.target?.value })}
                error={errors?.state}
                required
                maxLength="2"
              />
              
              <Input
                label="ZIP Code"
                type="text"
                value={location?.zipCode || ''}
                onChange={(e) => onLocationChange({ ...location, zipCode: e?.target?.value })}
                error={errors?.zipCode}
                required
                maxLength="10"
              />
            </div>
          )}

          {/* Clear Location */}
          {location?.address && (
            <Button
              variant="ghost"
              onClick={clearLocation}
              iconName="X"
              iconPosition="left"
              className="text-destructive hover:text-destructive"
            >
              Clear Location
            </Button>
          )}
        </div>
      </div>
      {/* Map Preview */}
      {showMap && location?.coordinates && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-card-foreground">Location Preview</h4>
            <Button
              variant="ghost"
              onClick={() => setShowMap(false)}
              iconName="X"
              size="sm"
            />
          </div>
          
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="Vehicle Location"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${location?.coordinates?.lat},${location?.coordinates?.lng}&z=14&output=embed`}
              className="border-0"
            />
          </div>
          
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="MapPin" size={16} className="text-accent mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">{location?.address}</p>
                <p className="text-xs text-muted-foreground">
                  {location?.city}, {location?.state} {location?.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Location Tips */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-card-foreground mb-3">Location Tips</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
            <p>Choose a safe, public location for vehicle viewings</p>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
            <p>Consider Tesla Service Centers or Supercharger locations</p>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
            <p>Ensure the location is easily accessible for test drives</p>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <p>Your exact address will only be shared with serious buyers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
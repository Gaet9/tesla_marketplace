import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveMap = ({
  vehicles = [],
  selectedVehicle = null,
  onVehicleSelect = () => {},
  onMapToggle = () => {},
  isVisible = true,
  className = ""
}) => {
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // San Francisco default
  const [zoomLevel, setZoomLevel] = useState(10);
  const [hoveredPin, setHoveredPin] = useState(null);

  // Mock map implementation using Google Maps iframe
  const generateMapUrl = () => {
    const markers = vehicles?.slice(0, 10)?.map(vehicle => 
      `${vehicle?.coordinates?.lat},${vehicle?.coordinates?.lng}`
    )?.join('|');
    
    return `https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${zoomLevel}&output=embed`;
  };

  const handlePinClick = (vehicle) => {
    onVehicleSelect(vehicle);
    setMapCenter(vehicle?.coordinates);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  const resetView = () => {
    setMapCenter({ lat: 37.7749, lng: -122.4194 });
    setZoomLevel(10);
  };

  if (!isVisible) {
    return (
      <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Map View</h3>
          <Button
            variant="outline"
            onClick={onMapToggle}
            iconName="Map"
            iconPosition="left"
          >
            Show Map
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="Map" size={48} className="mx-auto mb-2 opacity-50" />
          <p>Click "Show Map" to view vehicle locations</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden tesla-shadow-md ${className}`}>
      {/* Map Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Map" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-card-foreground">Vehicle Locations</h3>
          <span className="text-sm text-muted-foreground">
            ({vehicles?.length} vehicles)
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={handleZoomOut}
            iconName="Minus"
            className="h-8 w-8 p-0"
          />
          <Button
            variant="ghost"
            onClick={handleZoomIn}
            iconName="Plus"
            className="h-8 w-8 p-0"
          />
          <Button
            variant="ghost"
            onClick={resetView}
            iconName="RotateCcw"
            className="h-8 w-8 p-0"
          />
          <Button
            variant="ghost"
            onClick={onMapToggle}
            iconName="X"
            className="h-8 w-8 p-0 md:hidden"
          />
        </div>
      </div>
      {/* Map Container */}
      <div className="relative h-96 lg:h-[500px]">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Tesla Vehicle Locations Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={generateMapUrl()}
          className="border-0"
        />

        {/* Map Overlay with Vehicle Pins */}
        <div className="absolute inset-0 pointer-events-none">
          {vehicles?.map((vehicle, index) => {
            // Calculate pin position (mock positioning)
            const pinStyle = {
              position: 'absolute',
              left: `${20 + (index % 5) * 15}%`,
              top: `${20 + Math.floor(index / 5) * 15}%`,
              pointerEvents: 'auto'
            };

            return (
              <div
                key={vehicle?.id}
                style={pinStyle}
                className="relative"
                onMouseEnter={() => setHoveredPin(vehicle?.id)}
                onMouseLeave={() => setHoveredPin(null)}
              >
                <button
                  onClick={() => handlePinClick(vehicle)}
                  className={`relative z-10 p-2 rounded-full tesla-transition transform hover:scale-110 ${
                    selectedVehicle?.id === vehicle?.id
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-background border border-border text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon name="Car" size={16} />
                </button>
                {/* Pin Tooltip */}
                {hoveredPin === vehicle?.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-popover border border-border rounded-lg p-3 tesla-shadow-lg z-20">
                    <div className="text-sm">
                      <p className="font-semibold text-popover-foreground truncate">
                        {vehicle?.model} {vehicle?.year}
                      </p>
                      <p className="text-accent font-bold">
                        ${vehicle?.price?.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {vehicle?.mileage?.toLocaleString()} mi • {vehicle?.location}
                      </p>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Selected Vehicle Info */}
      {selectedVehicle && (
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-lg overflow-hidden">
              <img
                src={selectedVehicle?.image}
                alt={selectedVehicle?.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-card-foreground truncate">
                {selectedVehicle?.model} {selectedVehicle?.year}
              </p>
              <p className="text-accent font-bold">
                ${selectedVehicle?.price?.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedVehicle?.mileage?.toLocaleString()} mi • {selectedVehicle?.location}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => onVehicleSelect(selectedVehicle)}
              iconName="Eye"
              iconPosition="left"
            >
              View Details
            </Button>
          </div>
        </div>
      )}
      {/* Map Legend */}
      <div className="p-4 border-t border-border bg-muted/10">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span>Selected Vehicle</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-background border border-border rounded-full"></div>
              <span>Available Vehicle</span>
            </div>
          </div>
          <span>Click pins to view details</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
import React, { useState } from 'react';
import VehicleCard from './VehicleCard';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VehicleGrid = ({
  vehicles = [],
  loading = false,
  onVehicleSelect = () => {},
  onContactSeller = () => {},
  onLoadMore = () => {},
  hasMore = false,
  className = ""
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const handleViewDetails = (vehicle) => {
    onVehicleSelect(vehicle);
  };

  const handleContactSeller = (vehicle) => {
    onContactSeller(vehicle);
  };

  if (loading && vehicles?.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Loading Skeleton */}
        {Array.from({ length: 6 })?.map((_, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg overflow-hidden tesla-shadow-sm animate-pulse"
          >
            <div className="h-48 bg-muted"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-muted rounded flex-1"></div>
                <div className="h-8 bg-muted rounded flex-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (vehicles?.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Icon name="Car" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No vehicles found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your filters or search criteria to find more vehicles.
        </p>
        <Button
          variant="outline"
          onClick={() => window.location?.reload()}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Available Vehicles ({vehicles?.length})
        </h2>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">View:</span>
          <div className="flex border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 tesla-transition ${
                viewMode === 'grid' ?'bg-accent text-accent-foreground' :'bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Grid3X3" size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 tesla-transition ${
                viewMode === 'list' ?'bg-accent text-accent-foreground' :'bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="List" size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Vehicle Grid/List */}
      <div className={`${
        viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :'space-y-4'
      }`}>
        {vehicles?.map((vehicle) => (
          <VehicleCard
            key={vehicle?.id}
            vehicle={vehicle}
            onViewDetails={handleViewDetails}
            onContactSeller={handleContactSeller}
            className={viewMode === 'list' ? 'flex-row' : ''}
          />
        ))}
      </div>
      {/* Loading More Indicator */}
      {loading && vehicles?.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent"></div>
            <span>Loading more vehicles...</span>
          </div>
        </div>
      )}
      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={onLoadMore}
            iconName="ChevronDown"
            iconPosition="right"
            className="px-8"
          >
            Load More Vehicles
          </Button>
        </div>
      )}
      {/* End of Results */}
      {!hasMore && vehicles?.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <Icon name="CheckCircle" size={20} />
            <span>You've seen all available vehicles</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleGrid;
import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterToolbar = ({
  filters = {},
  onFiltersChange = () => {},
  onClearFilters = () => {},
  resultCount = 0,
  className = ""
}) => {
  const teslaModels = [
    { value: 'all', label: 'All Models' },
    { value: 'model-s', label: 'Model S' },
    { value: 'model-3', label: 'Model 3' },
    { value: 'model-x', label: 'Model X' },
    { value: 'model-y', label: 'Model Y' },
    { value: 'cybertruck', label: 'Cybertruck' },
    { value: 'roadster', label: 'Roadster' }
  ];

  const yearOptions = [
    { value: 'all', label: 'Any Year' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
    { value: '2017', label: '2017' },
    { value: '2016', label: '2016' },
    { value: 'older', label: '2015 & Older' }
  ];

  const priceRanges = [
    { value: 'all', label: 'Any Price' },
    { value: '0-30000', label: 'Under $30,000' },
    { value: '30000-50000', label: '$30,000 - $50,000' },
    { value: '50000-70000', label: '$50,000 - $70,000' },
    { value: '70000-100000', label: '$70,000 - $100,000' },
    { value: '100000-150000', label: '$100,000 - $150,000' },
    { value: '150000+', label: '$150,000+' }
  ];

  const mileageRanges = [
    { value: 'all', label: 'Any Mileage' },
    { value: '0-10000', label: 'Under 10,000 mi' },
    { value: '10000-25000', label: '10,000 - 25,000 mi' },
    { value: '25000-50000', label: '25,000 - 50,000 mi' },
    { value: '50000-75000', label: '50,000 - 75,000 mi' },
    { value: '75000-100000', label: '75,000 - 100,000 mi' },
    { value: '100000+', label: '100,000+ mi' }
  ];

  const locationRadiusOptions = [
    { value: '25', label: 'Within 25 miles' },
    { value: '50', label: 'Within 50 miles' },
    { value: '100', label: 'Within 100 miles' },
    { value: '250', label: 'Within 250 miles' },
    { value: 'nationwide', label: 'Nationwide' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value && value !== 'all' && value !== ''
  );

  return (
    <div className={`bg-card border border-border rounded-lg p-4 tesla-shadow-sm ${className}`}>
      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search by model, location, or seller..."
          value={filters?.search || ''}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
        {/* Tesla Model */}
        <Select
          label="Model"
          options={teslaModels}
          value={filters?.model || 'all'}
          onChange={(value) => handleFilterChange('model', value)}
        />

        {/* Year */}
        <Select
          label="Year"
          options={yearOptions}
          value={filters?.year || 'all'}
          onChange={(value) => handleFilterChange('year', value)}
        />

        {/* Price Range */}
        <Select
          label="Price Range"
          options={priceRanges}
          value={filters?.priceRange || 'all'}
          onChange={(value) => handleFilterChange('priceRange', value)}
        />

        {/* Mileage */}
        <Select
          label="Mileage"
          options={mileageRanges}
          value={filters?.mileage || 'all'}
          onChange={(value) => handleFilterChange('mileage', value)}
        />

        {/* Location */}
        <Input
          label="Location"
          type="text"
          placeholder="City, State or ZIP"
          value={filters?.location || ''}
          onChange={(e) => handleFilterChange('location', e?.target?.value)}
        />

        {/* Radius */}
        <Select
          label="Radius"
          options={locationRadiusOptions}
          value={filters?.radius || '50'}
          onChange={(value) => handleFilterChange('radius', value)}
          disabled={!filters?.location}
        />
      </div>
      {/* Results Summary and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {resultCount?.toLocaleString()} vehicles found
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              className="text-sm"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'mileage-low', label: 'Mileage: Low to High' },
              { value: 'year-new', label: 'Year: Newest First' },
              { value: 'distance', label: 'Distance' }
            ]}
            value={filters?.sortBy || 'newest'}
            onChange={(value) => handleFilterChange('sortBy', value)}
            className="min-w-[150px]"
          />
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {Object.entries(filters)?.map(([key, value]) => {
              if (!value || value === 'all' || value === '' || key === 'search' || key === 'sortBy') return null;
              
              let displayValue = value;
              if (key === 'model') {
                displayValue = teslaModels?.find(m => m?.value === value)?.label || value;
              } else if (key === 'year') {
                displayValue = yearOptions?.find(y => y?.value === value)?.label || value;
              } else if (key === 'priceRange') {
                displayValue = priceRanges?.find(p => p?.value === value)?.label || value;
              } else if (key === 'mileage') {
                displayValue = mileageRanges?.find(m => m?.value === value)?.label || value;
              } else if (key === 'radius') {
                displayValue = locationRadiusOptions?.find(r => r?.value === value)?.label || value;
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded-md text-xs"
                >
                  <span>{displayValue}</span>
                  <button
                    onClick={() => handleFilterChange(key, key === 'radius' ? '50' : 'all')}
                    className="hover:text-accent/80"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;
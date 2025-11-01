import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ListingPreview = ({ 
  formData = {}, 
  images = [], 
  location = {},
  currentStep,
  onPublish,
  onSaveDraft 
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (currentStep !== 4) return null;

  const primaryImage = images?.find(img => img?.isPrimary) || images?.[0];
  const additionalImages = images?.filter(img => !img?.isPrimary);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-US')?.format(mileage);
  };

  const getModelDisplayName = (model) => {
    const modelMap = {
      'model-s': 'Model S',
      'model-3': 'Model 3',
      'model-x': 'Model X',
      'model-y': 'Model Y',
      'cybertruck': 'Cybertruck',
      'roadster': 'Roadster'
    };
    return modelMap?.[model] || model;
  };

  const getConditionDisplayName = (condition) => {
    const conditionMap = {
      'excellent': 'Excellent',
      'very-good': 'Very Good',
      'good': 'Good',
      'fair': 'Fair',
      'poor': 'Poor'
    };
    return conditionMap?.[condition] || condition;
  };

  const getColorDisplayName = (color) => {
    const colorMap = {
      'pearl-white': 'Pearl White Multi-Coat',
      'solid-black': 'Solid Black',
      'midnight-silver': 'Midnight Silver Metallic',
      'deep-blue': 'Deep Blue Metallic',
      'red-multi-coat': 'Red Multi-Coat',
      'other': 'Other'
    };
    return colorMap?.[color] || color;
  };

  const featureLabels = {
    'autopilot': 'Autopilot',
    'fsd': 'Full Self-Driving Capability',
    'premium-connectivity': 'Premium Connectivity',
    'supercharging': 'Free Supercharging',
    'ludicrous-mode': 'Ludicrous Mode',
    'air-suspension': 'Air Suspension',
    'premium-audio': 'Premium Audio Package',
    'glass-roof': 'Glass Roof',
    'tow-hitch': 'Tow Hitch',
    'cold-weather': 'Cold Weather Package'
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Listing Preview</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Review your listing before publishing. This is how it will appear to potential buyers.
        </p>

        {/* Main Listing Card */}
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          {/* Image Section */}
          <div className="relative">
            {primaryImage ? (
              <div className="aspect-video">
                <Image
                  src={primaryImage?.url || primaryImage?.preview}
                  alt={primaryImage?.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center">
                  <Icon name="Camera" size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No images uploaded</p>
                </div>
              </div>
            )}
            
            {/* Image Count Badge */}
            {images?.length > 1 && (
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded text-sm font-medium">
                <Icon name="Camera" size={14} className="inline mr-1" />
                {images?.length}
              </div>
            )}
            
            {/* Price Badge */}
            {formData?.price && (
              <div className="absolute bottom-4 left-4 bg-accent text-accent-foreground px-3 py-2 rounded-lg font-bold text-lg">
                {formatPrice(formData?.price)}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Title and Basic Info */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-foreground mb-2">
                {formData?.year} Tesla {getModelDisplayName(formData?.model)}
                {formData?.battery && ` ${formData?.battery}`}
              </h2>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {formData?.mileage && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Gauge" size={16} />
                    <span>{formatMileage(formData?.mileage)} miles</span>
                  </div>
                )}
                
                {formData?.condition && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={16} />
                    <span>{getConditionDisplayName(formData?.condition)}</span>
                  </div>
                )}
                
                {location?.city && location?.state && (
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={16} />
                    <span>{location?.city}, {location?.state}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {formData?.exteriorColor && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Exterior</p>
                  <p className="text-sm font-medium text-foreground">
                    {getColorDisplayName(formData?.exteriorColor)}
                  </p>
                </div>
              )}
              
              {formData?.interiorColor && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Interior</p>
                  <p className="text-sm font-medium text-foreground">
                    {getColorDisplayName(formData?.interiorColor)}
                  </p>
                </div>
              )}
              
              {formData?.year && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Year</p>
                  <p className="text-sm font-medium text-foreground">{formData?.year}</p>
                </div>
              )}
              
              {formData?.vin && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">VIN</p>
                  <p className="text-sm font-medium text-foreground font-mono">
                    {formData?.vin?.slice(-6)}
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            {formData?.features && formData?.features?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">Features & Options</h4>
                <div className="flex flex-wrap gap-2">
                  {formData?.features?.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                    >
                      {featureLabels?.[feature] || feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {formData?.description && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">Description</h4>
                <div className="text-sm text-muted-foreground">
                  {showFullDescription || formData?.description?.length <= 200 ? (
                    <p className="whitespace-pre-wrap">{formData?.description}</p>
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap">
                        {formData?.description?.slice(0, 200)}...
                      </p>
                      <button
                        onClick={() => setShowFullDescription(true)}
                        className="text-accent hover:text-accent/80 tesla-transition mt-2"
                      >
                        Read more
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Additional Images */}
            {additionalImages?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">Additional Photos</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {additionalImages?.slice(0, 5)?.map((image) => (
                    <div key={image?.id} className="aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={image?.url || image?.preview}
                        alt={image?.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {additionalImages?.length > 5 && (
                    <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        +{additionalImages?.length - 5} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Section */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} color="white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Private Seller</p>
                    <p className="text-xs text-muted-foreground">
                      Member since {new Date()?.getFullYear()}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  iconName="MessageCircle"
                  iconPosition="left"
                  disabled
                >
                  Contact Seller
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Validation Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-card-foreground mb-4">Listing Checklist</h4>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Icon 
              name={formData?.model && formData?.year && formData?.mileage && formData?.price ? "CheckCircle" : "Circle"} 
              size={16} 
              className={formData?.model && formData?.year && formData?.mileage && formData?.price ? "text-success" : "text-muted-foreground"} 
            />
            <span className="text-sm text-foreground">Basic vehicle information completed</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon 
              name={images?.length > 0 ? "CheckCircle" : "Circle"} 
              size={16} 
              className={images?.length > 0 ? "text-success" : "text-muted-foreground"} 
            />
            <span className="text-sm text-foreground">
              Vehicle photos uploaded ({images?.length} photos)
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon 
              name={location?.address ? "CheckCircle" : "Circle"} 
              size={16} 
              className={location?.address ? "text-success" : "text-muted-foreground"} 
            />
            <span className="text-sm text-foreground">Location information provided</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon 
              name={formData?.description && formData?.description?.length > 50 ? "CheckCircle" : "Circle"} 
              size={16} 
              className={formData?.description && formData?.description?.length > 50 ? "text-success" : "text-muted-foreground"} 
            />
            <span className="text-sm text-foreground">Detailed description provided</span>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={onSaveDraft}
          iconName="Save"
          iconPosition="left"
          className="flex-1"
        >
          Save as Draft
        </Button>
        
        <Button
          variant="default"
          onClick={onPublish}
          iconName="Send"
          iconPosition="left"
          className="flex-1"
          disabled={!formData?.model || !formData?.year || !formData?.price || images?.length === 0 || !location?.address}
        >
          Publish Listing
        </Button>
      </div>
    </div>
  );
};

export default ListingPreview;
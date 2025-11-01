import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const VehicleInfoForm = ({ 
  formData, 
  onFormChange, 
  errors = {},
  currentStep,
  onStepChange 
}) => {
  const teslaModels = [
    { value: 'model-s', label: 'Model S' },
    { value: 'model-3', label: 'Model 3' },
    { value: 'model-x', label: 'Model X' },
    { value: 'model-y', label: 'Model Y' },
    { value: 'cybertruck', label: 'Cybertruck' },
    { value: 'roadster', label: 'Roadster' }
  ];

  const yearOptions = Array.from({ length: 15 }, (_, i) => {
    const year = new Date()?.getFullYear() - i;
    return { value: year?.toString(), label: year?.toString() };
  });

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new, minimal wear' },
    { value: 'very-good', label: 'Very Good', description: 'Minor cosmetic imperfections' },
    { value: 'good', label: 'Good', description: 'Normal wear, well maintained' },
    { value: 'fair', label: 'Fair', description: 'Some wear, needs minor repairs' },
    { value: 'poor', label: 'Poor', description: 'Significant wear, needs major repairs' }
  ];

  const batteryOptions = [
    { value: '75', label: '75 kWh' },
    { value: '85', label: '85 kWh' },
    { value: '90', label: '90 kWh' },
    { value: '100', label: '100 kWh' },
    { value: '75d', label: '75D' },
    { value: '85d', label: '85D' },
    { value: '90d', label: '90D' },
    { value: '100d', label: '100D' },
    { value: 'p85', label: 'P85' },
    { value: 'p90', label: 'P90' },
    { value: 'p100d', label: 'P100D' }
  ];

  const colorOptions = [
    { value: 'pearl-white', label: 'Pearl White Multi-Coat' },
    { value: 'solid-black', label: 'Solid Black' },
    { value: 'midnight-silver', label: 'Midnight Silver Metallic' },
    { value: 'deep-blue', label: 'Deep Blue Metallic' },
    { value: 'red-multi-coat', label: 'Red Multi-Coat' },
    { value: 'other', label: 'Other' }
  ];

  const interiorOptions = [
    { value: 'black', label: 'All Black' },
    { value: 'black-white', label: 'Black and White' },
    { value: 'cream', label: 'Cream' },
    { value: 'tan', label: 'Tan' },
    { value: 'other', label: 'Other' }
  ];

  const features = [
    { id: 'autopilot', label: 'Autopilot' },
    { id: 'fsd', label: 'Full Self-Driving Capability' },
    { id: 'premium-connectivity', label: 'Premium Connectivity' },
    { id: 'supercharging', label: 'Free Supercharging' },
    { id: 'ludicrous-mode', label: 'Ludicrous Mode' },
    { id: 'air-suspension', label: 'Air Suspension' },
    { id: 'premium-audio', label: 'Premium Audio Package' },
    { id: 'glass-roof', label: 'Glass Roof' },
    { id: 'tow-hitch', label: 'Tow Hitch' },
    { id: 'cold-weather', label: 'Cold Weather Package' }
  ];

  const handleInputChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
  };

  const handleFeatureChange = (featureId, checked) => {
    const currentFeatures = formData?.features || [];
    const updatedFeatures = checked
      ? [...currentFeatures, featureId]
      : currentFeatures?.filter(f => f !== featureId);
    
    onFormChange({ ...formData, features: updatedFeatures });
  };

  if (currentStep !== 1) return null;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Vehicle Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Tesla Model"
            placeholder="Select your Tesla model"
            options={teslaModels}
            value={formData?.model}
            onChange={(value) => handleInputChange('model', value)}
            error={errors?.model}
            required
          />

          <Select
            label="Year"
            placeholder="Select year"
            options={yearOptions}
            value={formData?.year}
            onChange={(value) => handleInputChange('year', value)}
            error={errors?.year}
            required
          />

          <Input
            label="Mileage"
            type="number"
            placeholder="Enter mileage"
            value={formData?.mileage}
            onChange={(e) => handleInputChange('mileage', e?.target?.value)}
            error={errors?.mileage}
            required
            min="0"
            className="md:col-span-1"
          />

          <Input
            label="Price (USD)"
            type="number"
            placeholder="Enter asking price"
            value={formData?.price}
            onChange={(e) => handleInputChange('price', e?.target?.value)}
            error={errors?.price}
            required
            min="0"
            className="md:col-span-1"
          />

          <Input
            label="VIN (Vehicle Identification Number)"
            type="text"
            placeholder="Enter 17-character VIN"
            value={formData?.vin}
            onChange={(e) => handleInputChange('vin', e?.target?.value)}
            error={errors?.vin}
            maxLength="17"
            className="md:col-span-2"
          />
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Vehicle Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Condition"
            placeholder="Select vehicle condition"
            options={conditionOptions}
            value={formData?.condition}
            onChange={(value) => handleInputChange('condition', value)}
            error={errors?.condition}
            required
          />

          <Select
            label="Battery Configuration"
            placeholder="Select battery type"
            options={batteryOptions}
            value={formData?.battery}
            onChange={(value) => handleInputChange('battery', value)}
            error={errors?.battery}
          />

          <Select
            label="Exterior Color"
            placeholder="Select exterior color"
            options={colorOptions}
            value={formData?.exteriorColor}
            onChange={(value) => handleInputChange('exteriorColor', value)}
            error={errors?.exteriorColor}
            required
          />

          <Select
            label="Interior Color"
            placeholder="Select interior color"
            options={interiorOptions}
            value={formData?.interiorColor}
            onChange={(value) => handleInputChange('interiorColor', value)}
            error={errors?.interiorColor}
            required
          />
        </div>

        <div className="mt-6">
          <Input
            label="Vehicle Description"
            type="textarea"
            placeholder="Describe your Tesla's condition, maintenance history, and any notable features..."
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            error={errors?.description}
            required
            rows={4}
          />
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Features & Options</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select all features and options included with your Tesla
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features?.map((feature) => (
            <Checkbox
              key={feature?.id}
              label={feature?.label}
              checked={(formData?.features || [])?.includes(feature?.id)}
              onChange={(e) => handleFeatureChange(feature?.id, e?.target?.checked)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleInfoForm;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const VehicleSpecifications = ({ vehicle = {} }) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    performance: false,
    features: false,
    maintenance: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const specifications = {
    basic: [
      { label: "Model", value: vehicle?.model || "N/A", icon: "Car" },
      { label: "Year", value: vehicle?.year || "N/A", icon: "Calendar" },
      { label: "Mileage", value: vehicle?.mileage ? `${vehicle?.mileage?.toLocaleString()} miles` : "N/A", icon: "Gauge" },
      { label: "Condition", value: vehicle?.condition || "N/A", icon: "CheckCircle" },
      { label: "Color", value: vehicle?.color || "N/A", icon: "Palette" },
      { label: "VIN", value: vehicle?.vin || "N/A", icon: "Hash" }
    ],
    performance: [
      { label: "Battery Range", value: vehicle?.batteryRange || "N/A", icon: "Battery" },
      { label: "Acceleration", value: vehicle?.acceleration || "N/A", icon: "Zap" },
      { label: "Top Speed", value: vehicle?.topSpeed || "N/A", icon: "Gauge" },
      { label: "Charging Speed", value: vehicle?.chargingSpeed || "N/A", icon: "Plug" },
      { label: "Drive Type", value: vehicle?.driveType || "N/A", icon: "Settings" },
      { label: "Autopilot", value: vehicle?.autopilot || "N/A", icon: "Navigation" }
    ],
    features: [
      { label: "Interior", value: vehicle?.interior || "N/A", icon: "Home" },
      { label: "Wheels", value: vehicle?.wheels || "N/A", icon: "Circle" },
      { label: "Sound System", value: vehicle?.soundSystem || "N/A", icon: "Volume2" },
      { label: "Connectivity", value: vehicle?.connectivity || "N/A", icon: "Wifi" },
      { label: "Safety Features", value: vehicle?.safetyFeatures || "N/A", icon: "Shield" },
      { label: "Additional Options", value: vehicle?.additionalOptions || "N/A", icon: "Plus" }
    ],
    maintenance: [
      { label: "Last Service", value: vehicle?.lastService || "N/A", icon: "Wrench" },
      { label: "Service History", value: vehicle?.serviceHistory || "N/A", icon: "FileText" },
      { label: "Warranty", value: vehicle?.warranty || "N/A", icon: "Award" },
      { label: "Accidents", value: vehicle?.accidents || "None reported", icon: "AlertTriangle" },
      { label: "Previous Owners", value: vehicle?.previousOwners || "N/A", icon: "Users" },
      { label: "Registration", value: vehicle?.registration || "N/A", icon: "FileCheck" }
    ]
  };

  const sectionTitles = {
    basic: "Basic Information",
    performance: "Performance & Technology",
    features: "Features & Options",
    maintenance: "Maintenance & History"
  };

  const sectionIcons = {
    basic: "Info",
    performance: "Zap",
    features: "Star",
    maintenance: "Tool"
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">Vehicle Specifications</h2>
      {Object.entries(specifications)?.map(([sectionKey, specs]) => (
        <div key={sectionKey} className="bg-card border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(sectionKey)}
            className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-muted/50 tesla-transition"
          >
            <div className="flex items-center space-x-3">
              <Icon name={sectionIcons?.[sectionKey]} size={20} className="text-accent" />
              <h3 className="text-lg font-semibold text-card-foreground">
                {sectionTitles?.[sectionKey]}
              </h3>
            </div>
            <Icon 
              name="ChevronDown" 
              size={20} 
              className={`tesla-transition ${expandedSections?.[sectionKey] ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSections?.[sectionKey] && (
            <div className="px-6 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specs?.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Icon name={spec?.icon} size={16} className="text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <dt className="text-sm font-medium text-muted-foreground">
                        {spec?.label}
                      </dt>
                      <dd className="text-sm text-card-foreground font-medium truncate">
                        {spec?.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Description Section */}
      {vehicle?.description && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
            <Icon name="FileText" size={20} className="text-accent" />
            <span>Description</span>
          </h3>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {vehicle?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default VehicleSpecifications;
import React from 'react';
import Icon from '../../../components/AppIcon';

const FormProgressIndicator = ({ 
  currentStep, 
  totalSteps = 4, 
  onStepClick,
  className = '' 
}) => {
  const steps = [
    {
      id: 1,
      title: 'Vehicle Info',
      description: 'Model, year, mileage',
      icon: 'Car'
    },
    {
      id: 2,
      title: 'Photos',
      description: 'Upload images',
      icon: 'Camera'
    },
    {
      id: 3,
      title: 'Location',
      description: 'Where to meet',
      icon: 'MapPin'
    },
    {
      id: 4,
      title: 'Review',
      description: 'Final details',
      icon: 'CheckCircle'
    }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-accent text-accent-foreground border-accent';
      case 'current':
        return 'bg-accent text-accent-foreground border-accent ring-2 ring-accent/20';
      case 'upcoming':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getConnectorClasses = (stepId) => {
    return stepId < currentStep ? 'bg-accent' : 'bg-border';
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Create Listing</h3>
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium text-foreground">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full tesla-transition"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      {/* Desktop Steps */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps?.map((step, index) => {
            const status = getStepStatus(step?.id);
            const isClickable = step?.id <= currentStep;
            
            return (
              <React.Fragment key={step?.id}>
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={() => isClickable && onStepClick && onStepClick(step?.id)}
                    disabled={!isClickable}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center tesla-transition ${
                      getStepClasses(status)
                    } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
                  >
                    {status === 'completed' ? (
                      <Icon name="Check" size={20} />
                    ) : (
                      <Icon name={step?.icon} size={20} />
                    )}
                  </button>
                  
                  <div className="text-center">
                    <p className={`text-sm font-medium ${
                      status === 'current' ? 'text-accent' : 
                      status === 'completed' ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step?.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step?.description}
                    </p>
                  </div>
                </div>
                {/* Connector Line */}
                {index < steps?.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className={`h-0.5 tesla-transition ${getConnectorClasses(step?.id)}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {/* Mobile Steps */}
      <div className="md:hidden space-y-3">
        {steps?.map((step) => {
          const status = getStepStatus(step?.id);
          const isClickable = step?.id <= currentStep;
          
          return (
            <button
              key={step?.id}
              onClick={() => isClickable && onStepClick && onStepClick(step?.id)}
              disabled={!isClickable}
              className={`w-full flex items-center space-x-4 p-3 rounded-lg border tesla-transition ${
                status === 'current' ? 'border-accent bg-accent/5' :
                status === 'completed'? 'border-accent/50 bg-accent/5' : 'border-border bg-muted/30'
              } ${isClickable ? 'hover:bg-muted/50' : 'cursor-not-allowed'}`}
            >
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                getStepClasses(status)
              }`}>
                {status === 'completed' ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <Icon name={step?.icon} size={16} />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-medium ${
                  status === 'current' ? 'text-accent' : 
                  status === 'completed' ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step?.description}
                </p>
              </div>
              {status === 'current' && (
                <Icon name="ChevronRight" size={16} className="text-accent" />
              )}
            </button>
          );
        })}
      </div>
      {/* Step Navigation Hints */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Tips:</p>
            <ul className="space-y-1">
              <li>• You can save your progress as a draft at any time</li>
              <li>• All fields marked with * are required</li>
              <li>• You can go back to previous steps to make changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProgressIndicator;
import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your data is protected with 256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Secure Authentication',
      description: 'Multi-factor authentication and secure token handling'
    },
    {
      icon: 'Eye',
      title: 'Privacy First',
      description: 'We never share your personal information with third parties'
    },
    {
      icon: 'CheckCircle',
      title: 'Verified Platform',
      description: 'Trusted by thousands of Tesla owners worldwide'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">Why Tesla Marketplace is Secure</h3>
        <p className="text-xs text-muted-foreground">
          Your security and privacy are our top priorities
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {trustFeatures?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20">
            <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
              <Icon name={feature?.icon} size={16} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-medium text-foreground">{feature?.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Protected by industry-standard security measures since {new Date()?.getFullYear() - 2}
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;
import React from 'react';

import Icon from '../../../components/AppIcon';

const SocialAuthButtons = ({ onSocialAuth, isLoading }) => {
  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: 'Github',
      color: 'bg-gray-900 text-white hover:bg-gray-800'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialProviders?.map((provider) => (
          <button
            key={provider?.id}
            onClick={() => onSocialAuth(provider?.id)}
            disabled={isLoading}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg tesla-transition ${provider?.color} disabled:opacity-50`}
          >
            <Icon name={provider?.icon} size={18} />
            <span className="font-medium">{provider?.name}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
        <Icon name="Shield" size={14} />
        <span>Secured with SSL encryption</span>
      </div>
    </div>
  );
};

export default SocialAuthButtons;
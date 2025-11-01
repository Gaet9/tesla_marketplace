import React from 'react';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ activeTab, onTabChange, tabs, className = "" }) => {
  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Desktop Tab Navigation */}
      <div className="hidden md:flex border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium tesla-transition border-b-2 ${
              activeTab === tab?.id
                ? 'border-accent text-accent bg-accent/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
            {tab?.count !== undefined && (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                activeTab === tab?.id
                  ? 'bg-accent text-white' :'bg-muted text-muted-foreground'
              }`}>
                {tab?.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Mobile Tab Navigation (Dropdown) */}
      <div className="md:hidden p-4 border-b border-border">
        <select
          value={activeTab}
          onChange={(e) => onTabChange(e?.target?.value)}
          className="w-full p-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        >
          {tabs?.map((tab) => (
            <option key={tab?.id} value={tab?.id}>
              {tab?.label} {tab?.count !== undefined ? `(${tab?.count})` : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TabNavigation;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBreadcrumbs = ({ customBreadcrumbs = null, className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Route mapping for breadcrumb generation
  const routeMap = {
    '/tesla-marketplace-home': { label: 'Marketplace', icon: 'Car' },
    '/tesla-offer-details': { label: 'Vehicle Details', icon: 'Eye', parent: '/tesla-marketplace-home' },
    '/user-profile-dashboard': { label: 'Dashboard', icon: 'User' },
    '/create-tesla-listing': { label: 'Create Listing', icon: 'Plus', parent: '/user-profile-dashboard' },
    '/admin-dashboard': { label: 'Admin Dashboard', icon: 'Shield' },
    '/authentication-portal': { label: 'Sign In', icon: 'LogIn' }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const currentPath = location?.pathname;
    const currentRoute = routeMap?.[currentPath];
    
    if (!currentRoute) {
      return [{ label: 'Home', path: '/tesla-marketplace-home', icon: 'Home' }];
    }

    const breadcrumbs = [];
    
    // Add parent breadcrumb if exists
    if (currentRoute?.parent) {
      const parentRoute = routeMap?.[currentRoute?.parent];
      if (parentRoute) {
        breadcrumbs?.push({
          label: parentRoute?.label,
          path: currentRoute?.parent,
          icon: parentRoute?.icon
        });
      }
    }
    
    // Add current page
    breadcrumbs?.push({
      label: currentRoute?.label,
      path: currentPath,
      icon: currentRoute?.icon,
      current: true
    });

    return breadcrumbs;
  };

  const handleNavigation = (path) => {
    if (path && path !== location?.pathname) {
      navigate(path);
    }
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render breadcrumbs on home page or if only one item
  if (breadcrumbs?.length <= 1 && location?.pathname === '/tesla-marketplace-home') {
    return null;
  }

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-muted-foreground mb-6 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {/* Home link */}
        <li>
          <button
            onClick={() => handleNavigation('/tesla-marketplace-home')}
            className="flex items-center space-x-1 tesla-transition hover:text-foreground focus:text-foreground focus:outline-none"
            aria-label="Go to marketplace home"
          >
            <Icon name="Home" size={16} />
            <span className="hidden sm:inline">Home</span>
          </button>
        </li>

        {/* Breadcrumb items */}
        {breadcrumbs?.map((crumb, index) => (
          <React.Fragment key={crumb?.path || index}>
            <li className="flex items-center">
              <Icon name="ChevronRight" size={16} className="mx-2" />
              {crumb?.current ? (
                <span 
                  className="flex items-center space-x-1 text-foreground font-medium"
                  aria-current="page"
                >
                  <Icon name={crumb?.icon} size={16} />
                  <span>{crumb?.label}</span>
                </span>
              ) : (
                <button
                  onClick={() => handleNavigation(crumb?.path)}
                  className="flex items-center space-x-1 tesla-transition hover:text-foreground focus:text-foreground focus:outline-none"
                  aria-label={`Go to ${crumb?.label}`}
                >
                  <Icon name={crumb?.icon} size={16} />
                  <span className="hidden sm:inline">{crumb?.label}</span>
                </button>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

// Enhanced breadcrumb component for specific use cases
export const TeslaBreadcrumbs = ({ 
  vehicleTitle = null, 
  listingId = null,
  className = "" 
}) => {
  const location = useLocation();
  
  // Generate custom breadcrumbs for Tesla-specific pages
  const generateTeslaBreadcrumbs = () => {
    const currentPath = location?.pathname;
    
    if (currentPath === '/tesla-offer-details' && vehicleTitle) {
      return [
        {
          label: 'Marketplace',
          path: '/tesla-marketplace-home',
          icon: 'Car'
        },
        {
          label: vehicleTitle?.length > 30 ? `${vehicleTitle?.substring(0, 30)}...` : vehicleTitle,
          path: currentPath,
          icon: 'Eye',
          current: true
        }
      ];
    }
    
    if (currentPath === '/create-tesla-listing' && listingId) {
      return [
        {
          label: 'Dashboard',
          path: '/user-profile-dashboard',
          icon: 'User'
        },
        {
          label: listingId ? 'Edit Listing' : 'Create Listing',
          path: currentPath,
          icon: 'Plus',
          current: true
        }
      ];
    }
    
    return null;
  };

  const customBreadcrumbs = generateTeslaBreadcrumbs();
  
  return (
    <NavigationBreadcrumbs 
      customBreadcrumbs={customBreadcrumbs}
      className={className}
    />
  );
};

// Breadcrumb item component for custom implementations
export const BreadcrumbItem = ({ 
  label, 
  icon, 
  onClick, 
  current = false, 
  className = "" 
}) => {
  return (
    <li className={`flex items-center ${className}`}>
      {current ? (
        <span 
          className="flex items-center space-x-1 text-foreground font-medium"
          aria-current="page"
        >
          {icon && <Icon name={icon} size={16} />}
          <span>{label}</span>
        </span>
      ) : (
        <button
          onClick={onClick}
          className="flex items-center space-x-1 text-muted-foreground tesla-transition hover:text-foreground focus:text-foreground focus:outline-none"
        >
          {icon && <Icon name={icon} size={16} />}
          <span>{label}</span>
        </button>
      )}
    </li>
  );
};

export default NavigationBreadcrumbs;
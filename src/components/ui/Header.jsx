import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user = null, onAuthRequired = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Marketplace',
      items: [
        { label: 'Browse Vehicles', path: '/tesla-marketplace-home', icon: 'Car' },
        { label: 'Vehicle Details', path: '/tesla-offer-details', icon: 'Eye' }
      ]
    },
    {
      label: 'My Tesla',
      items: [
        { label: 'Dashboard', path: '/user-profile-dashboard', icon: 'User' },
        { label: 'Create Listing', path: '/create-tesla-listing', icon: 'Plus' }
      ],
      authRequired: true
    }
  ];

  const adminItems = [
    { label: 'Admin', path: '/admin-dashboard', icon: 'Shield', roles: ['admin'] }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const isActiveSection = (items) => {
    return items?.some(item => isActivePath(item?.path));
  };

  const handleNavigation = (path, authRequired = false) => {
    if (authRequired && !user) {
      onAuthRequired();
      return;
    }
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleAuthAction = () => {
    if (user) {
      // Logout logic would go here
      navigate('/authentication-portal');
    } else {
      navigate('/authentication-portal');
    }
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event?.target?.closest('.user-menu') && !event?.target?.closest('.user-menu-button')) {
        setIsUserMenuOpen(false);
      }
      if (!event?.target?.closest('.mobile-menu') && !event?.target?.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleNavigation('/tesla-marketplace-home')}
            className="flex items-center space-x-2 tesla-transition hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-accent">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-xl font-bold text-foreground">Tesla Marketplace</span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-8 space-x-8">
          {navigationItems?.map((section) => {
            if (section?.authRequired && !user) return null;
            
            return (
              <div key={section?.label} className="relative group">
                <button
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium tesla-transition rounded-md ${
                    isActiveSection(section?.items)
                      ? 'text-accent bg-accent/10' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span>{section?.label}</span>
                  <Icon name="ChevronDown" size={16} />
                </button>
                {/* Dropdown Menu */}
                <div className="absolute left-0 top-full mt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible tesla-transition-slow bg-popover border border-border rounded-md tesla-shadow-md">
                  <div className="py-2">
                    {section?.items?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => handleNavigation(item?.path, section?.authRequired)}
                        className={`flex items-center space-x-2 w-full px-4 py-2 text-sm tesla-transition ${
                          isActivePath(item?.path)
                            ? 'text-accent bg-accent/10' :'text-popover-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Icon name={item?.icon} size={16} />
                        <span>{item?.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <div className="relative group">
              {adminItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium tesla-transition rounded-md ${
                    isActivePath(item?.path)
                      ? 'text-accent bg-accent/10' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center space-x-4">
          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="user-menu-button flex items-center space-x-2 p-2 rounded-full tesla-transition hover:bg-muted/50"
              >
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-foreground">
                  {user?.name || user?.email}
                </span>
                <Icon name="ChevronDown" size={16} className="hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="user-menu absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md tesla-shadow-md">
                  <div className="py-2">
                    <button
                      onClick={() => handleNavigation('/user-profile-dashboard')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted/50 tesla-transition"
                    >
                      <Icon name="User" size={16} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('/create-tesla-listing')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted/50 tesla-transition"
                    >
                      <Icon name="Plus" size={16} />
                      <span>Create Listing</span>
                    </button>
                    <div className="border-t border-border my-1"></div>
                    <button
                      onClick={handleAuthAction}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted/50 tesla-transition"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={handleAuthAction}
              iconName="LogIn"
              iconPosition="left"
              className="hidden sm:flex"
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="mobile-menu-button md:hidden p-2 rounded-md tesla-transition hover:bg-muted/50"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu md:hidden border-t border-border bg-background">
          <div className="px-6 py-4 space-y-4">
            {navigationItems?.map((section) => {
              if (section?.authRequired && !user) return null;
              
              return (
                <div key={section?.label} className="space-y-2">
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {section?.label}
                  </div>
                  {section?.items?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => handleNavigation(item?.path, section?.authRequired)}
                      className={`flex items-center space-x-3 w-full p-3 rounded-md tesla-transition ${
                        isActivePath(item?.path)
                          ? 'text-accent bg-accent/10' :'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon name={item?.icon} size={20} />
                      <span className="font-medium">{item?.label}</span>
                    </button>
                  ))}
                </div>
              );
            })}

            {/* Admin Section Mobile */}
            {user?.role === 'admin' && (
              <div className="space-y-2 border-t border-border pt-4">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Administration
                </div>
                {adminItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`flex items-center space-x-3 w-full p-3 rounded-md tesla-transition ${
                      isActivePath(item?.path)
                        ? 'text-accent bg-accent/10' :'text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon name={item?.icon} size={20} />
                    <span className="font-medium">{item?.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Auth Action Mobile */}
            <div className="border-t border-border pt-4">
              <Button
                variant={user ? "outline" : "default"}
                onClick={handleAuthAction}
                iconName={user ? "LogOut" : "LogIn"}
                iconPosition="left"
                fullWidth
              >
                {user ? 'Sign Out' : 'Sign In'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
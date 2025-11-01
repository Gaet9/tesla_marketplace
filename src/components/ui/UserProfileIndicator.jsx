import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from './Button';

const UserProfileIndicator = ({ 
  user = null, 
  onSignOut = () => {}, 
  onProfileClick = () => {},
  className = "" 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Mock notifications - replace with actual notification service
  useEffect(() => {
    if (user) {
      // Simulate fetching notifications
      setNotifications([
        { id: 1, type: 'message', title: 'New message from buyer', unread: true },
        { id: 2, type: 'listing', title: 'Your listing has been viewed 15 times', unread: true },
        { id: 3, type: 'system', title: 'Profile verification complete', unread: false }
      ]);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigation = (path) => {
    router?.push(path);
    setIsDropdownOpen(false);
  };

  const handleSignOut = () => {
    onSignOut();
    setIsDropdownOpen(false);
  };

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  if (!user) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          variant="outline"
          onClick={() => router?.push('/authentication-portal')}
          iconName="LogIn"
          iconPosition="left"
          className="hidden sm:flex"
        >
          Sign In
        </Button>
        <Button
          variant="ghost"
          onClick={() => router?.push('/authentication-portal')}
          iconName="LogIn"
          className="sm:hidden"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-2 rounded-lg tesla-transition hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
        aria-label="User menu"
        aria-expanded={isDropdownOpen}
      >
        {/* Avatar */}
        <div className="relative">
          {user?.avatar ? (
            <Image
              src={user?.avatar}
              alt={`${user?.name || user?.email} avatar`}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
          )}
          
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-error rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}
        </div>

        {/* User Info (Desktop) */}
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-medium text-foreground truncate max-w-32">
            {user?.name || user?.email?.split('@')?.[0]}
          </span>
          <span className="text-xs text-muted-foreground">
            {user?.role === 'admin' ? 'Administrator' : 'Member'}
          </span>
        </div>

        {/* Dropdown Arrow */}
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`hidden sm:block tesla-transition ${isDropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg tesla-shadow-lg z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              {user?.avatar ? (
                <Image
                  src={user?.avatar}
                  alt={`${user?.name || user?.email} avatar`}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                  <Icon name="User" size={20} color="white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-popover-foreground truncate">
                  {user?.name || user?.email?.split('@')?.[0]}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-accent">
                  {user?.role === 'admin' ? 'Administrator' : 'Member'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="py-2">
            <button
              onClick={() => handleNavigation('/user-profile-dashboard')}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted/50 tesla-transition"
            >
              <Icon name="User" size={16} />
              <span>Profile Dashboard</span>
            </button>
            
            <button
              onClick={() => handleNavigation('/create-tesla-listing')}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted/50 tesla-transition"
            >
              <Icon name="Plus" size={16} />
              <span>Create Listing</span>
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavigation('/admin-dashboard')}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted/50 tesla-transition"
              >
                <Icon name="Shield" size={16} />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>

          {/* Notifications Section */}
          {notifications?.length > 0 && (
            <>
              <div className="border-t border-border">
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-xs text-accent font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                
                <div className="max-h-32 overflow-y-auto">
                  {notifications?.slice(0, 3)?.map((notification) => (
                    <button
                      key={notification?.id}
                      className="flex items-start space-x-3 w-full px-4 py-2 text-left hover:bg-muted/50 tesla-transition"
                    >
                      <div className={`mt-1 h-2 w-2 rounded-full ${
                        notification?.unread ? 'bg-accent' : 'bg-muted'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-popover-foreground truncate">
                          {notification?.title}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Sign Out */}
          <div className="border-t border-border py-2">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 tesla-transition"
            >
              <Icon name="LogOut" size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileIndicator;
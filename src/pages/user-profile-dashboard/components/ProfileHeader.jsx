import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ user, isOwnProfile = false, onEditProfile = () => {} }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    onEditProfile();
  };

  const formatMemberSince = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
        {/* Avatar Section */}
        <div className="flex-shrink-0 mb-4 lg:mb-0">
          <div className="relative">
            {user?.avatar ? (
              <Image
                src={user?.avatar}
                alt={`Profile photo of ${user?.name} - professional headshot with friendly smile`}
                className="h-24 w-24 lg:h-32 lg:w-32 rounded-full object-cover border-2 border-accent"
              />
            ) : (
              <div className="h-24 w-24 lg:h-32 lg:w-32 rounded-full bg-accent flex items-center justify-center border-2 border-accent">
                <Icon name="User" size={32} color="white" />
              </div>
            )}
            
            {isOwnProfile && (
              <button
                onClick={handleEditClick}
                className="absolute bottom-0 right-0 h-8 w-8 bg-accent rounded-full flex items-center justify-center tesla-shadow-md tesla-transition hover:bg-accent/80"
                aria-label="Edit profile photo"
              >
                <Icon name="Camera" size={16} color="white" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-card-foreground mb-2">
                {user?.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                {user?.location && (
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={16} />
                    <span>{user?.location}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={16} />
                  <span>Member since {formatMemberSince(user?.memberSince)}</span>
                </div>
                
                {user?.verified && (
                  <div className="flex items-center space-x-1 text-success">
                    <Icon name="CheckCircle" size={16} />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              {user?.bio && (
                <p className="text-muted-foreground text-sm lg:text-base leading-relaxed max-w-2xl">
                  {user?.bio}
                </p>
              )}
            </div>

            {isOwnProfile && (
              <Button
                variant="outline"
                onClick={handleEditClick}
                iconName="Edit"
                iconPosition="left"
                className="self-start"
              >
                Edit Profile
              </Button>
            )}
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold text-card-foreground">
                {user?.stats?.totalListings}
              </div>
              <div className="text-xs lg:text-sm text-muted-foreground">
                Total Listings
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold text-card-foreground">
                {user?.stats?.activeListings}
              </div>
              <div className="text-xs lg:text-sm text-muted-foreground">
                Active
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold text-card-foreground">
                {user?.stats?.totalViews}
              </div>
              <div className="text-xs lg:text-sm text-muted-foreground">
                Total Views
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold text-card-foreground">
                {user?.stats?.responseRate}%
              </div>
              <div className="text-xs lg:text-sm text-muted-foreground">
                Response Rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
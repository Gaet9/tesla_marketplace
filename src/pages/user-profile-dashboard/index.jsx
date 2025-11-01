import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProfileHeader from './components/ProfileHeader';
import ListingCard from './components/ListingCard';
import MessageThread from './components/MessageThread';
import SavedOfferCard from './components/SavedOfferCard';
import AnalyticsWidget from './components/AnalyticsWidget';
import TabNavigation from './components/TabNavigation';

const UserProfileDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [savedOffers, setSavedOffers] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Mock user data
  const mockUser = {
    id: "user_123",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    bio: `Tesla enthusiast and sustainable transportation advocate. I've been driving electric vehicles for over 5 years and love helping others make the switch to clean energy. Currently selling my Model S to upgrade to the new Plaid version.`,
    location: "San Francisco, CA",
    memberSince: "2021-03-15T00:00:00Z",
    verified: true,
    stats: {
      totalListings: 8,
      activeListings: 3,
      totalViews: 12450,
      responseRate: 94
    }
  };

  // Mock listings data
  const mockListings = [
    {
      id: "listing_1",
      year: 2020,
      model: "Model S",
      variant: "Long Range",
      color: "Pearl White",
      price: 67500,
      mileage: 28500,
      location: "San Francisco, CA",
      status: "active",
      images: [
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop"
      ],
      createdAt: "2024-10-15T10:00:00Z",
      metrics: {
        views: 342,
        inquiries: 12,
        favorites: 8
      }
    },
    {
      id: "listing_2",
      year: 2019,
      model: "Model 3",
      variant: "Performance",
      color: "Midnight Silver",
      price: 45900,
      mileage: 35200,
      location: "San Francisco, CA",
      status: "pending",
      images: [
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop"
      ],
      createdAt: "2024-10-20T14:30:00Z",
      metrics: {
        views: 189,
        inquiries: 7,
        favorites: 4
      }
    },
    {
      id: "listing_3",
      year: 2021,
      model: "Model Y",
      variant: "Long Range",
      color: "Deep Blue Metallic",
      price: 52000,
      mileage: 18900,
      location: "San Francisco, CA",
      status: "sold",
      images: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop"
      ],
      createdAt: "2024-09-28T09:15:00Z",
      metrics: {
        views: 567,
        inquiries: 23,
        favorites: 15
      }
    }
  ];

  // Mock messages data
  const mockMessages = [
    {
      id: "thread_1",
      contact: {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
      },
      listingId: "listing_1",
      listingTitle: "2020 Tesla Model S Long Range",
      lastMessage: "Hi Sarah, I'm very interested in your Model S. Is it still available? I'd love to schedule a test drive this weekend if possible.",
      lastMessageAt: "2024-10-31T16:45:00Z",
      messageCount: 5,
      isRead: false
    },
    {
      id: "thread_2",
      contact: {
        name: "Emma Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
      },
      listingId: "listing_2",
      listingTitle: "2019 Tesla Model 3 Performance",
      lastMessage: "Thank you for the detailed information about the maintenance history. I\'ll discuss with my family and get back to you by tomorrow.",
      lastMessageAt: "2024-10-30T11:20:00Z",
      messageCount: 8,
      isRead: true
    },
    {
      id: "thread_3",
      contact: {
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
      },
      listingId: "listing_1",
      listingTitle: "2020 Tesla Model S Long Range",
      lastMessage: "Great meeting you today! The car is exactly what I\'m looking for. I\'ll have the financing ready by Friday.",
      lastMessageAt: "2024-10-29T14:10:00Z",
      messageCount: 12,
      isRead: true
    }
  ];

  // Mock saved offers data
  const mockSavedOffers = [
    {
      id: "offer_1",
      year: 2022,
      model: "Model 3",
      variant: "Long Range",
      color: "Red Multi-Coat",
      price: 48900,
      mileage: 15200,
      location: "Palo Alto, CA",
      status: "available",
      distance: 12,
      batteryHealth: 98,
      range: 358,
      images: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop"
      ],
      seller: {
        name: "Alex Thompson",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        verified: true
      },
      savedAt: "2024-10-25T09:30:00Z"
    },
    {
      id: "offer_2",
      year: 2021,
      model: "Model Y",
      variant: "Performance",
      color: "Pearl White",
      price: 58500,
      mileage: 22100,
      location: "San Jose, CA",
      status: "available",
      distance: 25,
      batteryHealth: 96,
      range: 303,
      images: [
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop"
      ],
      seller: {
        name: "Lisa Wang",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        verified: true
      },
      savedAt: "2024-10-22T15:45:00Z"
    }
  ];

  // Mock analytics data
  const mockAnalytics = {
    totalViews: 1098,
    viewsChange: 15.2,
    totalInquiries: 42,
    inquiriesChange: 8.7,
    profileVisits: 156,
    profileVisitsChange: -2.1,
    responseRate: 94,
    responseRateChange: 3.2,
    insights: [
      {
        type: "positive",
        message: "Your listings received 23% more views this week compared to last week."
      },
      {
        type: "neutral",
        message: "Average response time is 2.3 hours, which is excellent for buyer engagement."
      },
      {
        type: "positive",
        message: "Your Model S listing is performing 40% better than similar vehicles in your area."
      }
    ]
  };

  // Tab configuration
  const tabs = [
    {
      id: 'listings',
      label: 'My Listings',
      icon: 'Car',
      count: mockListings?.length
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: 'MessageCircle',
      count: mockMessages?.filter(m => !m?.isRead)?.length
    },
    {
      id: 'saved',
      label: 'Saved Offers',
      icon: 'Heart',
      count: mockSavedOffers?.length
    }
  ];

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUser(mockUser);
        setListings(mockListings);
        setMessages(mockMessages);
        setSavedOffers(mockSavedOffers);
        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Event handlers
  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // Navigate to profile edit page or open modal
  };

  const handleCreateListing = () => {
    navigate('/create-tesla-listing');
  };

  const handleEditListing = (listingId) => {
    navigate(`/create-tesla-listing?edit=${listingId}`);
  };

  const handleDeleteListing = (listingId) => {
    setListings(prev => prev?.filter(listing => listing?.id !== listingId));
    console.log('Deleted listing:', listingId);
  };

  const handlePromoteListing = (listingId) => {
    console.log('Promote listing:', listingId);
    // Implement promotion logic
  };

  const handleReplyToMessage = (threadId, message) => {
    console.log('Reply to thread:', threadId, 'Message:', message);
    // Implement message reply logic
  };

  const handleMarkAsRead = (threadId) => {
    setMessages(prev => 
      prev?.map(thread => 
        thread?.id === threadId ? { ...thread, isRead: true } : thread
      )
    );
  };

  const handleRemoveSavedOffer = (offerId) => {
    setSavedOffers(prev => prev?.filter(offer => offer?.id !== offerId));
    console.log('Removed saved offer:', offerId);
  };

  const handleContactSeller = (offerId, seller) => {
    console.log('Contact seller for offer:', offerId, seller);
    // Implement contact seller logic
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          isOwnProfile={true}
          onEditProfile={handleEditProfile}
        />

        {/* Analytics Widget */}
        <div className="mb-6">
          <AnalyticsWidget analytics={analytics} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tab Navigation */}
          <div className="lg:col-span-4">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={tabs}
              className="mb-6"
            />
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-4">
            {/* My Listings Tab */}
            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      My Listings
                    </h2>
                    <p className="text-muted-foreground">
                      Manage your Tesla listings and track their performance
                    </p>
                  </div>
                  <Button
                    variant="default"
                    onClick={handleCreateListing}
                    iconName="Plus"
                    iconPosition="left"
                    className="mt-4 sm:mt-0"
                  >
                    Create New Listing
                  </Button>
                </div>

                {listings?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {listings?.map((listing) => (
                      <ListingCard
                        key={listing?.id}
                        listing={listing}
                        onEdit={handleEditListing}
                        onDelete={handleDeleteListing}
                        onPromote={handlePromoteListing}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card border border-border rounded-lg">
                    <Icon name="Car" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">
                      No listings yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first Tesla listing to start selling
                    </p>
                    <Button
                      variant="default"
                      onClick={handleCreateListing}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Create Your First Listing
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Messages
                  </h2>
                  <p className="text-muted-foreground">
                    Communicate with potential buyers and sellers
                  </p>
                </div>

                {messages?.length > 0 ? (
                  <div className="space-y-4">
                    {messages?.map((thread) => (
                      <MessageThread
                        key={thread?.id}
                        thread={thread}
                        onReply={handleReplyToMessage}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card border border-border rounded-lg">
                    <Icon name="MessageCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">
                      No messages yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Messages from interested buyers will appear here
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/tesla-marketplace-home')}
                      iconName="Car"
                      iconPosition="left"
                    >
                      Browse Marketplace
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Saved Offers Tab */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Saved Offers
                  </h2>
                  <p className="text-muted-foreground">
                    Keep track of Tesla vehicles you're interested in
                  </p>
                </div>

                {savedOffers?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {savedOffers?.map((offer) => (
                      <SavedOfferCard
                        key={offer?.id}
                        offer={offer}
                        onRemove={handleRemoveSavedOffer}
                        onContact={handleContactSeller}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card border border-border rounded-lg">
                    <Icon name="Heart" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">
                      No saved offers
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Save Tesla listings you're interested in to view them later
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/tesla-marketplace-home')}
                      iconName="Search"
                      iconPosition="left"
                    >
                      Explore Marketplace
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDashboard;
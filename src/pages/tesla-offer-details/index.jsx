import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ImageGallery from './components/ImageGallery';
import VehicleSpecifications from './components/VehicleSpecifications';
import SellerInformation from './components/SellerInformation';
import LocationMap from './components/LocationMap';
import ContactForm from './components/ContactForm';
import PriceSection from './components/PriceSection';

const TeslaOfferDetails = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock vehicle data
  const vehicleData = {
    id: "tesla-001",
    title: "2022 Tesla Model S Plaid - Exceptional Performance",
    model: "Model S Plaid",
    year: 2022,
    price: 89900,
    marketValue: 94500,
    priceType: "negotiable",
    mileage: 12500,
    condition: "Excellent",
    color: "Pearl White Multi-Coat",
    vin: "5YJ3E1EA8NF123456",
    batteryRange: "396 miles EPA est.",
    acceleration: "0-60 mph in 1.99s",
    topSpeed: "200 mph",
    chargingSpeed: "250kW Supercharging",
    driveType: "Tri Motor All-Wheel Drive",
    autopilot: "Full Self-Driving Capability",
    interior: "Black Premium Interior",
    wheels: "21\" Arachnid Wheels",
    soundSystem: "22-Speaker Audio System",
    connectivity: "Premium Connectivity",
    safetyFeatures: "5-Star Safety Rating, Autopilot",
    additionalOptions: "Carbon Fiber Spoiler, Tinted Glass Roof",
    lastService: "October 2025",
    serviceHistory: "Complete Tesla Service Records",
    warranty: "4 years / 50,000 miles remaining",
    accidents: "None reported",
    previousOwners: "1 (Original Owner)",
    registration: "Current through 2026",
    listedDate: "2025-10-25",
    viewCount: 247,
    inquiryCount: 18,
    description: `This stunning 2022 Tesla Model S Plaid represents the pinnacle of electric vehicle performance and luxury. With only 12,500 carefully driven miles, this vehicle is in exceptional condition and has been meticulously maintained.\n\nKey highlights include the revolutionary tri-motor setup delivering over 1,000 horsepower, achieving 0-60 mph in just 1.99 seconds. The vehicle features the latest Full Self-Driving capability, premium interior appointments, and the advanced 17-inch touchscreen with the latest software updates.\n\nThis Model S Plaid has never been in an accident and comes with complete Tesla service records. The battery health is excellent, and all recalls and software updates are current. The vehicle includes the original documentation, both key cards, and the mobile connector.\n\nPerfect for the discerning buyer who wants the ultimate in electric performance without compromising on luxury and technology.`,
    images: [
    {
      url: "https://images.unsplash.com/photo-1648786389979-5c84d978397d",
      alt: "Front three-quarter view of white 2022 Tesla Model S Plaid on city street"
    },
    {
      url: "https://images.unsplash.com/photo-1648786389979-5c84d978397d",
      alt: "Side profile of white Tesla Model S Plaid showing sleek aerodynamic design"
    },
    {
      url: "https://images.unsplash.com/photo-1716914175679-6b80c911a4a3",
      alt: "Interior view showing black premium leather seats and minimalist dashboard"
    },
    {
      url: "https://images.unsplash.com/photo-1700934509422-075b6e2830bb",
      alt: "Close-up of Tesla touchscreen display showing vehicle controls"
    },
    {
      url: "https://images.unsplash.com/photo-1648786389979-5c84d978397d",
      alt: "Rear view of Tesla Model S Plaid showing LED taillights and spoiler"
    }]

  };

  const sellerData = {
    id: "seller-001",
    name: "Michael Rodriguez",
    avatar: "https://images.unsplash.com/photo-1724128195747-dd25cba7860f",
    avatarAlt: "Professional headshot of Hispanic man with short black hair wearing navy blue suit",
    isVerified: true,
    rating: 4.8,
    reviewCount: 23,
    location: "San Francisco, CA",
    totalListings: 3,
    soldVehicles: 12,
    joinDate: "2023-03-15",
    responseTime: "Within 2 hours",
    languages: "English, Spanish",
    bio: "Tesla enthusiast and collector with over 8 years of experience in the EV market. I specialize in high-performance Tesla vehicles and ensure all my listings are thoroughly inspected and accurately described. I believe in transparent communication and providing detailed vehicle history to help buyers make informed decisions."
  };

  const locationData = {
    address: "1234 Market Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    coordinates: {
      lat: 37.7749,
      lng: -122.4194
    }
  };

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const savedUser = localStorage.getItem('tesla_user');
      setIsAuthenticated(!!savedUser);
      setIsLoading(false);
    };

    checkAuth();

    // Check if vehicle is favorited
    const favorites = JSON.parse(localStorage.getItem('tesla_favorites') || '[]');
    setIsFavorited(favorites?.includes(vehicleData?.id));
  }, []);

  const handleAuthRequired = () => {
    sessionStorage.setItem('tesla_redirect_after_auth', window.location?.pathname);
    router?.push('/authentication-portal');
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }

    const contactSection = document.getElementById('contact-form');
    if (contactSection) {
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveToFavorites = () => {
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('tesla_favorites') || '[]');

    if (isFavorited) {
      const updatedFavorites = favorites?.filter((id) => id !== vehicleData?.id);
      localStorage.setItem('tesla_favorites', JSON.stringify(updatedFavorites));
      setIsFavorited(false);
    } else {
      favorites?.push(vehicleData?.id);
      localStorage.setItem('tesla_favorites', JSON.stringify(favorites));
      setIsFavorited(true);
    }
  };

  const handleShareListing = async () => {
    const shareData = {
      title: vehicleData?.title,
      text: `Check out this ${vehicleData?.model} for ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })?.format(vehicleData?.price)}`,
      url: window.location?.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard?.writeText(window.location?.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link');
      }
    }
  };

  const handleContactSubmit = async (formData) => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Contact form submitted:', formData);
    alert('Message sent successfully! The seller will contact you soon.');
  };

  const handleBackToMarketplace = () => {
    router?.push('/tesla-marketplace-home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          <p className="text-muted-foreground">Loading vehicle details...</p>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToMarketplace}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground tesla-transition">

              <Icon name="ArrowLeft" size={20} />
              <span>Back to Marketplace</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                iconName={isFavorited ? "Heart" : "Heart"}
                iconPosition="left"
                onClick={handleSaveToFavorites}
                className={isFavorited ? "text-error border-error" : ""}>

                {isFavorited ? "Saved" : "Save"}
              </Button>
              
              <Button
                variant="outline"
                iconName="Share"
                iconPosition="left"
                onClick={handleShareListing}>

                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vehicle Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {vehicleData?.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={16} />
              <span>{vehicleData?.year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Gauge" size={16} />
              <span>{vehicleData?.mileage?.toLocaleString()} miles</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={16} />
              <span>{sellerData?.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={16} />
              <span>{vehicleData?.viewCount} views</span>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Specifications */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery
              images={vehicleData?.images}
              vehicleTitle={vehicleData?.title} />

            
            {/* Vehicle Specifications */}
            <VehicleSpecifications vehicle={vehicleData} />
            
            {/* Location Map */}
            <LocationMap location={locationData} />
          </div>

          {/* Right Column - Price and Seller Info */}
          <div className="space-y-6">
            {/* Price Section */}
            <PriceSection
              vehicle={vehicleData}
              onSaveToFavorites={handleSaveToFavorites}
              onShareListing={handleShareListing}
              isFavorited={isFavorited} />

            
            {/* Seller Information */}
            <SellerInformation
              seller={sellerData}
              onContactSeller={handleContactSeller} />

          </div>
        </div>

        {/* Contact Form Section */}
        <div id="contact-form" className="mt-12">
          <ContactForm
            isAuthenticated={isAuthenticated}
            onSubmit={handleContactSubmit}
            onAuthRequired={handleAuthRequired}
            vehicleTitle={vehicleData?.title}
            sellerName={sellerData?.name} />

        </div>

        {/* Related Listings */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Similar Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3]?.map((item) =>
            <div key={item} className="bg-card border border-border rounded-lg p-4 hover:tesla-shadow-md tesla-transition">
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Icon name="Car" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  2021 Tesla Model S Long Range
                </h3>
                <p className="text-accent font-bold mb-2">$79,900</p>
                <p className="text-sm text-muted-foreground">15,000 miles • San Jose, CA</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Contact Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            iconName="Phone"
            className="flex-1">

            Call
          </Button>
          <Button
            variant="default"
            iconName="MessageCircle"
            iconPosition="left"
            onClick={handleContactSeller}
            className="flex-2">

            Contact Seller
          </Button>
        </div>
      </div>
    </div>);

};

export default TeslaOfferDetails;
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import AuthenticationGuard, { useAuth } from '../../components/ui/AuthenticationGuard';

import FilterToolbar from './components/FilterToolbar';
import InteractiveMap from './components/InteractiveMap';
import VehicleGrid from './components/VehicleGrid';
import QuickStats from './components/QuickStats';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const TeslaMarketplaceHome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, requireAuth } = useAuth();

  // State management
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    model: 'all',
    year: 'all',
    priceRange: 'all',
    mileage: 'all',
    location: '',
    radius: '50',
    sortBy: 'newest'
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Mock vehicle data
  const mockVehicles = [
  {
    id: '1',
    model: 'Model S',
    year: 2023,
    price: 89990,
    mileage: 12500,
    batteryHealth: 98,
    description: `Premium luxury sedan with Autopilot, premium interior package, and 19" Tempest wheels.\nFull self-driving capability included. Excellent condition with all maintenance records.`,image: "https://images.unsplash.com/photo-1585666662045-c2dca732d7db",
    imageAlt: 'Red Tesla Model S luxury sedan parked in modern driveway with glass house in background',
    sellerName: 'Michael Chen',
    sellerRating: 4.8,
    location: 'San Francisco, CA',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    isFeatured: true,
    createdAt: new Date('2024-10-28')
  },
  {
    id: '2',
    model: 'Model 3',
    year: 2022,
    price: 52990,
    mileage: 28750,
    batteryHealth: 95,
    description: `Long Range AWD with premium connectivity and enhanced autopilot.\nRecent software updates and excellent battery health. Single owner vehicle.`,
    image: "https://images.unsplash.com/photo-1638398417409-dd54452eccdf",
    imageAlt: 'White Tesla Model 3 electric sedan on mountain road with scenic valley view',
    sellerName: 'Sarah Johnson',
    sellerRating: 4.9,
    location: 'Los Angeles, CA',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    isFeatured: false,
    createdAt: new Date('2024-10-27')
  },
  {
    id: '3',
    model: 'Model X',
    year: 2024,
    price: 109990,
    mileage: 5200,
    batteryHealth: 100,
    description: `Brand new Model X Plaid with falcon wing doors and 7-seat configuration.\nFull self-driving, premium audio, and air suspension included.`,
    image: "https://images.unsplash.com/photo-1691546541124-4f59f07f3e04",
    imageAlt: 'Black Tesla Model X SUV with distinctive falcon wing doors open in urban setting',
    sellerName: 'David Rodriguez',
    sellerRating: 4.7,
    location: 'Austin, TX',
    coordinates: { lat: 30.2672, lng: -97.7431 },
    isFeatured: true,
    createdAt: new Date('2024-10-26')
  },
  {
    id: '4',
    model: 'Model Y',
    year: 2023,
    price: 67990,
    mileage: 18900,
    batteryHealth: 97,
    description: `Performance Model Y with acceleration boost and premium interior.\nTow hitch installed and all-weather floor mats included.`,
    image: "https://images.unsplash.com/photo-1675733386678-cec5bc6f2b79",
    imageAlt: 'Blue Tesla Model Y crossover SUV parked at modern charging station',
    sellerName: 'Emily Watson',
    sellerRating: 4.6,
    location: 'Seattle, WA',
    coordinates: { lat: 47.6062, lng: -122.3321 },
    isFeatured: false,
    createdAt: new Date('2024-10-25')
  },
  {
    id: '5',
    model: 'Model S',
    year: 2021,
    price: 74990,
    mileage: 35600,
    batteryHealth: 92,
    description: `Plaid Model S with tri-motor setup and carbon fiber spoiler.\nRecent tire replacement and comprehensive service completed.`,
    image: "https://images.unsplash.com/photo-1648786389979-5c84d978397d",
    imageAlt: 'Silver Tesla Model S Plaid high-performance sedan on racetrack',
    sellerName: 'James Wilson',
    sellerRating: 4.5,
    location: 'Miami, FL',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    isFeatured: false,
    createdAt: new Date('2024-10-24')
  },
  {
    id: '6',
    model: 'Model 3',
    year: 2020,
    price: 42990,
    mileage: 45200,
    batteryHealth: 89,
    description: `Standard Range Plus with autopilot and mobile connector.\nWell-maintained with regular software updates and clean history.`,
    image: "https://images.unsplash.com/photo-1655792290994-93437dc0482c",
    imageAlt: 'Pearl white Tesla Model 3 compact sedan in modern city parking garage',
    sellerName: 'Lisa Anderson',
    sellerRating: 4.8,
    location: 'Denver, CO',
    coordinates: { lat: 39.7392, lng: -104.9903 },
    isFeatured: false,
    createdAt: new Date('2024-10-23')
  }];


  // Initialize data
  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setVehicles(mockVehicles);
      setFilteredVehicles(mockVehicles);
      setLoading(false);
    };

    loadVehicles();
  }, []);

  // Filter vehicles based on current filters
  useEffect(() => {
    let filtered = [...vehicles];

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter((vehicle) =>
      vehicle?.model?.toLowerCase()?.includes(searchTerm) ||
      vehicle?.sellerName?.toLowerCase()?.includes(searchTerm) ||
      vehicle?.location?.toLowerCase()?.includes(searchTerm) ||
      vehicle?.description?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Model filter
    if (filters?.model && filters?.model !== 'all') {
      filtered = filtered?.filter((vehicle) =>
      vehicle?.model?.toLowerCase()?.replace(' ', '-') === filters?.model
      );
    }

    // Year filter
    if (filters?.year && filters?.year !== 'all') {
      if (filters?.year === 'older') {
        filtered = filtered?.filter((vehicle) => vehicle?.year <= 2015);
      } else {
        filtered = filtered?.filter((vehicle) => vehicle?.year?.toString() === filters?.year);
      }
    }

    // Price range filter
    if (filters?.priceRange && filters?.priceRange !== 'all') {
      const [min, max] = filters?.priceRange?.split('-')?.map(Number);
      if (max) {
        filtered = filtered?.filter((vehicle) => vehicle?.price >= min && vehicle?.price <= max);
      } else {
        filtered = filtered?.filter((vehicle) => vehicle?.price >= min);
      }
    }

    // Mileage filter
    if (filters?.mileage && filters?.mileage !== 'all') {
      const [min, max] = filters?.mileage?.split('-')?.map(Number);
      if (max) {
        filtered = filtered?.filter((vehicle) => vehicle?.mileage >= min && vehicle?.mileage <= max);
      } else {
        filtered = filtered?.filter((vehicle) => vehicle?.mileage >= min);
      }
    }

    // Location filter (mock implementation)
    if (filters?.location) {
      filtered = filtered?.filter((vehicle) =>
      vehicle?.location?.toLowerCase()?.includes(filters?.location?.toLowerCase())
      );
    }

    // Sort vehicles
    switch (filters?.sortBy) {
      case 'price-low':
        filtered?.sort((a, b) => a?.price - b?.price);
        break;
      case 'price-high':
        filtered?.sort((a, b) => b?.price - a?.price);
        break;
      case 'mileage-low':
        filtered?.sort((a, b) => a?.mileage - b?.mileage);
        break;
      case 'year-new':
        filtered?.sort((a, b) => b?.year - a?.year);
        break;
      case 'distance':
        // Mock distance sorting
        break;
      default: // newest
        filtered?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredVehicles(filtered);
  }, [vehicles, filters]);

  // Calculate stats
  const stats = {
    totalVehicles: vehicles?.length,
    averagePrice: vehicles?.length > 0 ? vehicles?.reduce((sum, v) => sum + v?.price, 0) / vehicles?.length : 0,
    newestYear: vehicles?.length > 0 ? Math.max(...vehicles?.map((v) => v?.year)) : new Date()?.getFullYear(),
    featuredCount: vehicles?.filter((v) => v?.isFeatured)?.length
  };

  // Event handlers
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      model: 'all',
      year: 'all',
      priceRange: 'all',
      mileage: 'all',
      location: '',
      radius: '50',
      sortBy: 'newest'
    });
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    navigate(`/tesla-offer-details?id=${vehicle?.id}`);
  };

  const handleContactSeller = (vehicle) => {
    if (!requireAuth('/tesla-marketplace-home')) return;

    // Mock contact seller functionality
    console.log('Contacting seller for vehicle:', vehicle?.id);
    // In real app, this would open a message modal or navigate to messaging
  };

  const handleMapToggle = () => {
    setIsMapVisible(!isMapVisible);
  };

  const handleLoadMore = () => {
    // Mock load more functionality
    setHasMore(false);
  };

  const handleAuthRequired = () => {
    navigate('/authentication-portal');
  };

  return (
    <AuthenticationGuard>
      <div className="min-h-screen bg-background">
        <Header
          user={user}
          onAuthRequired={handleAuthRequired} />

        
        <main className="container mx-auto px-6 py-8">
          <NavigationBreadcrumbs />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Tesla Marketplace
              </h1>
              <p className="text-muted-foreground">
                Discover premium Tesla vehicles from verified sellers across the country
              </p>
            </div>
            
            {user &&
            <Button
              variant="default"
              onClick={() => navigate('/create-tesla-listing')}
              iconName="Plus"
              iconPosition="left"
              className="mt-4 lg:mt-0">

                List Your Tesla
              </Button>
            }
          </div>

          {/* Quick Stats */}
          <QuickStats
            totalVehicles={stats?.totalVehicles}
            averagePrice={stats?.averagePrice}
            newestYear={stats?.newestYear}
            featuredCount={stats?.featuredCount}
            className="mb-8" />


          {/* Filter Toolbar */}
          <FilterToolbar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            resultCount={filteredVehicles?.length}
            className="mb-8" />


          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vehicle Grid */}
            <div className="lg:col-span-2">
              <VehicleGrid
                vehicles={filteredVehicles}
                loading={loading}
                onVehicleSelect={handleVehicleSelect}
                onContactSeller={handleContactSeller}
                onLoadMore={handleLoadMore}
                hasMore={hasMore} />

            </div>

            {/* Map Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <InteractiveMap
                  vehicles={filteredVehicles}
                  selectedVehicle={selectedVehicle}
                  onVehicleSelect={handleVehicleSelect}
                  onMapToggle={handleMapToggle}
                  isVisible={isMapVisible} />

              </div>
            </div>
          </div>

          {/* Mobile Map Toggle */}
          <div className="lg:hidden mt-8">
            <Button
              variant="outline"
              onClick={handleMapToggle}
              iconName="Map"
              iconPosition="left"
              fullWidth>

              {isMapVisible ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border mt-16">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-accent">
                    <Icon name="Zap" size={20} color="white" />
                  </div>
                  <span className="text-xl font-bold text-card-foreground">Tesla Marketplace</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  The premier destination for buying and selling pre-owned Tesla vehicles. 
                  Connect with verified sellers and find your perfect electric vehicle.
                </p>
                <div className="flex space-x-4">
                  <Button variant="ghost" iconName="Twitter" className="h-8 w-8 p-0" />
                  <Button variant="ghost" iconName="Facebook" className="h-8 w-8 p-0" />
                  <Button variant="ghost" iconName="Instagram" className="h-8 w-8 p-0" />
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-card-foreground mb-4">Marketplace</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><button className="hover:text-foreground tesla-transition">Browse Vehicles</button></li>
                  <li><button className="hover:text-foreground tesla-transition">Sell Your Tesla</button></li>
                  <li><button className="hover:text-foreground tesla-transition">Pricing Guide</button></li>
                  <li><button className="hover:text-foreground tesla-transition">Financing</button></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-card-foreground mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><button className="hover:text-foreground tesla-transition">Help Center</button></li>
                  <li><button className="hover:text-foreground tesla-transition">Contact Us</button></li>
                  <li><button className="hover:text-foreground tesla-transition">Safety Tips</button></li>
                  <li><button className="hover:text-foreground tesla-transition">Terms of Service</button></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                © {new Date()?.getFullYear()} Tesla Marketplace. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <button className="text-sm text-muted-foreground hover:text-foreground tesla-transition">
                  Privacy Policy
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground tesla-transition">
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AuthenticationGuard>);

};

export default TeslaMarketplaceHome;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const OfferModerationPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedOffers, setSelectedOffers] = useState([]);

  const offers = [
    {
      id: "1",
      title: "2023 Tesla Model S Plaid",
      seller: "John Smith",
      sellerEmail: "john.smith@email.com",
      price: 89999,
      year: 2023,
      mileage: 5200,
      location: "San Francisco, CA",
      images: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop"
      ],
      imageAlts: [
        "Red Tesla Model S Plaid parked in modern driveway with glass house background",
        "Interior view of Tesla Model S showing white leather seats and large touchscreen display"
      ],
      status: "pending",
      submittedDate: "2024-10-30",
      reportCount: 0,
      description: `Pristine 2023 Tesla Model S Plaid with only 5,200 miles. This vehicle features the tri-motor setup with 1,020 horsepower and can accelerate from 0-60 mph in under 2 seconds.\n\nIncludes:\n- Full Self-Driving capability\n- Premium interior package\n- 21-inch Arachnid wheels\n- All original documentation\n\nNo accidents, single owner, garage kept.`
    },
    {
      id: "2",
      title: "2022 Tesla Model 3 Performance",
      seller: "Sarah Johnson",
      sellerEmail: "sarah.johnson@email.com",
      price: 52999,
      year: 2022,
      mileage: 12800,
      location: "Austin, TX",
      images: [
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop"
      ],
      imageAlts: [
        "White Tesla Model 3 Performance on mountain road with scenic valley background",
        "Tesla Model 3 dashboard showing minimalist interior design with central touchscreen"
      ],
      status: "reported",
      submittedDate: "2024-10-28",
      reportCount: 2,
      description: "2022 Tesla Model 3 Performance in excellent condition. Features dual motor AWD, track mode, and performance brakes. Recently serviced with new tires."
    },
    {
      id: "3",
      title: "2021 Tesla Model Y Long Range",
      seller: "Michael Chen",
      sellerEmail: "michael.chen@email.com",
      price: 48999,
      year: 2021,
      mileage: 28500,
      location: "Seattle, WA",
      images: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop"
      ],
      imageAlts: [
        "Blue Tesla Model Y SUV parked in urban setting with city skyline in background"
      ],
      status: "pending",
      submittedDate: "2024-10-29",
      reportCount: 0,
      description: "Family-owned Tesla Model Y with dual motor AWD. Great for road trips with spacious interior and excellent range. Well-maintained with service records."
    },
    {
      id: "4",
      title: "2020 Tesla Model X P100D",
      seller: "Emily Rodriguez",
      sellerEmail: "emily.rodriguez@email.com",
      price: 75999,
      year: 2020,
      mileage: 35600,
      location: "Miami, FL",
      images: [
        "https://images.unsplash.com/photo-1617886322207-baac2c28d7b3?w=400&h=300&fit=crop"
      ],
      imageAlts: [
        "Black Tesla Model X with falcon wing doors open in luxury driveway setting"
      ],
      status: "approved",
      submittedDate: "2024-10-25",
      reportCount: 0,
      description: "Luxury Tesla Model X P100D with falcon wing doors. Features 6-seat configuration, premium audio, and autopilot. Perfect for families."
    }
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "reported", label: "Reported" }
  ];

  const filteredOffers = offers?.filter(offer => {
    const matchesSearch = offer?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         offer?.seller?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === "all" || offer?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOfferSelect = (offerId) => {
    setSelectedOffers(prev => 
      prev?.includes(offerId) 
        ? prev?.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOffers?.length === filteredOffers?.length) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(filteredOffers?.map(offer => offer?.id));
    }
  };

  const handleOfferAction = (offerId, action) => {
    console.log(`${action} offer ${offerId}`);
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on offers:`, selectedOffers);
  };

  const getStatusBadge = (status, reportCount = 0) => {
    const statusConfig = {
      pending: { color: 'text-warning', bg: 'bg-warning/10', label: 'Pending Review' },
      approved: { color: 'text-success', bg: 'bg-success/10', label: 'Approved' },
      rejected: { color: 'text-error', bg: 'bg-error/10', label: 'Rejected' },
      reported: { color: 'text-error', bg: 'bg-error/10', label: `Reported (${reportCount})` }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color} ${config?.bg}`}>
        {config?.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Input
            type="search"
            placeholder="Search offers by title or seller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="sm:max-w-xs"
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
            className="sm:max-w-xs"
          />
        </div>
        
        {selectedOffers?.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleBulkAction('approve')}
              iconName="CheckCircle"
              iconPosition="left"
            >
              Approve ({selectedOffers?.length})
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBulkAction('reject')}
              iconName="XCircle"
              iconPosition="left"
            >
              Reject ({selectedOffers?.length})
            </Button>
          </div>
        )}
      </div>
      {/* Offers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOffers?.map((offer) => (
          <div key={offer?.id} className="bg-card border border-border rounded-lg overflow-hidden tesla-shadow-sm">
            {/* Image Gallery */}
            <div className="relative h-48 bg-muted">
              {offer?.images?.length > 0 ? (
                <Image
                  src={offer?.images?.[0]}
                  alt={offer?.imageAlts?.[0]}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="Car" size={48} className="text-muted-foreground" />
                </div>
              )}
              
              {/* Selection Checkbox */}
              <div className="absolute top-3 left-3">
                <input
                  type="checkbox"
                  checked={selectedOffers?.includes(offer?.id)}
                  onChange={() => handleOfferSelect(offer?.id)}
                  className="rounded border-border bg-background/80"
                />
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                {getStatusBadge(offer?.status, offer?.reportCount)}
              </div>
              
              {/* Image Count */}
              {offer?.images?.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-background/80 px-2 py-1 rounded text-xs font-medium">
                  <Icon name="Camera" size={12} className="inline mr-1" />
                  {offer?.images?.length}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Title and Price */}
              <div>
                <h3 className="font-semibold text-card-foreground mb-1 line-clamp-1">
                  {offer?.title}
                </h3>
                <p className="text-2xl font-bold text-accent">
                  ${offer?.price?.toLocaleString()}
                </p>
              </div>

              {/* Vehicle Details */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Icon name="Calendar" size={14} />
                  <span>{offer?.year}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Icon name="Gauge" size={14} />
                  <span>{offer?.mileage?.toLocaleString()} mi</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground col-span-2">
                  <Icon name="MapPin" size={14} />
                  <span className="truncate">{offer?.location}</span>
                </div>
              </div>

              {/* Seller Info */}
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-card-foreground">{offer?.seller}</p>
                    <p className="text-muted-foreground text-xs">{offer?.sellerEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Submitted</p>
                    <p className="text-card-foreground text-xs">
                      {new Date(offer.submittedDate)?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description Preview */}
              <div className="border-t border-border pt-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {offer?.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log('View offer details', offer?.id)}
                  iconName="Eye"
                  iconPosition="left"
                  className="flex-1"
                >
                  View
                </Button>
                
                {offer?.status === 'pending' && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleOfferAction(offer?.id, 'approve')}
                      iconName="CheckCircle"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleOfferAction(offer?.id, 'reject')}
                      iconName="XCircle"
                    />
                  </>
                )}
                
                {offer?.status === 'reported' && (
                  <>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => console.log('Review reports', offer?.id)}
                      iconName="AlertTriangle"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleOfferAction(offer?.id, 'remove')}
                      iconName="Trash2"
                    />
                  </>
                )}
                
                {offer?.status === 'approved' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOfferAction(offer?.id, 'unpublish')}
                    iconName="EyeOff"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Select All Checkbox for Mobile */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedOffers?.length === filteredOffers?.length && filteredOffers?.length > 0}
            onChange={handleSelectAll}
            className="rounded border-border"
          />
          <span className="text-sm font-medium">Select All ({filteredOffers?.length})</span>
        </label>
        <span className="text-sm text-muted-foreground">
          {selectedOffers?.length} selected
        </span>
      </div>
      {filteredOffers?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Car" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">No offers found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default OfferModerationPanel;
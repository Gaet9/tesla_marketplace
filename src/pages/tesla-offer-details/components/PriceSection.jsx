import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PriceSection = ({ 
  vehicle = {}, 
  onSaveToFavorites = () => {},
  onShareListing = () => {},
  isFavorited = false 
}) => {
  const [showPriceHistory, setShowPriceHistory] = useState(false);

  const formatPrice = (price) => {
    if (!price) return "Price not available";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  const calculateMonthlyPayment = (price, downPayment = 0.2, interestRate = 0.0399, termYears = 5) => {
    const principal = price * (1 - downPayment);
    const monthlyRate = interestRate / 12;
    const numPayments = termYears * 12;
    
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return monthlyPayment;
  };

  const priceHistory = [
    { date: "2025-10-15", price: vehicle?.price + 2000, change: "initial" },
    { date: "2025-10-22", price: vehicle?.price + 1000, change: "decrease" },
    { date: "2025-10-29", price: vehicle?.price, change: "decrease" }
  ];

  const monthlyPayment = vehicle?.price ? calculateMonthlyPayment(vehicle?.price) : 0;
  const marketValue = vehicle?.marketValue || vehicle?.price * 1.05;
  const savings = marketValue - vehicle?.price;

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
      {/* Main Price */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-card-foreground mb-2">
          {formatPrice(vehicle?.price)}
        </div>
        
        {/* Market Comparison */}
        {savings > 0 && (
          <div className="flex items-center justify-center space-x-2 text-success">
            <Icon name="TrendingDown" size={16} />
            <span className="text-sm font-medium">
              {formatPrice(savings)} below market value
            </span>
          </div>
        )}
        
        {/* Price Badge */}
        {vehicle?.priceType && (
          <div className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mt-2">
            {vehicle?.priceType === 'firm' && (
              <>
                <Icon name="Lock" size={14} className="mr-1" />
                Firm Price
              </>
            )}
            {vehicle?.priceType === 'negotiable' && (
              <>
                <Icon name="MessageCircle" size={14} className="mr-1" />
                Negotiable
              </>
            )}
            {vehicle?.priceType === 'obo' && (
              <>
                <Icon name="DollarSign" size={14} className="mr-1" />
                Or Best Offer
              </>
            )}
          </div>
        )}
      </div>
      {/* Financing Estimate */}
      {vehicle?.price && (
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-card-foreground mb-3 flex items-center space-x-2">
            <Icon name="Calculator" size={16} className="text-accent" />
            <span>Estimated Monthly Payment</span>
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vehicle Price:</span>
              <span className="font-medium">{formatPrice(vehicle?.price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Down Payment (20%):</span>
              <span className="font-medium">{formatPrice(vehicle?.price * 0.2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Loan Amount:</span>
              <span className="font-medium">{formatPrice(vehicle?.price * 0.8)}</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Monthly Payment:</span>
                <span className="text-lg font-bold text-accent">
                  {formatPrice(monthlyPayment)}/mo
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                *Estimate based on 3.99% APR for 60 months
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Price History Toggle */}
      <button
        onClick={() => setShowPriceHistory(!showPriceHistory)}
        className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg tesla-transition hover:bg-muted/50 mb-4"
      >
        <span className="text-sm font-medium text-card-foreground">Price History</span>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`tesla-transition ${showPriceHistory ? 'rotate-180' : ''}`}
        />
      </button>
      {/* Price History */}
      {showPriceHistory && (
        <div className="mb-6 space-y-2">
          {priceHistory?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {new Date(entry.date)?.toLocaleDateString()}
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{formatPrice(entry?.price)}</span>
                {entry?.change === 'decrease' && (
                  <Icon name="TrendingDown" size={14} className="text-success" />
                )}
                {entry?.change === 'increase' && (
                  <Icon name="TrendingUp" size={14} className="text-error" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          fullWidth
          iconName="MessageCircle"
          iconPosition="left"
          onClick={() => {
            const contactSection = document.getElementById('contact-form');
            if (contactSection) {
              contactSection?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Contact Seller
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            iconName={isFavorited ? "Heart" : "Heart"}
            iconPosition="left"
            onClick={onSaveToFavorites}
            className={isFavorited ? "text-error border-error" : ""}
          >
            {isFavorited ? "Saved" : "Save"}
          </Button>
          
          <Button
            variant="outline"
            iconName="Share"
            iconPosition="left"
            onClick={onShareListing}
          >
            Share
          </Button>
        </div>
      </div>
      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-border space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Listed:</span>
          <span className="text-card-foreground font-medium">
            {vehicle?.listedDate ? 
              new Date(vehicle.listedDate)?.toLocaleDateString() : 
              "Recently"
            }
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Views:</span>
          <span className="text-card-foreground font-medium">
            {vehicle?.viewCount || 0} views
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Inquiries:</span>
          <span className="text-card-foreground font-medium">
            {vehicle?.inquiryCount || 0} inquiries
          </span>
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} className="text-success" />
            <span>Verified Listing</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Lock" size={12} className="text-success" />
            <span>Secure Contact</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
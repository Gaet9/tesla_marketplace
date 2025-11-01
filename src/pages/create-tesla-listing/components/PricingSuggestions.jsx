import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PricingSuggestions = ({ 
  vehicleData = {}, 
  currentPrice = '', 
  onPriceChange,
  className = '' 
}) => {
  const [marketData, setMarketData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Mock market data - in real app, fetch from pricing API
  const mockMarketData = {
    suggestedPrice: 45000,
    priceRange: { min: 42000, max: 48000 },
    marketAverage: 44500,
    competitivePrice: 43500,
    quickSalePrice: 41000,
    similarListings: [
      {
        id: 1,
        model: "Model 3 Long Range",
        year: 2021,
        mileage: 25000,
        price: 44000,
        location: "San Francisco, CA",
        daysOnMarket: 12
      },
      {
        id: 2,
        model: "Model 3 Long Range", 
        year: 2021,
        mileage: 30000,
        price: 42500,
        location: "Los Angeles, CA",
        daysOnMarket: 8
      },
      {
        id: 3,
        model: "Model 3 Long Range",
        year: 2020,
        mileage: 35000, 
        price: 40000,
        location: "Austin, TX",
        daysOnMarket: 15
      }
    ],
    factors: [
      { factor: "Low mileage", impact: "+$2,000", positive: true },
      { factor: "Excellent condition", impact: "+$1,500", positive: true },
      { factor: "Popular color", impact: "+$500", positive: true },
      { factor: "High demand area", impact: "+$1,000", positive: true },
      { factor: "Model year", impact: "-$1,000", positive: false }
    ]
  };

  useEffect(() => {
    if (vehicleData?.model && vehicleData?.year && vehicleData?.mileage) {
      fetchPricingSuggestions();
    }
  }, [vehicleData?.model, vehicleData?.year, vehicleData?.mileage]);

  const fetchPricingSuggestions = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setMarketData(mockMarketData);
    setIsLoading(false);
  };

  const handlePriceSelect = (price) => {
    onPriceChange(price?.toString());
  };

  const getPriceRecommendation = (price) => {
    if (!marketData) return '';
    
    const numPrice = parseInt(price);
    const { suggestedPrice, priceRange } = marketData;
    
    if (numPrice < priceRange?.min) {
      return { text: 'Below market value - may sell quickly', color: 'text-warning', icon: 'TrendingDown' };
    } else if (numPrice > priceRange?.max) {
      return { text: 'Above market value - may take longer to sell', color: 'text-error', icon: 'TrendingUp' };
    } else if (numPrice >= priceRange?.min && numPrice <= suggestedPrice) {
      return { text: 'Competitive pricing - good balance', color: 'text-success', icon: 'Target' };
    } else {
      return { text: 'Premium pricing - for pristine vehicles', color: 'text-accent', icon: 'Star' };
    }
  };

  const currentPriceRecommendation = currentPrice ? getPriceRecommendation(currentPrice) : null;

  if (!vehicleData?.model) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <Icon name="DollarSign" size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Enter vehicle details to see pricing suggestions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Pricing Suggestions</h3>
        {marketData && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            iconName={showDetails ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-3"></div>
          <p className="text-muted-foreground">Analyzing market data...</p>
        </div>
      ) : marketData ? (
        <div className="space-y-4">
          {/* Current Price Feedback */}
          {currentPrice && currentPriceRecommendation && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={currentPriceRecommendation?.icon} 
                  size={16} 
                  className={currentPriceRecommendation?.color} 
                />
                <span className={`text-sm font-medium ${currentPriceRecommendation?.color}`}>
                  ${parseInt(currentPrice)?.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  - {currentPriceRecommendation?.text}
                </span>
              </div>
            </div>
          )}

          {/* Price Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handlePriceSelect(marketData?.quickSalePrice)}
              className="p-4 border border-border rounded-lg text-left hover:bg-muted/50 tesla-transition"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Zap" size={16} className="text-warning" />
                <span className="text-sm font-medium text-foreground">Quick Sale</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                ${marketData?.quickSalePrice?.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Sell within 1-2 weeks</p>
            </button>

            <button
              onClick={() => handlePriceSelect(marketData?.competitivePrice)}
              className="p-4 border-2 border-accent rounded-lg text-left hover:bg-accent/5 tesla-transition"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Target" size={16} className="text-accent" />
                <span className="text-sm font-medium text-accent">Recommended</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                ${marketData?.competitivePrice?.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Best balance of price & speed</p>
            </button>

            <button
              onClick={() => handlePriceSelect(marketData?.suggestedPrice)}
              className="p-4 border border-border rounded-lg text-left hover:bg-muted/50 tesla-transition"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="TrendingUp" size={16} className="text-success" />
                <span className="text-sm font-medium text-foreground">Maximum Value</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                ${marketData?.suggestedPrice?.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">For pristine vehicles</p>
            </button>
          </div>

          {/* Market Range */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Market Range</span>
              <span className="text-sm font-medium text-foreground">
                ${marketData?.priceRange?.min?.toLocaleString()} - ${marketData?.priceRange?.max?.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full"
                style={{ width: '70%' }}
              />
            </div>
          </div>

          {/* Detailed Analysis */}
          {showDetails && (
            <div className="space-y-4 pt-4 border-t border-border">
              {/* Price Factors */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Price Factors</h4>
                <div className="space-y-2">
                  {marketData?.factors?.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{factor?.factor}</span>
                      <span className={`text-sm font-medium ${
                        factor?.positive ? 'text-success' : 'text-error'
                      }`}>
                        {factor?.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar Listings */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Similar Listings</h4>
                <div className="space-y-3">
                  {marketData?.similarListings?.map((listing) => (
                    <div key={listing?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {listing?.year} {listing?.model}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {listing?.mileage?.toLocaleString()} miles • {listing?.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          ${listing?.price?.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {listing?.daysOnMarket} days listed
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="AlertCircle" size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Unable to load pricing data. Please try again.
          </p>
          <Button
            variant="outline"
            onClick={fetchPricingSuggestions}
            className="mt-3"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
};

export default PricingSuggestions;
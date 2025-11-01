import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import VehicleInfoForm from './components/VehicleInfoForm';
import ImageUploadSection from './components/ImageUploadSection';
import LocationSelector from './components/LocationSelector';
import ListingPreview from './components/ListingPreview';
import FormProgressIndicator from './components/FormProgressIndicator';
import PricingSuggestions from './components/PricingSuggestions';

const CreateTeslaListing = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    model: '',
    year: '',
    mileage: '',
    price: '',
    vin: '',
    condition: '',
    battery: '',
    exteriorColor: '',
    interiorColor: '',
    description: '',
    features: []
  });
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const user = localStorage.getItem('tesla_user');
    if (!user) {
      sessionStorage.setItem('tesla_redirect_after_auth', '/create-tesla-listing');
      navigate('/authentication-portal');
    }
  }, [navigate]);

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('tesla_listing_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft?.formData || {});
        setImages(draft?.images || []);
        setLocation(draft?.location || {});
        setCurrentStep(draft?.currentStep || 1);
        setIsDraft(true);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData?.model || images?.length > 0 || location?.address) {
        const draft = {
          formData,
          images,
          location,
          currentStep,
          timestamp: new Date()?.toISOString()
        };
        localStorage.setItem('tesla_listing_draft', JSON.stringify(draft));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, images, location, currentStep]);

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData?.model) newErrors.model = 'Please select a Tesla model';
        if (!formData?.year) newErrors.year = 'Please select the year';
        if (!formData?.mileage) newErrors.mileage = 'Please enter the mileage';
        if (!formData?.price) newErrors.price = 'Please enter the asking price';
        if (!formData?.condition) newErrors.condition = 'Please select the vehicle condition';
        if (!formData?.exteriorColor) newErrors.exteriorColor = 'Please select exterior color';
        if (!formData?.interiorColor) newErrors.interiorColor = 'Please select interior color';
        if (!formData?.description || formData?.description?.length < 50) {
          newErrors.description = 'Please provide a detailed description (minimum 50 characters)';
        }
        break;
      
      case 2:
        if (images?.length === 0) {
          newErrors.images = 'Please upload at least one photo of your vehicle';
        }
        break;
      
      case 3:
        if (!location?.address) newErrors.address = 'Please enter the vehicle location';
        if (!location?.city) newErrors.city = 'Please enter the city';
        if (!location?.state) newErrors.state = 'Please enter the state';
        if (!location?.zipCode) newErrors.zipCode = 'Please enter the ZIP code';
        break;
      
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step) => {
    if (step <= currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call to save draft
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const draft = {
        formData,
        images,
        location,
        currentStep,
        timestamp: new Date()?.toISOString()
      };
      
      localStorage.setItem('tesla_listing_draft', JSON.stringify(draft));
      setIsDraft(true);
      
      // Show success message
      alert('Draft saved successfully!');
      
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishListing = async () => {
    if (!validateStep(4)) return;

    try {
      setIsSubmitting(true);
      
      // Simulate API call to publish listing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create listing object
      const listing = {
        id: Date.now()?.toString(),
        ...formData,
        images,
        location,
        status: 'active',
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
        views: 0,
        inquiries: 0
      };
      
      // Clear draft
      localStorage.removeItem('tesla_listing_draft');
      
      // Show success and redirect
      alert('Listing published successfully!');
      navigate('/user-profile-dashboard');
      
    } catch (error) {
      console.error('Error publishing listing:', error);
      alert('Failed to publish listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('tesla_listing_draft');
    setFormData({
      model: '',
      year: '',
      mileage: '',
      price: '',
      vin: '',
      condition: '',
      battery: '',
      exteriorColor: '',
      interiorColor: '',
      description: '',
      features: []
    });
    setImages([]);
    setLocation({});
    setCurrentStep(1);
    setIsDraft(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/user-profile-dashboard')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to Dashboard
              </Button>
              
              <div className="h-6 w-px bg-border" />
              
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Create Tesla Listing</h1>
                <p className="text-sm text-muted-foreground">
                  List your Tesla for sale on the marketplace
                </p>
              </div>
            </div>

            {isDraft && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Save" size={16} />
                  <span>Draft saved</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearDraft}
                  iconName="Trash2"
                >
                  Clear Draft
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <FormProgressIndicator
                currentStep={currentStep}
                totalSteps={4}
                onStepClick={handleStepClick}
              />
              
              {/* Pricing Suggestions */}
              {currentStep === 1 && formData?.model && formData?.year && formData?.mileage && (
                <PricingSuggestions
                  vehicleData={formData}
                  currentPrice={formData?.price}
                  onPriceChange={(price) => setFormData(prev => ({ ...prev, price }))}
                />
              )}
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Step 1: Vehicle Information */}
              <VehicleInfoForm
                formData={formData}
                onFormChange={setFormData}
                errors={errors}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
              />

              {/* Step 2: Image Upload */}
              <ImageUploadSection
                images={images}
                onImagesChange={setImages}
                errors={errors}
                currentStep={currentStep}
              />

              {/* Step 3: Location */}
              <LocationSelector
                location={location}
                onLocationChange={setLocation}
                errors={errors}
                currentStep={currentStep}
              />

              {/* Step 4: Preview & Publish */}
              <ListingPreview
                formData={formData}
                images={images}
                location={location}
                currentStep={currentStep}
                onPublish={handlePublishListing}
                onSaveDraft={handleSaveDraft}
              />

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    iconName="ChevronLeft"
                    iconPosition="left"
                  >
                    Previous
                  </Button>

                  <div className="flex space-x-3">
                    <Button
                      variant="ghost"
                      onClick={handleSaveDraft}
                      loading={isSubmitting}
                      iconName="Save"
                      iconPosition="left"
                    >
                      Save Draft
                    </Button>
                    
                    <Button
                      variant="default"
                      onClick={handleNextStep}
                      iconName="ChevronRight"
                      iconPosition="right"
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-foreground font-medium">
              {currentStep === 4 ? 'Publishing your listing...' : 'Saving draft...'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Please wait while we process your request
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTeslaListing;
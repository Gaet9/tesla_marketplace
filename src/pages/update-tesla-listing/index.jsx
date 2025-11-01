import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import VehicleInfoForm from '../create-tesla-listing/components/VehicleInfoForm';
import ImageUploadSection from '../create-tesla-listing/components/ImageUploadSection';
import LocationSelector from '../create-tesla-listing/components/LocationSelector';
import ListingPreview from '../create-tesla-listing/components/ListingPreview';
import FormProgressIndicator from '../create-tesla-listing/components/FormProgressIndicator';
import PricingSuggestions from '../create-tesla-listing/components/PricingSuggestions';
import { getOfferById, updateOffer } from '../../services/offersService';

const UpdateTeslaListing = () => {
  const navigate = useNavigate();
  const { id: listingId } = useParams();
  const [searchParams] = useSearchParams();
  const stepParam = searchParams?.get('step');
  
  const [currentStep, setCurrentStep] = useState(parseInt(stepParam) || 1);
  const [originalListing, setOriginalListing] = useState(null);
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Check authentication and load listing data on mount
  useEffect(() => {
    const user = localStorage.getItem('tesla_user');
    if (!user) {
      sessionStorage.setItem('tesla_redirect_after_auth', `/update-tesla-listing/${listingId}`);
      navigate('/authentication-portal');
      return;
    }

    loadListingData();
  }, [listingId, navigate]);

  // Load existing listing data
  const loadListingData = async () => {
    if (!listingId) {
      navigate('/user-profile-dashboard');
      return;
    }

    try {
      setIsLoading(true);
      const result = await getOfferById(listingId);
      
      if (!result?.success) {
        alert(result?.error || 'Failed to load listing data');
        navigate('/user-profile-dashboard');
        return;
      }

      const listing = result?.data;
      
      // Check if current user owns this listing
      const currentUser = JSON.parse(localStorage.getItem('tesla_user') || '{}');
      if (listing?.user_id !== currentUser?.id) {
        alert('You can only edit your own listings');
        navigate('/user-profile-dashboard');
        return;
      }

      setOriginalListing(listing);
      
      // Populate form with existing data
      setFormData({
        model: listing?.model || '',
        year: listing?.year?.toString() || '',
        mileage: listing?.mileage?.toString() || '',
        price: listing?.price?.toString() || '',
        vin: listing?.vin || '',
        condition: listing?.condition || '',
        battery: listing?.battery || '',
        exteriorColor: listing?.exterior_color || '',
        interiorColor: listing?.interior_color || '',
        description: listing?.description || '',
        features: listing?.features || []
      });

      // Handle images - convert string to array if needed
      const existingImages = listing?.image_url ? 
        (Array.isArray(listing?.image_url) ? listing?.image_url : [listing?.image_url]) : [];
      setImages(existingImages);

      // Set location data
      setLocation({
        address: listing?.location || '',
        city: listing?.city || '',
        state: listing?.state || '',
        zipCode: listing?.zip_code || '',
        lat: listing?.lat || null,
        long: listing?.long || null
      });

    } catch (error) {
      console.error('Error loading listing:', error);
      alert('Failed to load listing data');
      navigate('/user-profile-dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save draft with changes detection
  useEffect(() => {
    if (!originalListing) return;
    
    const timer = setTimeout(() => {
      const hasChanges = JSON.stringify(formData) !== JSON.stringify({
        model: originalListing?.model || '',
        year: originalListing?.year?.toString() || '',
        mileage: originalListing?.mileage?.toString() || '',
        price: originalListing?.price?.toString() || '',
        vin: originalListing?.vin || '',
        condition: originalListing?.condition || '',
        battery: originalListing?.battery || '',
        exteriorColor: originalListing?.exterior_color || '',
        interiorColor: originalListing?.interior_color || '',
        description: originalListing?.description || '',
        features: originalListing?.features || []
      });

      setHasUnsavedChanges(hasChanges);

      if (hasChanges) {
        const draft = {
          listingId,
          formData,
          images,
          location,
          currentStep,
          timestamp: new Date()?.toISOString()
        };
        localStorage.setItem(`tesla_update_draft_${listingId}`, JSON.stringify(draft));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, images, location, currentStep, originalListing, listingId]);

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
      const newStep = Math.min(currentStep + 1, 4);
      setCurrentStep(newStep);
      // Update URL with step parameter
      navigate(`/update-tesla-listing/${listingId}?step=${newStep}`, { replace: true });
    }
  };

  const handlePrevStep = () => {
    const newStep = Math.max(currentStep - 1, 1);
    setCurrentStep(newStep);
    navigate(`/update-tesla-listing/${listingId}?step=${newStep}`, { replace: true });
  };

  const handleStepClick = (step) => {
    if (step <= currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
      navigate(`/update-tesla-listing/${listingId}?step=${step}`, { replace: true });
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      
      const draft = {
        listingId,
        formData,
        images,
        location,
        currentStep,
        timestamp: new Date()?.toISOString()
      };
      
      localStorage.setItem(`tesla_update_draft_${listingId}`, JSON.stringify(draft));
      
      alert('Changes saved as draft!');
      
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateListing = async () => {
    if (!validateStep(4)) return;

    try {
      setIsSubmitting(true);
      
      const currentUser = JSON.parse(localStorage.getItem('tesla_user') || '{}');
      
      // Prepare update data
      const updateData = {
        brand: 'Tesla', // Since this is Tesla marketplace
        model: formData?.model,
        year: parseInt(formData?.year),
        price: parseFloat(formData?.price),
        mileage: parseInt(formData?.mileage),
        description: formData?.description,
        location: location?.address,
        lat: location?.lat,
        long: location?.long,
        image_url: images?.length > 0 ? images : null,
        // Map form fields to database fields
        condition: formData?.condition,
        battery: formData?.battery,
        exterior_color: formData?.exteriorColor,
        interior_color: formData?.interiorColor,
        features: formData?.features,
        city: location?.city,
        state: location?.state,
        zip_code: location?.zipCode,
        vin: formData?.vin
      };
      
      const result = await updateOffer(listingId, updateData, currentUser?.id);
      
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to update listing');
      }
      
      // Clear draft after successful update
      localStorage.removeItem(`tesla_update_draft_${listingId}`);
      
      alert('Listing updated successfully!');
      navigate('/user-profile-dashboard');
      
    } catch (error) {
      console.error('Error updating listing:', error);
      alert(error?.message || 'Failed to update listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscardChanges = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Are you sure you want to discard all changes? This cannot be undone.')) {
        localStorage.removeItem(`tesla_update_draft_${listingId}`);
        navigate('/user-profile-dashboard');
      }
    } else {
      navigate('/user-profile-dashboard');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Loading listing...</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please wait while we fetch your listing data
          </p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-card-foreground">Update Tesla Listing</h1>
                <p className="text-sm text-muted-foreground">
                  Edit your Tesla listing details
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {hasUnsavedChanges && (
                <div className="flex items-center space-x-2 text-sm text-orange-600">
                  <Icon name="AlertCircle" size={16} />
                  <span>Unsaved changes</span>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDiscardChanges}
                iconName="X"
              >
                {hasUnsavedChanges ? 'Discard Changes' : 'Cancel'}
              </Button>
            </div>
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

              {/* Original vs Current Comparison */}
              {originalListing && hasUnsavedChanges && (
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                    <Icon name="GitCompare" size={16} className="mr-2" />
                    Changes Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    {formData?.price !== originalListing?.price?.toString() && (
                      <div className="text-muted-foreground">
                        Price: ${originalListing?.price?.toLocaleString()} → ${parseFloat(formData?.price || 0)?.toLocaleString()}
                      </div>
                    )}
                    {formData?.mileage !== originalListing?.mileage?.toString() && (
                      <div className="text-muted-foreground">
                        Mileage: {originalListing?.mileage?.toLocaleString()} → {parseInt(formData?.mileage || 0)?.toLocaleString()} miles
                      </div>
                    )}
                    {images?.length !== (originalListing?.image_url ? 1 : 0) && (
                      <div className="text-muted-foreground">
                        Images: {originalListing?.image_url ? 1 : 0} → {images?.length} photos
                      </div>
                    )}
                  </div>
                </div>
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

              {/* Step 4: Preview & Update */}
              <ListingPreview
                formData={formData}
                images={images}
                location={location}
                currentStep={currentStep}
                onPublish={handleUpdateListing}
                onSaveDraft={handleSaveDraft}
                isUpdate={true}
                originalData={originalListing}
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
                      Save Changes
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
              {currentStep === 4 ? 'Updating your listing...' : 'Saving changes...'}
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

export default UpdateTeslaListing;
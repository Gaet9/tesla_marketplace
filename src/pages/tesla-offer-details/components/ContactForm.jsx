import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ContactForm = ({ 
  isAuthenticated = false, 
  onSubmit = () => {}, 
  onAuthRequired = () => {},
  vehicleTitle = "",
  sellerName = ""
}) => {
  const [formData, setFormData] = useState({
    inquiryType: '',
    message: '',
    contactMethod: 'email',
    phoneNumber: '',
    preferredTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'inspection', label: 'Schedule Inspection' },
    { value: 'test_drive', label: 'Request Test Drive' },
    { value: 'negotiation', label: 'Price Negotiation' },
    { value: 'financing', label: 'Financing Options' },
    { value: 'trade_in', label: 'Trade-in Discussion' }
  ];

  const contactMethods = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'text', label: 'Text Message' }
  ];

  const messageTemplates = {
    general: `Hi ${sellerName},\n\nI'm interested in your ${vehicleTitle}. Could you please provide more information about the vehicle's condition and availability for viewing?\n\nThank you!`,
    inspection: `Hi ${sellerName},\n\nI would like to schedule an inspection of your ${vehicleTitle}. When would be a convenient time for you?\n\nLooking forward to hearing from you.`,
    test_drive: `Hi ${sellerName},\n\nI'm very interested in your ${vehicleTitle} and would like to arrange a test drive. Please let me know your availability.\n\nThank you!`,
    negotiation: `Hi ${sellerName},\n\nI'm interested in your ${vehicleTitle}. Would you be open to discussing the price? I'm a serious buyer and ready to move forward.\n\nBest regards.`,
    financing: `Hi ${sellerName},\n\nI'm interested in your ${vehicleTitle}. Do you have any information about financing options or can you recommend any lenders?\n\nThank you!`,
    trade_in: `Hi ${sellerName},\n\nI'm interested in your ${vehicleTitle} and have a vehicle I'd like to trade in. Would you be interested in discussing a trade-in deal?\n\nLooking forward to your response.`
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleInquiryTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      inquiryType: value,
      message: messageTemplates?.[value] || ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type';
    }
    
    if (!formData?.message?.trim()) {
      newErrors.message = 'Please enter a message';
    } else if (formData?.message?.trim()?.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    
    if (formData?.contactMethod === 'phone' && !formData?.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number is required for phone contact';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
      // Reset form on success
      setFormData({
        inquiryType: '',
        message: '',
        contactMethod: 'email',
        phoneNumber: '',
        preferredTime: ''
      });
      
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="MessageCircle" size={20} className="text-accent" />
          <span>Contact Seller</span>
        </h3>
        
        <div className="text-center py-8">
          <Icon name="Lock" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-card-foreground mb-2">
            Sign in to Contact Seller
          </h4>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to send messages to sellers and access contact information.
          </p>
          
          <Button
            variant="default"
            iconName="LogIn"
            iconPosition="left"
            onClick={onAuthRequired}
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-bold text-card-foreground mb-6 flex items-center space-x-2">
        <Icon name="MessageCircle" size={20} className="text-accent" />
        <span>Contact Seller</span>
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Inquiry Type */}
        <Select
          label="What are you interested in?"
          placeholder="Select inquiry type"
          options={inquiryTypes}
          value={formData?.inquiryType}
          onChange={handleInquiryTypeChange}
          error={errors?.inquiryType}
          required
        />
        
        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Message *
          </label>
          <textarea
            value={formData?.message}
            onChange={(e) => handleInputChange('message', e?.target?.value)}
            placeholder="Write your message to the seller..."
            rows={6}
            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground resize-none tesla-transition focus:outline-none focus:ring-2 focus:ring-accent ${
              errors?.message ? 'border-error' : 'border-border focus:border-accent'
            }`}
          />
          {errors?.message && (
            <p className="text-sm text-error mt-1">{errors?.message}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {formData?.message?.length}/500 characters
          </p>
        </div>
        
        {/* Contact Method */}
        <Select
          label="Preferred contact method"
          options={contactMethods}
          value={formData?.contactMethod}
          onChange={(value) => handleInputChange('contactMethod', value)}
        />
        
        {/* Phone Number (conditional) */}
        {formData?.contactMethod !== 'email' && (
          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            value={formData?.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e?.target?.value)}
            error={errors?.phoneNumber}
            required={formData?.contactMethod !== 'email'}
          />
        )}
        
        {/* Preferred Time */}
        <Input
          label="Preferred contact time (optional)"
          type="text"
          placeholder="e.g., Weekdays after 6 PM, Weekends anytime"
          value={formData?.preferredTime}
          onChange={(e) => handleInputChange('preferredTime', e?.target?.value)}
        />
        
        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isSubmitting}
          iconName="Send"
          iconPosition="left"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending Message...' : 'Send Message'}
        </Button>
        
        {/* Privacy Notice */}
        <div className="bg-muted/30 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h6 className="text-sm font-semibold text-card-foreground mb-1">
                Privacy & Safety
              </h6>
              <p className="text-xs text-muted-foreground">
                Your contact information will only be shared with the seller. We recommend meeting in public places and verifying all vehicle information before making any payments.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
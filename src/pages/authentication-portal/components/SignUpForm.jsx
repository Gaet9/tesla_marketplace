import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const SignUpForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  const validatePassword = (password) => {
    const feedback = [];
    let score = 0;

    if (password?.length >= 8) {
      score += 1;
    } else {
      feedback?.push('At least 8 characters');
    }

    if (/[A-Z]/?.test(password)) {
      score += 1;
    } else {
      feedback?.push('One uppercase letter');
    }

    if (/[a-z]/?.test(password)) {
      score += 1;
    } else {
      feedback?.push('One lowercase letter');
    }

    if (/\d/?.test(password)) {
      score += 1;
    } else {
      feedback?.push('One number');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/?.test(password)) {
      score += 1;
    } else {
      feedback?.push('One special character');
    }

    return { score, feedback };
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength?.score < 3) {
      newErrors.password = 'Password is too weak';
    }
    
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password') {
      setPasswordStrength(validatePassword(value));
    }
    
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getStrengthColor = (score) => {
    if (score <= 1) return 'bg-error';
    if (score <= 3) return 'bg-warning';
    return 'bg-success';
  };

  const getStrengthText = (score) => {
    if (score <= 1) return 'Weak';
    if (score <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          value={formData?.firstName}
          onChange={(e) => handleInputChange('firstName', e?.target?.value)}
          error={errors?.firstName}
          required
          disabled={isLoading}
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          value={formData?.lastName}
          onChange={(e) => handleInputChange('lastName', e?.target?.value)}
          error={errors?.lastName}
          required
          disabled={isLoading}
        />
      </div>
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={formData?.email}
        onChange={(e) => handleInputChange('email', e?.target?.value)}
        error={errors?.email}
        required
        disabled={isLoading}
      />
      <div className="space-y-2">
        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          value={formData?.password}
          onChange={(e) => handleInputChange('password', e?.target?.value)}
          error={errors?.password}
          required
          disabled={isLoading}
        />
        
        {formData?.password && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className={`h-full rounded-full tesla-transition ${getStrengthColor(passwordStrength?.score)}`}
                  style={{ width: `${(passwordStrength?.score / 5) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${
                passwordStrength?.score <= 1 ? 'text-error' :
                passwordStrength?.score <= 3 ? 'text-warning' : 'text-success'
              }`}>
                {getStrengthText(passwordStrength?.score)}
              </span>
            </div>
            
            {passwordStrength?.feedback?.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <span>Password must include: </span>
                {passwordStrength?.feedback?.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={formData?.confirmPassword}
        onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
        error={errors?.confirmPassword}
        required
        disabled={isLoading}
      />
      <Checkbox
        label="I agree to the Terms of Service and Privacy Policy"
        checked={formData?.agreeToTerms}
        onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
        error={errors?.agreeToTerms}
        required
        disabled={isLoading}
      />
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="left"
      >
        Create Account
      </Button>
      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
        <Icon name="Shield" size={14} />
        <span>Your information is protected with enterprise-grade security</span>
      </div>
    </form>
  );
};

export default SignUpForm;
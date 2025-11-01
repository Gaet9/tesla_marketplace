import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import AuthTabs from './components/AuthTabs';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import SocialAuthButtons from './components/SocialAuthButtons';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import TrustSignals from './components/TrustSignals';

const AuthenticationPortal = () => {
  const { signIn, signUp, signInWithOAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSignIn = async (formData) => {
    setIsLoading(true);
    
    try {
      const result = await signIn(formData?.email, formData?.password);
      if (!result?.success) {
        showNotification(result?.error || 'Sign in failed. Please try again.', 'error');
      } else {
        showNotification('Successfully signed in!');
        setTimeout(() => navigate('/tesla-marketplace-home'), 1000);
      }
    } catch (error) {
      showNotification('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (formData) => {
    setIsLoading(true);
    
    try {
      const result = await signUp(
        formData?.email,
        formData?.password, 
        formData?.firstName,
        formData?.lastName
      );
      if (!result?.success) {
        showNotification(result?.error || 'Sign up failed. Please try again.', 'error');
      } else {
        showNotification('Account created successfully! Please check your email to verify your account.');
        setActiveTab('signin');
      }
    } catch (error) {
      showNotification('Failed to create account. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setIsLoading(true);
    
    try {
      const result = await signInWithOAuth(provider);
      if (!result?.success) {
        showNotification(result?.error || `Failed to sign in with ${provider}. Please try again.`, 'error');
      } else {
        showNotification(`Redirecting to ${provider?.charAt(0)?.toUpperCase() + provider?.slice(1)}...`);
        // OAuth redirect is handled automatically by Supabase
      }
    } catch (error) {
      showNotification(`Failed to sign in with ${provider}. Please try again.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase?.auth?.resetPasswordForEmail(email, {
        redirectTo: `${window?.location?.origin}/reset-password`,
      });
      
      if (error) {
        showNotification(error?.message, 'error');
      } else {
        showNotification('Password reset link sent to your email!');
        setIsForgotPasswordOpen(false);
      }
    } catch (error) {
      showNotification('Failed to send reset email. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5"></div>
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg tesla-shadow-md max-w-sm ${
          notification?.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <Icon 
              name={notification?.type === 'error' ? 'AlertCircle' : 'CheckCircle'} 
              size={16} 
            />
            <span className="text-sm font-medium">{notification?.message}</span>
          </div>
        </div>
      )}
      
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Icon name="Zap" size={24} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Tesla Marketplace</h1>
          </div>
          <p className="text-muted-foreground">
            {activeTab === 'signin' ? 'Welcome back! Sign in to your account' : 'Join the Tesla community today'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card border border-border rounded-lg tesla-shadow-lg p-6">
          <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'signin' ? (
            <SignInForm
              onSubmit={handleSignIn}
              onForgotPassword={() => setIsForgotPasswordOpen(true)}
              isLoading={isLoading}
            />
          ) : (
            <SignUpForm
              onSubmit={handleSignUp}
              isLoading={isLoading}
            />
          )}

          <div className="mt-6">
            <SocialAuthButtons
              onSocialAuth={handleSocialAuth}
              isLoading={isLoading}
            />
          </div>

          <TrustSignals />
        </div>

        {/* OAuth Setup Instructions */}
        <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center">
            <Icon name="Info" size={16} className="mr-2" />
            OAuth Setup Required
          </h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div><strong>Google:</strong> Configure OAuth in Supabase Dashboard → Authentication → Providers</div>
            <div><strong>Facebook:</strong> Set up Facebook App and add credentials to Supabase</div>
            <div><strong>Redirect URLs:</strong> Add your domain to allowed redirect URLs</div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/tesla-marketplace-home')}
            className="text-sm text-accent hover:text-accent/80 tesla-transition"
          >
            Continue as Guest
          </button>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onSubmit={handleForgotPassword}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AuthenticationPortal;
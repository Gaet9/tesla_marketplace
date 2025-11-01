import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Icon from '../../components/AppIcon';
import AuthTabs from './components/AuthTabs';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import SocialAuthButtons from './components/SocialAuthButtons';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import TrustSignals from './components/TrustSignals';

const AuthenticationPortal = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const router = useRouter();

  // Mock credentials for testing
  const mockCredentials = {
    admin: { email: "admin@teslamarketplace.com", password: "Admin123!" },
    user: { email: "user@teslamarketplace.com", password: "User123!" },
    seller: { email: "seller@teslamarketplace.com", password: "Seller123!" }
  };

  useEffect(() => {
    // Check if user is already authenticated
    const savedUser = localStorage.getItem('tesla_user');
    if (savedUser) {
      router?.push('/tesla-marketplace-home');
    }
  }, [router]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSignIn = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check mock credentials
      const matchedUser = Object.entries(mockCredentials)?.find(([role, creds]) => 
        creds?.email === formData?.email && creds?.password === formData?.password
      );
      
      if (matchedUser) {
        const [role] = matchedUser;
        const mockUser = {
          id: `${role}_${Date.now()}`,
          email: formData?.email,
          name: formData?.email?.split('@')?.[0],
          role: role,
          avatar: null,
          createdAt: new Date()?.toISOString(),
          rememberMe: formData?.rememberMe
        };
        
        localStorage.setItem('tesla_user', JSON.stringify(mockUser));
        showNotification('Successfully signed in!');
        
        // Redirect based on role
        const redirectPath = role === 'admin' ? '/admin-dashboard' : '/tesla-marketplace-home';
        setTimeout(() => router?.push(redirectPath), 1000);
      } else {
        throw new Error('Invalid email or password. Please use the provided test credentials.');
      }
    } catch (error) {
      showNotification(error?.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser = {
        id: `user_${Date.now()}`,
        email: formData?.email,
        name: `${formData?.firstName} ${formData?.lastName}`,
        firstName: formData?.firstName,
        lastName: formData?.lastName,
        role: 'user',
        avatar: null,
        createdAt: new Date()?.toISOString()
      };
      
      localStorage.setItem('tesla_user', JSON.stringify(mockUser));
      showNotification('Account created successfully! Welcome to Tesla Marketplace!');
      
      setTimeout(() => router?.push('/tesla-marketplace-home'), 1000);
    } catch (error) {
      showNotification('Failed to create account. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setIsLoading(true);
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: `${provider}_${Date.now()}`,
        email: `user@${provider}.com`,
        name: `${provider?.charAt(0)?.toUpperCase() + provider?.slice(1)} User`,
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
        provider: provider,
        createdAt: new Date()?.toISOString()
      };
      
      localStorage.setItem('tesla_user', JSON.stringify(mockUser));
      showNotification(`Successfully signed in with ${provider?.charAt(0)?.toUpperCase() + provider?.slice(1)}!`);
      
      setTimeout(() => router?.push('/tesla-marketplace-home'), 1000);
    } catch (error) {
      showNotification(`Failed to sign in with ${provider}. Please try again.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email) => {
    setIsLoading(true);
    
    try {
      // Simulate password reset email
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('Password reset link sent to your email!');
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
          notification?.type === 'error' ?'bg-error text-error-foreground' :'bg-success text-success-foreground'
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
            {activeTab === 'signin' ?'Welcome back! Sign in to your account' :'Join the Tesla community today'
            }
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

        {/* Test Credentials Info */}
        <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center">
            <Icon name="Info" size={16} className="mr-2" />
            Test Credentials
          </h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div><strong>Admin:</strong> admin@teslamarketplace.com / Admin123!</div>
            <div><strong>User:</strong> user@teslamarketplace.com / User123!</div>
            <div><strong>Seller:</strong> seller@teslamarketplace.com / Seller123!</div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router?.push('/tesla-marketplace-home')}
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
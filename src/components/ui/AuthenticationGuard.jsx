import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  hasRole: () => false
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthenticationGuard');
  }
  return context;
};

const AuthenticationGuard = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Mock authentication - replace with actual auth service
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate auth check
        const savedUser = localStorage.getItem('tesla_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData) => {
    try {
      // Mock login - replace with actual auth service
      const mockUser = {
        id: '1',
        email: userData?.email,
        name: userData?.name || userData?.email?.split('@')?.[0],
        role: userData?.role || 'user',
        avatar: null,
        createdAt: new Date()?.toISOString()
      };
      
      setUser(mockUser);
      localStorage.setItem('tesla_user', JSON.stringify(mockUser));
      
      // Redirect to intended page or dashboard
      const redirectTo = sessionStorage.getItem('tesla_redirect_after_auth') || '/user-profile-dashboard';
      sessionStorage.removeItem('tesla_redirect_after_auth');
      navigate(redirectTo);
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error?.message };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('tesla_user');
      navigate('/tesla-marketplace-home');
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false, error: error?.message };
    }
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    if (requiredRole === 'admin') return user?.role === 'admin';
    return true; // All authenticated users have basic access
  };

  const requireAuth = (redirectPath = null) => {
    if (!user) {
      if (redirectPath) {
        sessionStorage.setItem('tesla_redirect_after_auth', redirectPath);
      }
      navigate('/authentication-portal');
      return false;
    }
    return true;
  };

  const requireRole = (requiredRole, redirectPath = '/tesla-marketplace-home') => {
    if (!user) {
      navigate('/authentication-portal');
      return false;
    }
    
    if (!hasRole(requiredRole)) {
      navigate(redirectPath);
      return false;
    }
    
    return true;
  };

  const contextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    requireAuth,
    requireRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Higher-order component for protecting routes
export const withAuth = (WrappedComponent, options = {}) => {
  const { requireRole: requiredRole, redirectTo = '/authentication-portal' } = options;
  
  const AuthenticatedComponent = (props) => {
    const { user, isLoading, hasRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          sessionStorage.setItem('tesla_redirect_after_auth', location?.pathname);
          navigate(redirectTo);
          return;
        }
        
        if (requiredRole && !hasRole(requiredRole)) {
          navigate('/tesla-marketplace-home');
          return;
        }
      }
    }, [user, isLoading, navigate, location]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    if (!user || (requiredRole && !hasRole(requiredRole))) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
  
  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return AuthenticatedComponent;
};

// Component for conditional rendering based on auth state
export const AuthGuard = ({ 
  children, 
  fallback = null, 
  requireRole = null, 
  inverse = false 
}) => {
  const { user, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return fallback;
  }

  const isAuthorized = user && (!requireRole || hasRole(requireRole));
  const shouldRender = inverse ? !isAuthorized : isAuthorized;

  return shouldRender ? children : fallback;
};

export default AuthenticationGuard;
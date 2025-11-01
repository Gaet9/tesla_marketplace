import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Separate async operations object
  const profileOperations = {
    async load(userId) {
      if (!userId) return;
      setProfileLoading(true);
      try {
        const { data, error } = await supabase
          ?.from('users')
          ?.select('*')
          ?.eq('id', userId)
          ?.single();
        if (!error) setUserProfile(data);
      } finally {
        setProfileLoading(false);
      }
    },
    
    async createProfile(authUser) {
      try {
        // Extract profile data from auth.user
        const profileData = {
          id: authUser?.id,
          email: authUser?.email || '',
          first_name: authUser?.user_metadata?.first_name || authUser?.user_metadata?.name?.split(' ')?.[0] || '',
          last_name: authUser?.user_metadata?.last_name || authUser?.user_metadata?.name?.split(' ')?.slice(1)?.join(' ') || '',
          avatar_url: authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture || '',
          role: 'user'
        };

        const { data, error } = await supabase
          ?.from('users')
          ?.insert(profileData)
          ?.select('*')
          ?.single();
        
        if (!error) setUserProfile(data);
        return { success: !error, data, error };
      } catch (error) {
        return { success: false, error: error?.message };
      }
    },
    
    clear() {
      setUserProfile(null);
      setProfileLoading(false);
    }
  };

  // Protected auth handlers
  const authStateHandlers = {
    // CRITICAL: This MUST remain synchronous
    onChange: (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        // Fire-and-forget profile loading
        profileOperations?.load(session?.user?.id)?.then(() => {
          // If no profile exists, try to create one (for OAuth users)
          if (!userProfile) {
            profileOperations?.createProfile(session?.user);
          }
        });
      } else {
        profileOperations?.clear();
      }
    }
  };

  useEffect(() => {
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      authStateHandlers?.onChange(null, session);
    });

    // PROTECTED: Never modify this callback signature
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      authStateHandlers?.onChange
    );

    return () => subscription?.unsubscribe?.();
  }, []);

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });
      if (error) {
        return { success: false, error: error?.message };
      }
      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
        };
      }
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  const signUp = async (email, password, firstName, lastName) => {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      if (error) {
        return { success: false, error: error?.message };
      }
      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
        };
      }
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  const signInWithOAuth = async (provider) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window?.location?.origin}/tesla-marketplace-home`
        }
      });
      if (error) {
        return { success: false, error: error?.message };
      }
      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
        };
      }
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut();
      if (error) {
        return { success: false, error: error?.message };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signInWithOAuth,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
import { supabase } from '../lib/supabase';

// OAuth authentication
export const signInWithOAuth = async (provider, redirectTo = null) => {
  try {
    const { data, error } = await supabase?.auth?.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: redirectTo || `${window?.location?.origin}/tesla-marketplace-home`
      }
    });
    
    if (error) {
      return { success: false, error: error?.message };
    }
    
    return { success: true, data };
  } catch (error) {
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Cannot connect to authentication service. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
      };
    }
    
    return { success: false, error: 'OAuth authentication failed. Please try again.' };
  }
};

// Email/Password authentication
export const signInWithEmail = async (email, password) => {
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
        error?.message?.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Cannot connect to authentication service. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
      };
    }
    
    return { success: false, error: 'Authentication failed. Please try again.' };
  }
};

// Email registration
export const signUpWithEmail = async (email, password, firstName, lastName) => {
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
        error?.message?.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Cannot connect to authentication service. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
      };
    }
    
    return { success: false, error: 'Registration failed. Please try again.' };
  }
};

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase?.auth?.signOut();
    
    if (error) {
      return { success: false, error: error?.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Sign out failed. Please try again.' };
  }
};

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase?.auth?.getSession();
    
    if (error) {
      return { success: false, error: error?.message };
    }
    
    return { success: true, session };
  } catch (error) {
    return { success: false, error: 'Failed to get session. Please try again.' };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase?.auth?.getUser();
    
    if (error) {
      return { success: false, error: error?.message };
    }
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Failed to get user. Please try again.' };
  }
};

// Reset password
export const resetPassword = async (email, redirectTo = null) => {
  try {
    const { error } = await supabase?.auth?.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${window?.location?.origin}/reset-password`
    });
    
    if (error) {
      return { success: false, error: error?.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to send reset email. Please try again.' };
  }
};

// Update password
export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase?.auth?.updateUser({
      password: newPassword
    });
    
    if (error) {
      return { success: false, error: error?.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update password. Please try again.' };
  }
};

// Create or update user profile after OAuth
export const createUserProfile = async (user) => {
  try {
    const profileData = {
      id: user?.id,
      email: user?.email || '',
      first_name: user?.user_metadata?.first_name || user?.user_metadata?.name?.split(' ')?.[0] || '',
      last_name: user?.user_metadata?.last_name || user?.user_metadata?.name?.split(' ')?.slice(1)?.join(' ') || '',
      avatar_url: user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '',
      role: 'user'
    };

    // Try to insert, if exists then update
    const { data, error } = await supabase
      ?.from('users')
      ?.upsert(profileData, { onConflict: 'id' })
      ?.select('*')
      ?.single();
    
    if (error) {
      return { success: false, error: error?.message };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to create user profile. Please try again.' };
  }
};

// Check if user profile exists
export const checkUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      ?.from('users')
      ?.select('*')
      ?.eq('id', userId)
      ?.single();
    
    if (error && error?.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      return { success: false, error: error?.message };
    }
    
    return { success: true, exists: !!data, data };
  } catch (error) {
    return { success: false, error: 'Failed to check user profile. Please try again.' };
  }
};
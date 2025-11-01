import { supabase } from '../lib/supabase';

// Get user profile by ID
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      ?.from('users')
      ?.select('*')
      ?.eq('id', userId)
      ?.single();

    if (error) {
      return { success: false, error: error?.message };
    }

    return { success: true, data };
  } catch (error) {
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
      };
    }
    
    return { success: false, error: 'Failed to load user profile' };
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      ?.from('users')
      ?.update({
        first_name: updates?.first_name,
        last_name: updates?.last_name,
        bio: updates?.bio,
        avatar_url: updates?.avatar_url
      })
      ?.eq('id', userId)
      ?.select('*')
      ?.single();

    if (error) {
      return { success: false, error: error?.message };
    }

    return { success: true, data };
  } catch (error) {
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
      };
    }
    
    return { success: false, error: 'Failed to update profile' };
  }
};

// Get all users (admin functionality)
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      ?.from('users')
      ?.select('id, first_name, last_name, email, avatar_url, role, created_at')
      ?.order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error?.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
      };
    }
    
    return { success: false, error: 'Failed to load users' };
  }
};

// Update user role (admin functionality)
export const updateUserRole = async (userId, role) => {
  try {
    const { data, error } = await supabase
      ?.from('users')
      ?.update({ role })
      ?.eq('id', userId)
      ?.select('*')
      ?.single();

    if (error) {
      return { success: false, error: error?.message };
    }

    return { success: true, data };
  } catch (error) {
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
      };
    }
    
    return { success: false, error: 'Failed to update user role' };
  }
};

// Search users by name or email
export const searchUsers = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      ?.from('users')
      ?.select('id, first_name, last_name, email, avatar_url, role')
      ?.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      ?.order('first_name', { ascending: true });

    if (error) {
      return { success: false, error: error?.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
      };
    }
    
    return { success: false, error: 'Failed to search users' };
  }
};

// Check if user exists by email
export const checkUserExists = async (email) => {
  try {
    const { data, error } = await supabase
      ?.from('users')
      ?.select('id, email')
      ?.eq('email', email)
      ?.single();

    if (error && error?.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      return { success: false, error: error?.message };
    }

    return { success: true, exists: !!data, data };
  } catch (error) {
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
      };
    }
    
    return { success: false, error: 'Failed to check user existence' };
  }
};

// Get user statistics (for admin dashboard)
export const getUserStats = async () => {
  try {
    const { data, error } = await supabase
      ?.from('users')
      ?.select('role, created_at');

    if (error) {
      return { success: false, error: error?.message };
    }

    const stats = {
      totalUsers: data?.length || 0,
      adminUsers: data?.filter(user => user?.role === 'admin')?.length || 0,
      regularUsers: data?.filter(user => user?.role === 'user')?.length || 0,
      recentUsers: data?.filter(user => {
        const createdAt = new Date(user?.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo?.setDate(thirtyDaysAgo?.getDate() - 30);
        return createdAt >= thirtyDaysAgo;
      })?.length || 0
    };

    return { success: true, data: stats };
  } catch (error) {
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
      };
    }
    
    return { success: false, error: 'Failed to load user statistics' };
  }
};
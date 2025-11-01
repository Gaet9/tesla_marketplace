import { supabase } from '../lib/supabase';

// Create a new Tesla offer
export const createOffer = async (offerData) => {
  try {
    const { data, error } = await supabase
      ?.from('offers')
      ?.insert({
        brand: offerData?.brand,
        model: offerData?.model,
        year: offerData?.year,
        price: offerData?.price,
        mileage: offerData?.mileage,
        description: offerData?.description,
        location: offerData?.location,
        lat: offerData?.lat,
        long: offerData?.long,
        image_url: offerData?.image_url,
        user_id: offerData?.user_id
      })
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
    
    return { success: false, error: 'Failed to create offer' };
  }
};

// Get all offers with user details
export const getAllOffers = async () => {
  try {
    const { data, error } = await supabase
      ?.from('offers')
      ?.select(`
        *,
        user:users(
          id,
          first_name,
          last_name,
          email,
          avatar_url
        )
      `)
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
    
    return { success: false, error: 'Failed to load offers' };
  }
};

// Get offer by ID with user details
export const getOfferById = async (id) => {
  try {
    const { data, error } = await supabase
      ?.from('offers')
      ?.select(`
        *,
        user:users(
          id,
          first_name,
          last_name,
          email,
          avatar_url,
          bio
        )
      `)
      ?.eq('id', id)
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
    
    return { success: false, error: 'Failed to load offer details' };
  }
};

// Update offer by ID (only owner can update)
export const updateOffer = async (id, updates, userId) => {
  try {
    const { data, error } = await supabase
      ?.from('offers')
      ?.update({
        brand: updates?.brand,
        model: updates?.model,
        year: updates?.year,
        price: updates?.price,
        mileage: updates?.mileage,
        description: updates?.description,
        location: updates?.location,
        lat: updates?.lat,
        long: updates?.long,
        image_url: updates?.image_url,
        updated_at: new Date()?.toISOString()
      })
      ?.eq('id', id)
      ?.eq('user_id', userId)
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
    
    return { success: false, error: 'Failed to update offer' };
  }
};

// Delete offer by ID (only owner can delete)
export const deleteOffer = async (id, userId) => {
  try {
    const { error } = await supabase
      ?.from('offers')
      ?.delete()
      ?.eq('id', id)
      ?.eq('user_id', userId);

    if (error) {
      return { success: false, error: error?.message };
    }

    return { success: true };
  } catch (error) {
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
      };
    }
    
    return { success: false, error: 'Failed to delete offer' };
  }
};

// Get offers by user ID
export const getOffersByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      ?.from('offers')
      ?.select('*')
      ?.eq('user_id', userId)
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
    
    return { success: false, error: 'Failed to load user offers' };
  }
};

// Search offers by brand, model, location, or price range
export const searchOffers = async (filters = {}) => {
  try {
    let query = supabase?.from('offers')?.select(`
      *,
      user:users(
        id,
        first_name,
        last_name,
        email,
        avatar_url
      )
    `);

    if (filters?.brand) {
      query = query?.ilike('brand', `%${filters?.brand}%`);
    }

    if (filters?.model) {
      query = query?.ilike('model', `%${filters?.model}%`);
    }

    if (filters?.location) {
      query = query?.ilike('location', `%${filters?.location}%`);
    }

    if (filters?.minPrice) {
      query = query?.gte('price', filters?.minPrice);
    }

    if (filters?.maxPrice) {
      query = query?.lte('price', filters?.maxPrice);
    }

    if (filters?.minYear) {
      query = query?.gte('year', filters?.minYear);
    }

    if (filters?.maxYear) {
      query = query?.lte('year', filters?.maxYear);
    }

    const { data, error } = await query?.order('created_at', { ascending: false });

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
    
    return { success: false, error: 'Failed to search offers' };
  }
};
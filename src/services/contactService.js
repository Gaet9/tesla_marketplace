import { supabase } from '../lib/supabase';

// Send a contact message about an offer
export const sendContactMessage = async (messageData) => {
  try {
    const { data, error } = await supabase
      ?.from('contact')
      ?.insert({
        message: messageData?.message,
        sender_id: messageData?.sender_id,
        receiver_id: messageData?.receiver_id,
        offer_id: messageData?.offer_id
      })
      ?.select(`
        *,
        sender:users!sender_id(
          id,
          first_name,
          last_name,
          email,
          avatar_url
        ),
        receiver:users!receiver_id(
          id,
          first_name,
          last_name,
          email,
          avatar_url
        ),
        offer:offers(
          id,
          brand,
          model,
          year,
          price,
          location
        )
      `)
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
    
    return { success: false, error: 'Failed to send message' };
  }
};

// Get all messages for a specific user (both sent and received)
export const getUserMessages = async (userId) => {
  try {
    const { data, error } = await supabase
      ?.from('contact')
      ?.select(`
        *,
        sender:users!sender_id(
          id,
          first_name,
          last_name,
          email,
          avatar_url
        ),
        receiver:users!receiver_id(
          id,
          first_name,
          last_name,
          email,
          avatar_url
        ),
        offer:offers(
          id,
          brand,
          model,
          year,
          price,
          location,
          image_url
        )
      `)
      ?.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
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
    
    return { success: false, error: 'Failed to load messages' };
  }
};

// Get messages for a specific offer
export const getOfferMessages = async (offerId) => {
  try {
    const { data, error } = await supabase
      ?.from('contact')
      ?.select(`
        *,
        sender:users!sender_id(
          id,
          first_name,
          last_name,
          email,
          avatar_url
        ),
        receiver:users!receiver_id(
          id,
          first_name,
          last_name,
          email,
          avatar_url
        )
      `)
      ?.eq('offer_id', offerId)
      ?.order('created_at', { ascending: true });

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
    
    return { success: false, error: 'Failed to load offer messages' };
  }
};

// Get conversation between two users for a specific offer
export const getConversation = async (senderId, receiverId, offerId) => {
  try {
    const { data, error } = await supabase
      ?.from('contact')
      ?.select(`
        *,
        sender:users!sender_id(
          id,
          first_name,
          last_name,
          email,
          avatar_url
        ),
        receiver:users!receiver_id(
          id,
          first_name,
          last_name,
          email,
          avatar_url
        ),
        offer:offers(
          id,
          brand,
          model,
          year,
          price,
          location,
          image_url
        )
      `)
      ?.eq('offer_id', offerId)
      ?.or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      ?.order('created_at', { ascending: true });

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
    
    return { success: false, error: 'Failed to load conversation' };
  }
};

// Real-time subscription for new messages (for a specific user)
export const subscribeToUserMessages = (userId, callback) => {
  const channel = supabase
    ?.channel('user-messages')
    ?.on(
      'postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'contact',
        filter: `or(sender_id.eq.${userId},receiver_id.eq.${userId})`
      },
      callback
    )
    ?.subscribe();

  return channel;
};

// Real-time subscription for offer messages
export const subscribeToOfferMessages = (offerId, callback) => {
  const channel = supabase
    ?.channel('offer-messages')
    ?.on(
      'postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'contact',
        filter: `offer_id=eq.${offerId}`
      },
      callback
    )
    ?.subscribe();

  return channel;
};

// Unsubscribe from real-time channel
export const unsubscribeFromMessages = (channel) => {
  if (channel) {
    supabase?.removeChannel(channel);
  }
};
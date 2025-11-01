-- OAuth Authentication Setup Migration
-- Migration: 20251101142807_setup_oauth_authentication.sql
-- Description: Set up OAuth authentication support and update RLS policies

-- Step 1: Ensure auth.users trigger exists for profile creation
-- Create a function to handle new user registration (OAuth and email)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user profile when a new user signs up
  INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    avatar_url,
    role
  ) VALUES (
    NEW.id,
    COALESCE(NEW.email, 'NOT NULL'::text),
    COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'name', 'NOT NULL'::text),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '', 'NOT NULL'::text),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''::text),
    'user'::role
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, users.last_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS Policies for users table
-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Allow public read access for basic user info (for offers display)
CREATE POLICY "Public users basic info" ON public.users
  FOR SELECT USING (true);

-- Allow system to insert user profiles
CREATE POLICY "Enable insert for authenticated users only" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 5: RLS Policies for offers table
-- Users can view all offers
CREATE POLICY "Anyone can view offers" ON public.offers
  FOR SELECT USING (true);

-- Users can insert their own offers
CREATE POLICY "Users can insert own offers" ON public.offers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own offers
CREATE POLICY "Users can update own offers" ON public.offers
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own offers
CREATE POLICY "Users can delete own offers" ON public.offers
  FOR DELETE USING (auth.uid() = user_id);

-- Step 6: RLS Policies for contact table
-- Users can view messages they sent or received
CREATE POLICY "Users can view own messages" ON public.contact
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send messages
CREATE POLICY "Users can send messages" ON public.contact
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Users can update messages they sent (for editing)
CREATE POLICY "Users can update own sent messages" ON public.contact
  FOR UPDATE USING (auth.uid() = sender_id);

-- Step 7: Create helper functions for OAuth integration

-- Function to get user profile with safe defaults
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id UUID)
RETURNS TABLE(
  id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role role,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.avatar_url,
    u.bio,
    u.role,
    u.created_at
  FROM public.users u
  WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create or update user profile (for OAuth)
CREATE OR REPLACE FUNCTION public.upsert_user_profile(
  user_id UUID,
  user_email TEXT DEFAULT NULL,
  user_first_name TEXT DEFAULT NULL,
  user_last_name TEXT DEFAULT NULL,
  user_avatar_url TEXT DEFAULT NULL
)
RETURNS public.users AS $$
DECLARE
  result public.users;
BEGIN
  INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    avatar_url,
    role
  ) VALUES (
    user_id,
    COALESCE(user_email, 'NOT NULL'::text),
    COALESCE(user_first_name, 'NOT NULL'::text),
    COALESCE(user_last_name, 'NOT NULL'::text),
    COALESCE(user_avatar_url, ''::text),
    'user'::role
  ) ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, users.email),
    first_name = COALESCE(EXCLUDED.first_name, users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, users.last_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url)
  RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.offers TO anon, authenticated;
GRANT ALL ON public.contact TO anon, authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_profile(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_user_profile(UUID, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- Step 9: Insert sample data for testing OAuth integration
-- This data will be useful for testing the application
INSERT INTO public.users (
  id,
  email,
  first_name,
  last_name,
  avatar_url,
  bio,
  role
) VALUES
  (
    '00000000-0000-0000-0000-000000000001'::UUID,
    'admin@teslamarketplace.com',
    'Admin',
    'User',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    'Tesla Marketplace Administrator',
    'admin'::role
  ),
  (
    '00000000-0000-0000-0000-000000000002'::UUID,
    'demo@teslamarketplace.com',
    'Demo',
    'User',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    'Demo user for Tesla Marketplace',
    'user'::role
  )
ON CONFLICT (id) DO NOTHING;

-- Sample offers for testing
INSERT INTO public.offers (
  id,
  user_id,
  brand,
  model,
  year,
  price,
  mileage,
  description,
  location,
  lat,
  long,
  image_url,
  status
) VALUES
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000002'::UUID,
    'Tesla',
    'Model 3',
    2022,
    45000,
    15000,
    'Excellent condition Tesla Model 3 with autopilot features and premium interior.',
    'San Francisco, CA',
    37.7749,
    -122.4194,
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'available'::"offer-status"
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000002'::UUID,
    'Tesla',
    'Model Y',
    2023,
    62000,
    8000,
    'Like new Tesla Model Y Performance with enhanced autopilot and premium connectivity.',
    'Los Angeles, CA',
    34.0522,
    -118.2437,
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'available'::"offer-status"
  )
ON CONFLICT DO NOTHING;

-- Add helpful comments
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates user profile when new user signs up via OAuth or email';
COMMENT ON FUNCTION public.get_user_profile(UUID) IS 'Safely retrieves user profile with proper RLS enforcement';
COMMENT ON FUNCTION public.upsert_user_profile(UUID, TEXT, TEXT, TEXT, TEXT) IS 'Creates or updates user profile for OAuth users';
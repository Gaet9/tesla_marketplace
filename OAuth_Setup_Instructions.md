# OAuth Setup Instructions for Tesla Marketplace

This guide will help you set up Google and Facebook OAuth authentication for your Tesla Marketplace application using Supabase.

## 🚀 Quick Setup Overview

1. **Run the Migration** - Apply the OAuth authentication database setup
2. **Configure Supabase Providers** - Enable Google and Facebook in Supabase Dashboard
3. **Set up Provider Apps** - Create apps in Google Console and Facebook Developers
4. **Configure Redirect URLs** - Set up proper redirect URLs for your domain

## 📋 Step 1: Run Database Migration

Execute the migration file to set up OAuth support:

```sql
-- Run this in your Supabase SQL Editor
-- File: migrations/20251101142807_setup_oauth_authentication.sql
```

This migration will:
- ✅ Set up automatic user profile creation for OAuth users
- ✅ Configure Row Level Security (RLS) policies
- ✅ Create helper functions for OAuth integration
- ✅ Insert sample test data

## 🔧 Step 2: Configure Supabase Authentication Providers

### Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Tesla Marketplace project
3. Navigate to **Authentication** → **Providers**

### Enable Google Provider
1. Find **Google** in the provider list
2. Toggle **Enable sign in with Google** to ON
3. You'll need to add credentials from Google Console (Step 3)

### Enable Facebook Provider  
1. Find **Facebook** in the provider list
2. Toggle **Enable sign in with Facebook** to ON
3. You'll need to add credentials from Facebook Developers (Step 4)

## 🔑 Step 3: Google OAuth Setup

### Create Google OAuth Application
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application** as application type

### Configure Google OAuth
```
Application Name: Tesla Marketplace
Authorized JavaScript origins:
  - http://localhost:5173 (for development)
  - https://your-domain.com (for production)
  
Authorized redirect URIs:
  - https://your-project-ref.supabase.co/auth/v1/callback
  - http://localhost:5173 (for development)
```

### Add Credentials to Supabase
1. Copy the **Client ID** and **Client Secret** from Google Console
2. In Supabase Dashboard → Authentication → Providers → Google:
   - Paste **Client ID** 
   - Paste **Client Secret**
3. Click **Save**

## 📘 Step 4: Facebook OAuth Setup

### Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **Create App**
3. Choose **Consumer** as app type
4. Add **Facebook Login** product to your app

### Configure Facebook Login
```
App Name: Tesla Marketplace
App Domain: your-domain.com
Privacy Policy URL: https://your-domain.com/privacy
Terms of Service URL: https://your-domain.com/terms

Valid OAuth Redirect URIs:
  - https://your-project-ref.supabase.co/auth/v1/callback
  - http://localhost:5173 (for development)
```

### Add Credentials to Supabase
1. Copy **App ID** and **App Secret** from Facebook App Dashboard
2. In Supabase Dashboard → Authentication → Providers → Facebook:
   - Paste **Client ID** (App ID)
   - Paste **Client Secret** (App Secret)
3. Click **Save**

## 🌐 Step 5: Configure Redirect URLs

### Update Environment Variables
```env
# Add to your .env file
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# OAuth redirect URLs (optional, handled automatically)
VITE_OAUTH_REDIRECT_URL=https://your-domain.com/tesla-marketplace-home
```

### Supabase Site URL Configuration
1. In Supabase Dashboard → Authentication → Settings
2. Update **Site URL** to your production domain
3. Add **Redirect URLs**:
   ```
   http://localhost:5173/**
   https://your-domain.com/**
   ```

## 🧪 Step 6: Test OAuth Integration

### Development Testing
1. Start your development server: `npm run dev`
2. Navigate to authentication page
3. Click **Continue with Google** or **Continue with Facebook**
4. Complete OAuth flow
5. Verify user profile is created in `users` table

### Verify Database Integration
```sql
-- Check if OAuth users are being created properly
SELECT id, email, first_name, last_name, avatar_url, role, created_at 
FROM public.users 
ORDER BY created_at DESC;
```

## 🛡️ Security Configuration

### RLS Policies Enabled
The migration automatically enables these security policies:
- ✅ Users can only view/edit their own profile
- ✅ Public access to basic user info for offers
- ✅ Users can only manage their own offers
- ✅ Users can only view messages they sent/received

### Additional Security
1. **Enable email confirmations** in Supabase → Authentication → Settings
2. **Set up rate limiting** to prevent abuse
3. **Configure CAPTCHA** for additional protection (optional)

## 🚨 Troubleshooting

### Common Issues

**OAuth redirect not working:**
- Verify redirect URLs match exactly in both provider and Supabase
- Check that Site URL is set correctly in Supabase settings
- Ensure your domain is served over HTTPS in production

**User profile not created:**
- Check that migration was run successfully
- Verify trigger `on_auth_user_created` exists and is enabled
- Check Supabase logs for any errors during profile creation

**Provider not appearing:**
- Ensure provider is enabled in Supabase Dashboard
- Verify client ID and secret are correct
- Check that provider app is in production mode (not development)

### Debug OAuth Flow
```javascript
// Add this to your browser console to debug OAuth
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event)
  console.log('Session:', session)
  if (session?.user) {
    console.log('User metadata:', session.user.user_metadata)
  }
})
```

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)

## ✅ Final Checklist

- [ ] Migration applied successfully
- [ ] Google OAuth configured and enabled
- [ ] Facebook OAuth configured and enabled  
- [ ] Redirect URLs properly set up
- [ ] Environment variables updated
- [ ] OAuth flow tested in development
- [ ] User profiles being created automatically
- [ ] RLS policies working correctly
- [ ] Ready for production deployment

---

🎉 **Congratulations!** Your Tesla Marketplace now supports secure OAuth authentication with Google and Facebook.
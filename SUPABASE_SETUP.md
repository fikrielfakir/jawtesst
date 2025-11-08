# Supabase Setup Guide for OTP Password Reset

This guide explains how to set up the database and functions required for the OTP-based password reset system.

## Prerequisites

1. A Supabase project
2. Supabase URL and Anon Key configured in your environment

## Step 1: Create the Password Reset OTP Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create the password_reset_otps table
CREATE TABLE IF NOT EXISTS public.password_reset_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_password_reset_otps_email ON public.password_reset_otps(email);
CREATE INDEX idx_password_reset_otps_otp ON public.password_reset_otps(otp);
CREATE INDEX idx_password_reset_otps_expires_at ON public.password_reset_otps(expires_at);

-- Enable Row Level Security
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: NO public policies! This table should ONLY be accessed via
-- secure backend functions or service-role authenticated connections.
-- All policies deny public access for security.
```

## Step 2: Create Helper Functions

Run these SQL functions in your Supabase SQL Editor:

```sql
-- Function to get user ID by email
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email TEXT)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = user_email LIMIT 1;
  RETURN user_id;
END;
$$;
```

**Note**: The password update is now handled by the backend using Supabase's admin API (`admin.updateUserById`), so we don't need a separate database function for that.

## Step 3: Set Up Environment Variables

Create a `.env` file in your project root with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Step 4: Restart the Development Server

After setting up the environment variables, restart your development server:

```bash
npm run web
```

## How the OTP Flow Works

1. **User requests password reset**: Enters email on forgot password screen
2. **System generates OTP**: 6-digit code is generated and stored in database
3. **User sees OTP**: For testing, OTP is shown in alert (in production, send via email)
4. **User enters OTP**: Validates against database and marks as used
5. **User sets new password**: Calls `reset_user_password` function to update password securely
6. **OTP is deleted**: All OTPs for the email are removed to prevent reuse

## Security Features

- ✅ OTP expires after 10 minutes
- ✅ OTP can only be used once (marked as `is_used`)
- ✅ Password update uses database function with SECURITY DEFINER
- ✅ All OTPs deleted after successful password reset
- ✅ Expiration checked before password update

## Testing Without Email

For development and testing, the OTP is displayed in an alert dialog. In production, you would integrate an email service like:

- SendGrid
- AWS SES
- Resend
- Postmark

Replace the alert with your email sending logic in `src/services/auth/auth.service.ts`.

## Troubleshooting

### "Failed to generate verification code"
- Check that the `password_reset_otps` table exists in Supabase
- Verify RLS policies are set correctly
- Check Supabase connection credentials

### "Failed to update password"
- Ensure `reset_user_password` function is created in Supabase
- Check that the function has SECURITY DEFINER permission
- Verify the user exists in auth.users table

### "Invalid or expired verification code"
- OTP expires after 10 minutes
- Check system time is synchronized
- Ensure OTP hasn't been used already

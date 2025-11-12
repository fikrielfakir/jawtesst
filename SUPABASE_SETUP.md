# Supabase Setup Guide for 6-Digit OTP Password Reset

This guide explains how to configure Supabase's built-in password recovery system to send 6-digit OTP codes via email.

## Prerequisites

1. A Supabase project
2. Supabase URL and Anon Key configured in your environment
3. Access to Supabase Dashboard

## Step 1: Configure Email Template

The most important step is configuring Supabase's password recovery email template to display the 6-digit OTP code.

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Email Templates**
3. Select **Reset Password** (or **Password Recovery**)
4. Update the email template to include the `{{ .Token }}` placeholder

### Example Email Template

Replace the default template with something like this:

```html
<h2>Reset Your Password</h2>
<p>Hi there,</p>
<p>You requested to reset your password. Use the verification code below:</p>

<div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; text-align: center; background: #f4f4f4; padding: 20px; border-radius: 8px;">
  {{ .Token }}
</div>

<p><strong>This code will expire in 60 minutes.</strong></p>
<p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>

<p>Thanks,<br>Your App Team</p>
```

**Important**: The `{{ .Token }}` placeholder is what displays the 6-digit code.

## Step 2: Set Up Environment Variables

Create a `.env` file in your project root with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Step 3: Restart the Development Server

After setting up the environment variables and email template, restart your development server:

```bash
npm run web
```

## How the Password Reset Flow Works

This implementation uses **Supabase's built-in password recovery system**:

1. **User requests password reset** → `forgot-password.tsx`
   - User enters their email address
   - Calls `authService.resetPassword(email)` 
   - Triggers `supabase.auth.resetPasswordForEmail(email)`

2. **Supabase sends email with 6-digit code**
   - Supabase generates a 6-digit OTP token
   - Email template displays the code using `{{ .Token }}`
   - Code expires in 60 minutes

3. **User enters OTP** → `verify-otp.tsx`
   - User inputs the 6-digit code from email
   - Calls `authService.verifyResetOtp(email, otp)`
   - Triggers `supabase.auth.verifyOtp({ email, token, type: 'recovery' })`

4. **User sets new password** → `enter-new-password.tsx`
   - After OTP verification, user enters new password
   - Calls `authService.resetPasswordWithOtp(email, otp, newPassword)`
   - First verifies OTP again, then calls `supabase.auth.updateUser({ password })`

5. **Password updated successfully**
   - User can now sign in with the new password
   - All sessions are revoked for security

## Security Features

- ✅ OTP expires after 60 minutes (Supabase default)
- ✅ OTP can only be used once (handled by Supabase)
- ✅ Rate limiting on password reset requests (Supabase enforced)
- ✅ Secure password updates via Supabase Auth API
- ✅ All previous sessions revoked after password change

## No Custom Database Tables Required

Unlike custom OTP implementations, this approach uses **Supabase's built-in authentication system**, so:
- ❌ No custom database tables needed
- ❌ No custom SQL functions required
- ✅ Only email template configuration needed
- ✅ Supabase handles all OTP generation, storage, and validation

## Troubleshooting

### Code not appearing in email
- **Verify email template configuration**: Make sure `{{ .Token }}` is in the template
- **Check Supabase email logs**: Go to Authentication → Logs in Supabase Dashboard
- **Verify SMTP settings**: Ensure Supabase email service is properly configured
- **Check spam folder**: The email might be filtered as spam

### "Invalid verification code" error
- **Code expired**: Codes expire after 60 minutes - request a new one
- **Wrong code**: Double-check you entered all 6 digits correctly
- **Multiple requests**: If you requested multiple codes, use the most recent one
- **Email mismatch**: Ensure the email matches exactly (case-sensitive)

### "Failed to send verification code"
- **Email doesn't exist**: User must be registered in the system
- **Rate limiting**: Supabase enforces rate limits - wait before retrying
- **Connection issues**: Check your internet connection and Supabase status

### Rate Limiting
- Supabase enforces rate limits on password reset requests
- Users can resend code after 60 seconds in the app
- If hitting rate limits frequently, consider implementing additional client-side throttling

## Testing the Flow

1. Navigate to the Forgot Password screen
2. Enter a valid email address (user must exist in your auth.users)
3. Check your email for the 6-digit code
4. Enter the code on the verification screen
5. Set your new password (minimum 8 characters)
6. Sign in with the new password

## Production Considerations

Before deploying to production:

1. ✅ **Email template configured** with branded design and `{{ .Token }}`
2. ✅ **SMTP properly configured** in Supabase (or use Supabase's default email service)
3. ✅ **Test the full flow** with real email addresses
4. ✅ **Monitor rate limits** and adjust as needed
5. ✅ **Consider adding analytics** to track password reset funnel

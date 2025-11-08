# Backend API Setup for Secure OTP Password Reset

## Security Architecture

The OTP password reset system uses a secure backend API to handle all sensitive operations. This prevents clients from accessing, modifying, or harvesting OTP codes.

## Environment Variables

Add these to your `.env` file:

```env
# Supabase credentials
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# API Configuration
API_PORT=3000
```

**IMPORTANT**: Never expose the `SUPABASE_SERVICE_ROLE_KEY` to the client. Only use it in backend code.

## Backend API Endpoints

The Express server in `server/index.ts` should implement these secure endpoints:

### 1. POST /api/auth/request-password-reset

Generates and stores OTP for password reset.

```typescript
// Request body
{
  "email": "user@example.com"
}

// Response
{
  "success": true,
  "otp": "123456",  // Only for development/testing
  "message": "Verification code generated"
}
```

### 2. POST /api/auth/verify-reset-otp

Validates OTP and marks it as used.

```typescript
// Request body
{
  "email": "user@example.com",
  "otp": "123456"
}

// Response
{
  "success": true,
  "message": "Verification code verified successfully"
}
```

### 3. POST /api/auth/reset-password-with-otp

Completes password reset after OTP verification.

```typescript
// Request body
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}

// Response
{
  "success": true,
  "message": "Password updated successfully!"
}
```

## Implementation Guide

### Step 1: Install Supabase Admin Client

```bash
npm install @supabase/supabase-js
```

### Step 2: Create Supabase Service Client

Create `server/supabaseAdmin.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create admin client with service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

### Step 3: Create Password Reset API Routes

Create `server/routes/password-reset.ts`:

```typescript
import { Router } from 'express';
import { supabaseAdmin } from '../supabaseAdmin';

const router = Router();

// Generate OTP
router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;
  
  // Validate email
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  
  // Store OTP using service role (bypasses RLS)
  const { error } = await supabaseAdmin
    .from('password_reset_otps')
    .insert({
      email,
      otp,
      expires_at: expiresAt.toISOString(),
      is_used: false
    });
    
  if (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate OTP' });
  }
  
  // TODO: Send OTP via email service
  // For development, return OTP in response
  return res.json({ 
    success: true, 
    otp, // Remove in production
    message: 'Verification code generated'
  });
});

// Verify OTP
router.post('/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  // Fetch valid OTP
  const { data, error } = await supabaseAdmin
    .from('password_reset_otps')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .eq('is_used', false)
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  if (error || !data) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid or expired verification code' 
    });
  }
  
  // Mark as used
  await supabaseAdmin
    .from('password_reset_otps')
    .update({ is_used: true })
    .eq('id', data.id);
    
  return res.json({ success: true, message: 'Verification code verified' });
});

// Reset password
router.post('/reset-password-with-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  // Re-verify OTP
  const { data: otpData } = await supabaseAdmin
    .from('password_reset_otps')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .eq('is_used', true)
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  if (!otpData) {
    return res.status(400).json({ success: false, message: 'Invalid session' });
  }
  
  // Get user by email
  const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
  const user = users?.find(u => u.email === email);
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  // Update password using admin API
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { password: newPassword }
  );
  
  if (updateError) {
    return res.status(500).json({ success: false, message: 'Failed to update password' });
  }
  
  // Delete all OTPs for this email
  await supabaseAdmin
    .from('password_reset_otps')
    .delete()
    .eq('email', email);
    
  return res.json({ success: true, message: 'Password updated successfully!' });
});

export { router as passwordResetRouter };
```

### Step 4: Add Routes to Main Server

Update `server/index.ts`:

```typescript
import { passwordResetRouter } from './routes/password-reset';

app.use('/api/auth', passwordResetRouter);
```

## Security Features

- ✅ OTP table has NO public access (RLS denies all)
- ✅ All operations use service-role key
- ✅ OTPs cannot be enumerated or harvested by clients
- ✅ Password updates use Supabase Admin API
- ✅ OTPs deleted after successful reset
- ✅ Expiration checked on every operation

## Client-Side Updates

Update `src/services/auth/auth.service.ts` to call the backend API instead of accessing Supabase directly:

```typescript
async resetPassword(email: string) {
  const response = await fetch(`${API_URL}/api/auth/request-password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
}
```

## Production Checklist

- [ ] Remove OTP from API responses
- [ ] Integrate email service (SendGrid, SES, Resend)
- [ ] Set up rate limiting
- [ ] Add request logging
- [ ] Use HTTPS only
- [ ] Implement CORS properly
- [ ] Add environment-specific configs

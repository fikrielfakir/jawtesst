import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabaseAdmin';

const router = Router();

router.post('/request-password-reset', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    const { error } = await supabaseAdmin
      .from('password_reset_otps')
      .insert({
        email,
        otp,
        expires_at: expiresAt.toISOString(),
        is_used: false
      });
      
    if (error) {
      console.error('OTP storage error:', error);
      return res.status(500).json({ success: false, message: 'Failed to generate OTP' });
    }
    
    console.log('🔐 Password Reset OTP for', email, ':', otp);
    console.log('⏰ Expires at:', expiresAt);
    
    return res.json({ 
      success: true, 
      otp,
      message: 'Verification code generated successfully'
    });
  } catch (error: any) {
    console.error('Request password reset error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/verify-reset-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }
    
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
    
    await supabaseAdmin
      .from('password_reset_otps')
      .update({ is_used: true })
      .eq('id', data.id);
      
    return res.json({ success: true, message: 'Verification code verified successfully' });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/reset-password-with-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }
    
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
      return res.status(400).json({ success: false, message: 'Invalid or expired session' });
    }
    
    // Look up user by email using RPC function
    // This function must be created in Supabase (see SUPABASE_SETUP.md)
    const { data: userData, error: userError } = await supabaseAdmin.rpc('get_user_id_by_email', {
      user_email: email
    });
    
    if (userError || !userData) {
      console.error('User lookup error:', userError);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const userId = userData;
    
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );
    
    if (updateError) {
      console.error('Password update error:', updateError);
      return res.status(500).json({ success: false, message: 'Failed to update password' });
    }
    
    await supabaseAdmin
      .from('password_reset_otps')
      .delete()
      .eq('email', email);
      
    console.log('✅ Password updated successfully for:', email);
    
    return res.json({ success: true, message: 'Password updated successfully!' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export { router as passwordResetRouter };

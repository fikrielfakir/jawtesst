import { Router, Request, Response } from 'express';
import { db } from '../db';
import { passwordResetOtps, users } from '@shared/schema';
import { eq, and, gte, desc } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

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
    
    await db.insert(passwordResetOtps).values({
      email,
      otp,
      expiresAt,
      isUsed: false
    });
    
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
    
    const [otpRecord] = await db
      .select()
      .from(passwordResetOtps)
      .where(
        and(
          eq(passwordResetOtps.email, email),
          eq(passwordResetOtps.otp, otp),
          eq(passwordResetOtps.isUsed, false),
          gte(passwordResetOtps.expiresAt, new Date())
        )
      )
      .orderBy(desc(passwordResetOtps.createdAt))
      .limit(1);
      
    if (!otpRecord) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired verification code' 
      });
    }
    
    // Mark OTP as used
    await db
      .update(passwordResetOtps)
      .set({ isUsed: true })
      .where(eq(passwordResetOtps.id, otpRecord.id));
    
    console.log('✅ OTP verified and marked as used for:', email);
      
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
    
    const [otpRecord] = await db
      .select()
      .from(passwordResetOtps)
      .where(
        and(
          eq(passwordResetOtps.email, email),
          eq(passwordResetOtps.otp, otp),
          eq(passwordResetOtps.isUsed, true),
          gte(passwordResetOtps.expiresAt, new Date())
        )
      )
      .orderBy(desc(passwordResetOtps.createdAt))
      .limit(1);
      
    if (!otpRecord) {
      console.error('OTP verification check failed');
      return res.status(400).json({ success: false, message: 'Invalid or expired session' });
    }
    
    console.log('✅ OTP session verified for password reset:', email);
    
    // Look up user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (!user) {
      console.error('User not found:', email);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user's password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, user.id));
    
    // Delete used OTP
    await db
      .delete(passwordResetOtps)
      .where(eq(passwordResetOtps.email, email));
      
    console.log('✅ Password updated successfully for:', email);
    
    return res.json({ success: true, message: 'Password updated successfully!' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export { router as passwordResetRouter };

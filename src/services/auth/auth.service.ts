import { supabase } from '@/lib/supabaseClient';
import { AuthError } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  userType: 'customer' | 'owner' | 'admin';
  phone: string | null;
  profileImage: string | null;
  isVerified: boolean;
}

interface SignUpOptions {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType?: 'customer' | 'owner';
  phone?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

class AuthService {
  /**
   * Sign up a new user
   */
  async signUp(options: SignUpOptions): Promise<AuthResponse> {
    try {
      const { email, password, firstName, lastName, userType = 'customer', phone } = options;

      // Validate inputs
      if (!email || !password || !firstName || !lastName) {
        return {
          success: false,
          message: 'Please fill in all required fields',
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address',
        };
      }

      // Validate password length
      if (password.length < 8) {
        return {
          success: false,
          message: 'Password must be at least 8 characters long',
        };
      }

      // Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) {
        // Handle specific Supabase errors
        if (signUpError.message.includes('already registered')) {
          return {
            success: false,
            message: 'This email is already registered. Please sign in instead.',
          };
        }
        return {
          success: false,
          message: signUpError.message || 'Failed to create account',
        };
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Failed to create account. Please try again.',
        };
      }

      // Create user profile in public.users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          user_type: userType,
          is_verified: false,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return {
          success: false,
          message: 'Account created but failed to create profile. Please contact support.',
        };
      }

      const user: User = {
        id: authData.user.id,
        email: authData.user.email!,
        firstName,
        lastName,
        userType,
        phone: phone || null,
        profileImage: null,
        isVerified: false,
      };

      return {
        success: true,
        message: 'Account created successfully! Please check your email to verify your account.',
        user,
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: error.message || 'An unexpected error occurred. Please try again.',
      };
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      // Validate inputs
      if (!email || !password) {
        return {
          success: false,
          message: 'Please enter your email and password',
        };
      }

      // Sign in with Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Handle specific Supabase errors
        if (signInError.message.includes('Invalid login credentials')) {
          return {
            success: false,
            message: 'Invalid email or password. Please try again.',
          };
        }
        if (signInError.message.includes('Email not confirmed')) {
          return {
            success: false,
            message: 'Please verify your email before signing in.',
          };
        }
        return {
          success: false,
          message: signInError.message || 'Failed to sign in',
        };
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Failed to sign in. Please try again.',
        };
      }

      // Fetch user profile from public.users table
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profileData) {
        console.error('Profile fetch error:', profileError);
        return {
          success: false,
          message: 'Account found but failed to load profile. Please try again.',
        };
      }

      const user: User = {
        id: authData.user.id,
        email: authData.user.email!,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        userType: profileData.user_type,
        phone: profileData.phone,
        profileImage: profileData.profile_image,
        isVerified: profileData.is_verified,
      };

      return {
        success: true,
        message: 'Signed in successfully!',
        user,
      };
    } catch (error: any) {
      console.error('Signin error:', error);
      return {
        success: false,
        message: error.message || 'An unexpected error occurred. Please try again.',
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return {
          success: false,
          message: error.message || 'Failed to sign out',
        };
      }

      return {
        success: true,
        message: 'Signed out successfully',
      };
    } catch (error: any) {
      console.error('Signout error:', error);
      return {
        success: false,
        message: error.message || 'Failed to sign out',
      };
    }
  }

  /**
   * Request password reset via 6-digit OTP sent to email
   * 
   * IMPORTANT: This requires Supabase email template configuration.
   * In your Supabase dashboard, go to Authentication → Email Templates → Password Recovery
   * and ensure the template includes {{ .Token }} to display the 6-digit code.
   */
  async resetPassword(email: string): Promise<AuthResponse & { otp?: string }> {
    try {
      if (!email) {
        return {
          success: false,
          message: 'Please enter your email address',
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address',
        };
      }

      // Use Supabase's password recovery flow which sends a 6-digit OTP
      // The email template should be configured to show the token
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: undefined,
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Failed to send verification code',
        };
      }

      return {
        success: true,
        message: 'A 6-digit verification code has been sent to your email',
      };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send verification code',
      };
    }
  }

  /**
   * Verify password reset OTP (for Supabase auth flow)
   */
  async verifyResetOtp(email: string, otp: string): Promise<AuthResponse> {
    try {
      // Use Supabase's verifyOtp for email OTP
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery',
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Invalid or expired verification code',
        };
      }

      return {
        success: true,
        message: 'Verification successful',
      };
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify code',
      };
    }
  }

  /**
   * Reset password with OTP verification
   * NOTE: The OTP should already be verified before calling this method.
   * This method updates the password using the established recovery session.
   */
  async resetPasswordWithOtp(email: string, otp: string, newPassword: string): Promise<AuthResponse> {
    try {
      if (newPassword.length < 8) {
        return {
          success: false,
          message: 'Password must be at least 8 characters long',
        };
      }

      // The OTP was already verified in verify-otp.tsx, which established a recovery session.
      // We don't need to verify it again (it would fail since OTPs are single-use).
      // Just update the password using the recovery session.
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        return {
          success: false,
          message: updateError.message || 'Failed to update password',
        };
      }

      return {
        success: true,
        message: 'Password updated successfully!',
      };
    } catch (error: any) {
      console.error('Reset password with OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to reset password',
      };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      if (!newPassword) {
        return {
          success: false,
          message: 'Please enter a new password',
        };
      }

      if (newPassword.length < 8) {
        return {
          success: false,
          message: 'Password must be at least 8 characters long',
        };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Failed to update password',
        };
      }

      return {
        success: true,
        message: 'Password updated successfully!',
      };
    } catch (error: any) {
      console.error('Update password error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update password',
      };
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Get current user
   */
  async getUser(): Promise<User | null> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        return null;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profileData) {
        return null;
      }

      const user: User = {
        id: session.user.id,
        email: session.user.email!,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        userType: profileData.user_type,
        phone: profileData.phone,
        profileImage: profileData.profile_image,
        isVerified: profileData.is_verified,
      };

      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
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

      console.log('🔵 Starting sign up process...');
      console.log('Email:', email);
      console.log('User Type:', userType);

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

      console.log('✅ Validation passed, calling Supabase...');

      // Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      console.log('📡 Supabase auth response received');

      if (signUpError) {
        console.error('❌ Sign up error:', signUpError);
        
        // Handle specific Supabase errors
        if (signUpError.message.includes('already registered')) {
          return {
            success: false,
            message: 'This email is already registered. Please sign in instead.',
          };
        }
        
        if (signUpError.message.includes('Unable to validate email')) {
          return {
            success: false,
            message: 'Invalid email address format.',
          };
        }

        if (signUpError.message.includes('Password should be')) {
          return {
            success: false,
            message: 'Password does not meet requirements.',
          };
        }

        return {
          success: false,
          message: signUpError.message || 'Failed to create account',
        };
      }

      if (!authData.user) {
        console.error('❌ No user data returned from Supabase');
        return {
          success: false,
          message: 'Failed to create account. Please try again.',
        };
      }

      console.log('✅ Auth user created:', authData.user.id);
      console.log('🔵 Creating user profile...');

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
        console.error('❌ Profile creation error:', profileError);
        
        // Check if it's a duplicate key error (user already exists)
        if (profileError.code === '23505') {
          console.log('⚠️ User profile already exists, continuing...');
        } else {
          return {
            success: false,
            message: 'Account created but failed to create profile. Please contact support.',
          };
        }
      } else {
        console.log('✅ User profile created successfully');
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

      console.log('🎉 Sign up successful!');

      return {
        success: true,
        message: 'Account created successfully! Please check your email to verify your account.',
        user,
      };
    } catch (error: any) {
      console.error('❌ Unexpected signup error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Handle network errors
      if (error.message?.includes('Network request failed') || error.message?.includes('fetch')) {
        return {
          success: false,
          message: 'Network connection failed. Please check your internet connection and try again.',
        };
      }
      
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
      console.log('🔵 Starting sign in process...');
      console.log('Email:', email);

      // Validate inputs
      if (!email || !password) {
        return {
          success: false,
          message: 'Please enter your email and password',
        };
      }

      // Sign in with Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      console.log('📡 Supabase sign in response received');

      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        
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

      console.log('✅ Auth successful, fetching profile...');

      // Fetch user profile from public.users table
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profileData) {
        console.error('❌ Profile fetch error:', profileError);
        return {
          success: false,
          message: 'Account found but failed to load profile. Please try again.',
        };
      }

      console.log('✅ Profile loaded successfully');

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

      console.log('🎉 Sign in successful!');

      return {
        success: true,
        message: 'Signed in successfully!',
        user,
      };
    } catch (error: any) {
      console.error('❌ Unexpected signin error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Handle network errors
      if (error.message?.includes('Network request failed') || error.message?.includes('fetch')) {
        return {
          success: false,
          message: 'Network connection failed. Please check your internet connection and try again.',
        };
      }
      
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
      console.log('🔵 Signing out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
        return {
          success: false,
          message: error.message || 'Failed to sign out',
        };
      }

      console.log('✅ Signed out successfully');
      return {
        success: true,
        message: 'Signed out successfully',
      };
    } catch (error: any) {
      console.error('❌ Unexpected signout error:', error);
      return {
        success: false,
        message: error.message || 'Failed to sign out',
      };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      console.log('🔵 Sending password reset email...');
      
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

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'jaw://reset-password',
      });

      if (error) {
        console.error('❌ Reset password error:', error);
        return {
          success: false,
          message: error.message || 'Failed to send reset email',
        };
      }

      console.log('✅ Reset email sent');
      return {
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link shortly.',
      };
    } catch (error: any) {
      console.error('❌ Unexpected reset password error:', error);
      
      // Handle network errors
      if (error.message?.includes('Network request failed') || error.message?.includes('fetch')) {
        return {
          success: false,
          message: 'Network connection failed. Please check your internet connection and try again.',
        };
      }
      
      return {
        success: false,
        message: error.message || 'Failed to send reset email',
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
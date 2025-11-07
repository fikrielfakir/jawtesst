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

export const authService = {
  async signUp(options: SignUpOptions): Promise<{ user: User }> {
    try {
      const { email, password, firstName, lastName, userType = 'customer', phone } = options;

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
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

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
        throw new Error('Failed to create user profile');
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

      return { user };
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof AuthError) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  async signIn(email: string, password: string): Promise<{ user: User }> {
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!authData.user) {
        throw new Error('Failed to sign in');
      }

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profileData) {
        console.error('Profile fetch error:', profileError);
        throw new Error('Failed to fetch user profile');
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

      return { user };
    } catch (error) {
      console.error('Signin error:', error);
      if (error instanceof AuthError) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Signout error:', error);
      if (error instanceof AuthError) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      if (error instanceof AuthError) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Update password error:', error);
      if (error instanceof AuthError) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

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
  },

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
  },
};

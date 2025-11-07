import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@lib/supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://c6417c06-bdc8-4867-bb89-5772e88f8157-00-2tnozfmi494pa.worf.replit.dev:3000';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  userType: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<{ user: User }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('No user data returned from signup');
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        firstName: firstName,
        lastName: lastName,
        userType: 'customer',
      };

      await AsyncStorage.setItem('user', JSON.stringify(user));

      return { user };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string): Promise<{ user: User }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('No user data returned from signin');
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        firstName: data.user.user_metadata?.first_name || null,
        lastName: data.user.user_metadata?.last_name || null,
        userType: data.user.user_metadata?.user_type || 'customer',
      };

      await AsyncStorage.setItem('user', JSON.stringify(user));

      return { user };
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }

      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    }
  },

  async resetPassword(email: string): Promise<void> {
    try {
      const redirectTo = typeof window !== 'undefined' 
        ? `${window.location.origin}/reset-password`
        : 'jaw://reset-password';

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  async getSession(): Promise<string | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token || null;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      if (!supabaseUser) {
        const userStr = await AsyncStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
      }

      const user: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        firstName: supabaseUser.user_metadata?.first_name || null,
        lastName: supabaseUser.user_metadata?.last_name || null,
        userType: supabaseUser.user_metadata?.user_type || 'customer',
      };

      await AsyncStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
  },
};

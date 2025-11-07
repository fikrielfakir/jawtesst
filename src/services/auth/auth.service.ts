import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }

      const data: AuthResponse = await response.json();
      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      return { user: data.user };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string): Promise<{ user: User }> {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signin failed');
      }

      const data: AuthResponse = await response.json();
      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      return { user: data.user };
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('auth_token');

      if (token) {
        await fetch(`${API_URL}/api/auth/signout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
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
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Reset password failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('auth_token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/api/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update password failed');
      }
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  async getSession(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },
};

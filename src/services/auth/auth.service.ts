import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  userType: 'customer' | 'restaurant_owner' | 'admin';
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

const TOKEN_KEY = 'auth_token';

const getApiUrl = () => {
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return 'http://localhost:5000';
};

export const authService = {
  async signUp(options: SignUpOptions): Promise<{ user: User }> {
    try {
      const { email, password, firstName, lastName } = options;

      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sign up');
      }

      const data = await response.json();
      
      await AsyncStorage.setItem(TOKEN_KEY, data.token);

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        userType: data.user.userType,
        phone: null,
        profileImage: null,
        isVerified: false,
      };

      return { user };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string): Promise<{ user: User }> {
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sign in');
      }

      const data = await response.json();
      
      await AsyncStorage.setItem(TOKEN_KEY, data.token);

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        userType: data.user.userType,
        phone: null,
        profileImage: null,
        isVerified: false,
      };

      return { user };
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      
      const API_URL = getApiUrl();
      await fetch(`${API_URL}/api/auth/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    }
  },

  async resetPassword(email: string): Promise<void> {
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      if (!token) {
        throw new Error('Not authenticated');
      }

      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      if (!token) {
        return null;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.userId;
      const email = payload.email;

      const user: User = {
        id: userId,
        email: email,
        firstName: null,
        lastName: null,
        userType: 'customer',
        phone: null,
        profileImage: null,
        isVerified: false,
      };

      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },
};

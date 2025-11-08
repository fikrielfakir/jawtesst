import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get Supabase credentials from environment
const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if credentials are configured
const isConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn('⚠️  Supabase Configuration Missing:');
  console.warn('URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
  console.warn('Anon Key:', supabaseAnonKey ? '✅ Present' : '❌ Missing');
  console.warn('\nTo enable Supabase features:');
  console.warn('1. Create a .env file in project root');
  console.warn('2. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
  console.warn('3. Restart the dev server');
  console.warn('\nApp will continue without Supabase features.');
} else {
  console.log('✅ Supabase Configuration Loaded:');
  console.log('   URL:', supabaseUrl);
  console.log('   Key:', supabaseAnonKey.substring(0, 20) + '...');
}

// Create a dummy client if not configured, or real client if configured
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'x-client-info': 'supabase-js-react-native',
        },
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

// Export configuration status
export const isSupabaseConfigured = isConfigured;

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          profile_image: string | null;
          user_type: 'customer' | 'owner' | 'admin';
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          profile_image?: string | null;
          user_type?: 'customer' | 'owner' | 'admin';
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          profile_image?: string | null;
          user_type?: 'customer' | 'owner' | 'admin';
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      venues: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          address: string;
          city: string;
          country: string;
          phone: string;
          email: string | null;
          average_rating: number;
          total_reviews: number;
          capacity: number | null;
          is_active: boolean;
          business_hours: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          address: string;
          city: string;
          country: string;
          phone: string;
          email?: string | null;
          average_rating?: number;
          total_reviews?: number;
          capacity?: number | null;
          is_active?: boolean;
          business_hours?: any;
        };
        Update: Partial<Database['public']['Tables']['venues']['Insert']>;
      };
    };
  };
};
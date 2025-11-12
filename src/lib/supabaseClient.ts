import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get Supabase credentials from environment
// Try multiple sources for environment variables
const supabaseUrl = 
  Constants.expoConfig?.extra?.SUPABASE_URL || 
  process.env.EXPO_PUBLIC_SUPABASE_URL || 
  'https://sfrqfesobuvbondzwfjj.supabase.co';

const supabaseAnonKey = 
  Constants.expoConfig?.extra?.SUPABASE_ANON_KEY || 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  '';

// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase Configuration Warning:');
  console.warn('URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
  console.warn('Anon Key:', supabaseAnonKey ? '✅ Present' : '❌ Missing');
  console.warn('\nNote: Add Supabase credentials to enable authentication features');
  console.warn('1. Add EXPO_PUBLIC_SUPABASE_URL to environment');
  console.warn('2. Add EXPO_PUBLIC_SUPABASE_ANON_KEY to environment');
  console.warn('3. Restart the dev server after adding secrets');
}

if (supabaseUrl && supabaseAnonKey) {
  console.log('✅ Supabase Configuration Loaded:');
  console.log('   URL:', supabaseUrl);
  console.log('   Key:', supabaseAnonKey.substring(0, 20) + '...');
}

// Create a mock client if credentials are missing to prevent app crashes
export const supabase = (supabaseUrl && supabaseAnonKey) 
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
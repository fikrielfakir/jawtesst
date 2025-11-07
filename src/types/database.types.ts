export type UserType = 'customer' | 'restaurant_owner' | 'admin';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type NotificationType = 'booking' | 'review' | 'promotion' | 'system';
export type PriceRange = '$' | '$$' | '$$$' | '$$$$';
export type StoryStatus = 'active' | 'expired';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          profile_image: string | null;
          bio: string | null;
          user_type: UserType;
          is_verified: boolean;
          language: string;
          dark_theme: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      restaurants: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          address: string;
          city: string;
          country: string;
          latitude: number | null;
          longitude: number | null;
          phone: string;
          email: string | null;
          website: string | null;
          category: string;
          price_range: PriceRange;
          cover_image: string | null;
          hours: Record<string, { open: string; close: string; closed: boolean }> | null;
          rating: number;
          total_reviews: number;
          is_premier: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['restaurants']['Row'], 'id' | 'created_at' | 'updated_at' | 'rating' | 'total_reviews'>;
        Update: Partial<Database['public']['Tables']['restaurants']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string;
          booking_date: string;
          booking_time: string;
          number_of_guests: number;
          status: BookingStatus;
          special_requests: string | null;
          confirmation_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at' | 'confirmation_code'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string;
          rating: number;
          comment: string | null;
          images: string[] | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at' | 'is_verified'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      stories: {
        Row: {
          id: string;
          restaurant_id: string;
          media_url: string;
          media_type: 'image' | 'video';
          duration: number;
          views: number;
          status: StoryStatus;
          expires_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['stories']['Row'], 'id' | 'created_at' | 'views'>;
        Update: Partial<Database['public']['Tables']['stories']['Insert']>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description: string | null;
          price: number;
          category: string;
          image: string | null;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['menu_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['menu_items']['Insert']>;
      };
    };
  };
}

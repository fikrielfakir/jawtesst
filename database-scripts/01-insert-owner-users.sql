-- SQL Script: Insert Owner Users
-- Run this script to add sample restaurant owners to your database

-- Note: You'll need to create auth.users first in Supabase Auth, then use their UUIDs here
-- Or you can replace these UUIDs with actual user IDs from your auth.users table

-- Insert 5 owner users
INSERT INTO public.users (id, first_name, last_name, profile_image, user_type, is_verified, bio) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Mohamed', 'Chef', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400', 'owner', true, 'Passionate chef specializing in Mediterranean cuisine'),
  ('22222222-2222-2222-2222-222222222222', 'Janes', 'Smith', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'owner', true, 'Award-winning pastry chef and restaurant owner'),
  ('33333333-3333-3333-3333-333333333333', 'Moro', 'Martinez', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 'owner', true, 'Modern fusion cuisine expert'),
  ('44444444-4444-4444-4444-444444444444', 'Khaoula', 'Hassan', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 'owner', true, 'Traditional Moroccan cuisine specialist'),
  ('55555555-5555-5555-5555-555555555555', 'Michel', 'Dubois', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'owner', true, 'French fine dining expert')
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  profile_image = EXCLUDED.profile_image,
  user_type = EXCLUDED.user_type,
  is_verified = EXCLUDED.is_verified,
  bio = EXCLUDED.bio,
  updated_at = now();

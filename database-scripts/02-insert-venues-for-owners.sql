-- SQL Script: Insert Venues for Owner Users
-- Run this script after inserting owner users
-- Each owner needs a venue to have stories

INSERT INTO public.venues (id, owner_id, name, description, address, city, state, country, latitude, longitude, phone, email, average_rating, is_active, is_verified) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Mohamed''s Mediterranean Kitchen', 'Authentic Mediterranean flavors in a modern setting', '123 Main St', 'New York', 'NY', 'USA', 40.7128, -74.0060, '+1234567890', 'contact@mohamed-kitchen.com', 4.8, true, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Janes Patisserie', 'Exquisite French pastries and desserts', '456 Baker Ave', 'Los Angeles', 'CA', 'USA', 34.0522, -118.2437, '+1234567891', 'hello@janes-patisserie.com', 4.9, true, true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Moro Fusion', 'Where East meets West in perfect harmony', '789 Fusion Blvd', 'Chicago', 'IL', 'USA', 41.8781, -87.6298, '+1234567892', 'info@moro-fusion.com', 4.7, true, true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'Khaoula''s Moroccan Palace', 'Traditional Moroccan cuisine with a royal touch', '321 Spice Road', 'Miami', 'FL', 'USA', 25.7617, -80.1918, '+1234567893', 'welcome@khaoula-palace.com', 4.6, true, true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'Michel''s Bistro', 'Classic French bistro experience', '654 Paris Lane', 'San Francisco', 'CA', 'USA', 37.7749, -122.4194, '+1234567894', 'bonjour@michel-bistro.com', 4.9, true, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = now();

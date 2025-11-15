-- SQL Script: Insert Chef Stories
-- Run this script after inserting venues
-- Stories expire after 24 hours by default

INSERT INTO public.chef_stories (id, venue_id, media_url, media_type, duration, views, status, expires_at) VALUES
  -- Mohamed's stories
  ('story-11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 'image', 5, 0, 'active', NOW() + INTERVAL '24 hours'),
  ('story-11111111-1111-1111-1111-111111111112', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', 'image', 5, 0, 'active', NOW() + INTERVAL '24 hours'),
  
  -- Janes' stories
  ('story-22222222-2222-2222-2222-222222222221', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', 'image', 5, 0, 'active', NOW() + INTERVAL '24 hours'),
  ('story-22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800', 'image', 5, 0, 'active', NOW() + INTERVAL '24 hours'),
  
  -- Moro's stories
  ('story-33333333-3333-3333-3333-333333333331', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', 'image', 5, 0, 'active', NOW() + INTERVAL '24 hours'),
  ('story-33333333-3333-3333-3333-333333333332', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 'image', 5, 0, 'active', NOW() + INTERVAL '24 hours'),
  
  -- Khaoula's stories
  ('story-44444444-4444-4444-4444-444444444441', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800', 'image', 5, 0, 'active', NOW() + INTERVAL '24 hours'),
  ('story-44444444-4444-4444-4444-444444444442', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 'image', 5, 0, 'active', NOW() + INTERVAL '24 hours'),
  
  -- Michel's stories
  ('story-55555555-5555-5555-5555-555555555551', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800', 'image', 5, 0, 'active', NOW() + INTERVAL '24 hours'),
  ('story-55555555-5555-5555-5555-555555555552', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800', 'image', 5, 0, 'active', NOW() + INTERVAL '24 hours')
ON CONFLICT (id) DO UPDATE SET
  media_url = EXCLUDED.media_url,
  status = EXCLUDED.status,
  expires_at = EXCLUDED.expires_at;

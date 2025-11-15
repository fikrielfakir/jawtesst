-- SQL Script: Create Auth Users (EASIEST METHOD)
-- This bypasses the need for Supabase Auth UI
-- Run this FIRST before the other scripts

-- Insert into auth.users (this requires admin access in SQL Editor)
-- Note: You may need to run this as a Supabase admin
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'mohamed@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Mohamed"}',
    false,
    'authenticated'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'janes@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Janes"}',
    false,
    'authenticated'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'moro@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Moro"}',
    false,
    'authenticated'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '00000000-0000-0000-0000-000000000000',
    'khaoula@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Khaoula"}',
    false,
    'authenticated'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '00000000-0000-0000-0000-000000000000',
    'michel@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Michel"}',
    false,
    'authenticated'
  )
ON CONFLICT (id) DO NOTHING;

-- Create identities for each user
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  created_at,
  updated_at
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    '{"sub":"11111111-1111-1111-1111-111111111111","email":"mohamed@example.com"}',
    'email',
    NOW(),
    NOW()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    '{"sub":"22222222-2222-2222-2222-222222222222","email":"janes@example.com"}',
    'email',
    NOW(),
    NOW()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    '{"sub":"33333333-3333-3333-3333-333333333333","email":"moro@example.com"}',
    'email',
    NOW(),
    NOW()
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    '{"sub":"44444444-4444-4444-4444-444444444444","email":"khaoula@example.com"}',
    'email',
    NOW(),
    NOW()
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '55555555-5555-5555-5555-555555555555',
    '{"sub":"55555555-5555-5555-5555-555555555555","email":"michel@example.com"}',
    'email',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

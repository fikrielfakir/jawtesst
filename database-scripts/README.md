# Database Scripts for Owner Users and Stories

## How to Run These Scripts

Run these SQL scripts **in order** in your Supabase SQL Editor:

### Step 0: Create Auth Users (REQUIRED FIRST)
Run `00-create-auth-users.sql`

This creates the authentication users that are required before inserting into the public.users table. This script creates 5 test users with these credentials:
- Email: mohamed@example.com, janes@example.com, moro@example.com, khaoula@example.com, michel@example.com
- Password: password123 (for all users)

**Note:** If this fails with permission errors, you have two alternatives:
1. Create users manually via Supabase Dashboard > Authentication > Users
2. Use the Supabase API to create auth users

### Step 1: Insert Owner Users
Run `01-insert-owner-users.sql`

This inserts owner profile data into the public.users table using the same IDs from Step 0.

### Step 2: Insert Venues
Run `02-insert-venues-for-owners.sql`

This creates a venue for each owner. Each owner must have a venue to have stories.

### Step 3: Insert Stories
Run `03-insert-chef-stories.sql`

This creates 2 stories for each owner. Stories expire after 24 hours by default.

## What This Does

After running these scripts, your Feed screen will display:
- Real owner users instead of mock "chefs" data
- Users with profile images from Unsplash
- Each owner has active stories
- Stories show who has new content (colored border ring)

## Notes

- Stories automatically expire after 24 hours
- You can add more stories by duplicating the INSERT statements
- Profile images use Unsplash URLs (free stock photos)
- All data uses ON CONFLICT to allow re-running scripts safely

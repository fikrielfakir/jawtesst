# Database Scripts for Owner Users and Stories

## How to Run These Scripts

Run these SQL scripts in order in your Supabase SQL Editor:

### Step 1: Insert Owner Users
Run `01-insert-owner-users.sql`

**Important Note:** Before running this script, you need to create the auth users first in Supabase Auth. The UUIDs in this script (11111111-1111-1111-1111-111111111111, etc.) are placeholders. 

**Two options:**
1. **Option A (Easier):** Create 5 users through Supabase Auth UI or API first, then replace the UUIDs in the script with the actual auth user IDs
2. **Option B:** Insert directly into auth.users table first (requires admin access)

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

# Database Migration Guide - JAW Restaurant App

## Quick Start

The fastest way to migrate your database is through the Supabase Dashboard:

### Step-by-Step Instructions

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your JAW Restaurant App project

2. **Navigate to SQL Editor**
   - Click on **SQL Editor** in the left sidebar
   - Click **New Query** button

3. **Copy Migration SQL**
   - Open the file: `supabase/migrations/20251107_initial_schema.sql`
   - Select all content (Ctrl+A / Cmd+A)
   - Copy to clipboard (Ctrl+C / Cmd+C)

4. **Paste and Execute**
   - Paste the SQL into the Supabase SQL Editor
   - Click **Run** (or press Ctrl+Enter / Cmd+Enter)
   - Wait for execution to complete (may take 1-2 minutes)

5. **Verify Success**
   - You should see a success message
   - Check the "Tables" tab to see all created tables
   - Verify seed data was inserted

### Expected Result

After successful migration, you should have:

✅ **30+ Tables Created:**
- users, roles, permissions
- venues, bookings, reviews
- menu_items, categories, cuisine_types
- favorites, notifications, loyalty_points
- and many more...

✅ **Row Level Security (RLS) Enabled:**
- All tables have RLS policies
- Secure access control configured

✅ **Seed Data Inserted:**
- 8 restaurant categories
- 17 cuisine types  
- 4 price ranges
- 14 amenities
- 8 system roles
- 50+ permissions
- 8 FAQ entries

✅ **Functions & Triggers:**
- Auto-updating timestamps
- Booking confirmation generation
- Rating calculations
- Loyalty points automation

## Troubleshooting

### Error: Extension Already Exists
This is normal if extensions were previously installed. The migration will continue.

### Error: Type Already Exists
If you're re-running the migration, drop the existing types first:
```sql
DROP TYPE IF EXISTS user_type CASCADE;
-- Repeat for other types
```

Or start fresh by dropping the public schema:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### Error: Permission Denied
Make sure you're using a user with SUPERUSER privileges or the postgres role.

### Checking Migration Status

Run these queries to verify your migration:

```sql
-- Check tables
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = 'public';
-- Should return ~35 tables

-- Check RLS policies
SELECT COUNT(*) as total_policies 
FROM pg_policies 
WHERE schemaname = 'public';
-- Should return 30+ policies

-- Check seed data
SELECT 
  (SELECT COUNT(*) FROM public.categories) as categories,
  (SELECT COUNT(*) FROM public.cuisine_types) as cuisines,
  (SELECT COUNT(*) FROM public.roles) as roles,
  (SELECT COUNT(*) FROM public.amenities) as amenities;
-- Should show: 8 categories, 17 cuisines, 8 roles, 14 amenities
```

## Next Steps

After successful migration:

1. **Update Your App Code**
   - Update TypeScript types (see TypeScript Types section)
   - Update API calls to match new schema
   - Test authentication flow

2. **Test Database Access**
   - Try creating a user through Supabase Auth
   - Verify RLS policies are working
   - Test data insertion/retrieval

3. **Configure Storage (Optional)**
   - Set up Supabase Storage for venue images
   - Configure review photo uploads
   - Set up user profile images

## TypeScript Types Generation

After migration, generate TypeScript types:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Generate types
supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/database.types.ts
```

Or use the online type generator:
https://supabase.com/dashboard/project/YOUR_PROJECT_REF/api/types

## Rolling Back

If you need to rollback the migration:

```sql
-- WARNING: This will delete all data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Review error messages carefully
3. Ensure environment variables are configured
4. Contact the development team

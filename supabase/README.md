# JAW Restaurant App - Supabase Database Migration

This directory contains the database schema and migrations for the JAW Restaurant App.

## Database Schema Overview

The database includes 30+ tables with comprehensive features:

### Core Tables
- **users** - User profiles extending Supabase Auth
- **roles & permissions** - Role-Based Access Control (RBAC) system
- **venues** - Restaurant listings with full details
- **bookings** - Table reservations system
- **reviews** - Restaurant ratings and reviews with photos
- **menu_items** - Restaurant menus

### Advanced Features
- **Loyalty Program** - Points system with tier levels
- **Premier Subscriptions** - Premium membership management
- **Promotions** - Discount codes and special offers
- **Stories** - Time-limited content (Instagram-style)
- **Notifications** - Multi-channel notification system
- **Analytics** - Business intelligence and reporting
- **Audit Logs** - Complete audit trail for sensitive operations

### Security Features
- Row Level Security (RLS) policies on all tables
- Role-based permissions system
- Secure password reset flows
- Audit logging for compliance
- Banned users management

## Migration Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. Log in to your Supabase Dashboard at https://app.supabase.com
2. Navigate to your project
3. Go to the **SQL Editor** tab
4. Click **New Query**
5. Copy the contents of `migrations/20251107_initial_schema.sql`
6. Paste into the SQL Editor
7. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Apply the migration
supabase db push
```

### Option 3: Using psql

If you prefer direct database access:

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run the migration
\i supabase/migrations/20251107_initial_schema.sql
```

## What the Migration Includes

### 1. Extensions
- `uuid-ossp` - UUID generation
- `pgcrypto` - Cryptographic functions
- `pg_trgm` - Fuzzy text search

### 2. Custom Types
- user_type, booking_status, notification_type
- subscription_status, payment_method_type
- content_type, report_status, transaction_type, ban_type

### 3. Database Tables
- 30+ production-ready tables
- Optimized indexes for performance
- Full-text search capabilities
- Geospatial indexing for location-based queries

### 4. Row Level Security (RLS)
- Complete RLS policies for all tables
- User-level data isolation
- Role-based access control
- Venue staff permissions

### 5. Triggers & Functions
- Auto-updating timestamps
- Venue rating calculations
- Loyalty points automation
- Booking confirmation code generation
- Audit trail logging

### 6. Seed Data
- Default roles (customer, owner, admin, etc.)
- Restaurant categories
- Cuisine types
- Price ranges
- Amenities
- FAQs

### 7. Performance Views
- `popular_venues` - Most popular restaurants
- `venue_details` - Complete venue information with relationships
- `user_booking_history` - User booking history with details
- `upcoming_bookings` - Upcoming reservations
- `venue_analytics` - Restaurant performance metrics

## Post-Migration Steps

After running the migration:

1. **Verify Tables Created**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```

2. **Check RLS Policies**
   ```sql
   SELECT schemaname, tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

3. **Verify Seed Data**
   ```sql
   SELECT COUNT(*) FROM public.categories;
   SELECT COUNT(*) FROM public.cuisine_types;
   SELECT COUNT(*) FROM public.roles;
   ```

## Environment Variables

Make sure these are configured in your `.env` or Replit Secrets:

- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_KEY` - Your Supabase anon/public key

## TypeScript Types

After migration, you may want to generate TypeScript types from your database:

```bash
npx supabase gen types typescript --project-id your-project-ref > src/types/database.types.ts
```

## Support

For issues or questions:
- Check Supabase logs in your dashboard
- Review the migration file for specific table/policy details
- Contact the development team

## Schema Version

Current schema version: **2.0.0**
- Complete optimized schema
- RBAC with granular permissions
- Advanced security features
- Performance optimizations
- Comprehensive audit logging

# 🎯 JAW Restaurant App - Database Migration

## What You're Getting

Your database migration includes **30+ production-ready tables** with:

✅ Complete restaurant management system  
✅ Booking and reservation system  
✅ User reviews with photos  
✅ Loyalty points program  
✅ Premier subscriptions  
✅ Role-based permissions (RBAC)  
✅ Security policies (RLS) on all tables  
✅ Automated business logic  
✅ Analytics and reporting  
✅ Pre-loaded seed data (categories, cuisines, roles, etc.)  

---

## 📋 How to Apply the Migration

### Step 1: Open Supabase Dashboard
1. Go to **https://app.supabase.com**
2. Sign in to your account
3. Select your **JAW Restaurant App** project

### Step 2: Open SQL Editor
1. Click **SQL Editor** in the left sidebar
2. Click the **New Query** button

### Step 3: Copy the Migration SQL
1. In this Replit project, open the file:  
   **`supabase/migrations/20251107_initial_schema.sql`**
2. Select all content (Ctrl+A or Cmd+A)
3. Copy to clipboard (Ctrl+C or Cmd+C)

### Step 4: Run the Migration
1. Paste the SQL into the Supabase SQL Editor
2. Click **RUN** (or press Ctrl+Enter / Cmd+Enter)
3. Wait 1-2 minutes for execution to complete
4. You should see a success message

### Step 5: Verify Success
Run this query in the SQL Editor to verify:

```sql
SELECT 
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as tables,
  (SELECT COUNT(*) FROM public.categories) as categories,
  (SELECT COUNT(*) FROM public.cuisine_types) as cuisines,
  (SELECT COUNT(*) FROM public.roles) as roles;
```

Expected result:
- **~35 tables**
- **8 categories**
- **17 cuisines**
- **8 roles**

---

## ✅ What's Included

### Core Features
- **Users & Authentication** - Profile management, preferences, ban system
- **Venues (Restaurants)** - Full details, hours, location, ratings
- **Bookings** - Table reservations with confirmation codes
- **Reviews** - Multi-aspect ratings (food, service, ambiance) + photos
- **Menu Management** - Items with allergens, nutrition, pricing

### Premium Features
- **Loyalty Program** - Earn points, tier levels (Bronze → Platinum)
- **Premier Subscriptions** - Premium membership with Stripe
- **Promotions** - Discount codes and special offers
- **Stories** - Instagram-style time-limited content
- **Payment Methods** - Secure card storage

### Business Tools
- **Staff Management** - Role assignments for venue teams
- **Analytics Dashboard** - Performance metrics and insights
- **Audit Logging** - Complete activity tracking
- **Reports & Moderation** - Content flagging system
- **Notifications** - Email, push, and SMS support

### Security & Performance
- **Row Level Security (RLS)** - All tables protected
- **Role-Based Access Control (RBAC)** - 50+ granular permissions
- **Optimized Indexes** - Fast queries and searches
- **Full-Text Search** - Restaurant and menu search
- **Geospatial Indexing** - Location-based queries
- **Automated Triggers** - Business logic automation

---

## 🎨 Seed Data Included

Your database comes pre-loaded with:

**Restaurant Categories (8):**
- Fast Food, Fine Dining, Casual Dining, Coffee & Cafes
- Bars & Pubs, Food Trucks, Bakery, Buffet

**Cuisine Types (17):**
- Italian, Chinese, Japanese, Mexican, Indian, Thai, French
- Mediterranean, American, Korean, Vietnamese, Middle Eastern
- Spanish, Seafood, Steakhouse, Vegan, Vegetarian

**Price Ranges (4):**
- $ (Budget), $$ (Moderate), $$$ (Upscale), $$$$ (Fine Dining)

**System Roles (8):**
- Super Admin, Admin, Venue Owner, Venue Manager
- Venue Staff, Customer, Premier Customer, Moderator

**Amenities (14):**
- WiFi, Parking, Wheelchair Accessible, Outdoor Seating
- Pet Friendly, Live Music, Private Dining, Bar
- Delivery, Takeout, Reservations, Kids Menu
- Valet Parking, Credit Cards

---

## 📚 Need More Details?

- **Complete Documentation:** `supabase/README.md`
- **Detailed Migration Guide:** `supabase/MIGRATION_GUIDE.md`
- **Schema File:** `supabase/migrations/20251107_initial_schema.sql`

---

## 🆘 Troubleshooting

### "Extension already exists" errors
✅ This is normal - the migration will continue successfully

### Need to start fresh?
Run this first, then re-run the migration:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### Verify RLS policies are working
```sql
SELECT COUNT(*) as total_policies 
FROM pg_policies 
WHERE schemaname = 'public';
```
Should return 30+ policies

---

## 🚀 After Migration

Once migration is complete:

1. ✅ **Your database is ready to use**
2. ✅ **All security policies are active**
3. ✅ **Seed data is available**
4. ✅ **You can start building features**

Your app is already configured to connect to Supabase via the environment variables:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_KEY`

Ready to start building amazing restaurant features! 🎉

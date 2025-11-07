# JAW Restaurant App - Project Documentation

## Overview
JAW is a comprehensive React Native restaurant discovery and booking application built with modern technologies including Expo Router, Tamagui UI library, and Supabase backend.

## Project Status (November 7, 2025)
The project has been initialized with the foundational architecture and core features. The app currently includes:

### Completed Features
- ✅ Project structure setup with Expo Router file-based navigation
- ✅ TypeScript configuration with path aliases
- ✅ Tamagui UI library integration
- ✅ Supabase client configuration for authentication and database
- ✅ Authentication flow (sign-in, sign-up, forgot password)
- ✅ Main tab navigation (Home, Search, Bookings, Favorites, Profile)
- ✅ Database schema with migrations and RLS policies
- ✅ Custom hooks (useAuth)
- ✅ Theme constants (colors, spacing, categories)

### Architecture
The app follows clean architecture principles with clear separation:
- **app/**: File-based routing with Expo Router
- **src/components/**: Reusable UI components
- **src/services/**: External service integrations (Supabase, etc.)
- **src/domain/**: Business logic, models, repositories, use cases
- **src/lib/**: Utilities, hooks, helpers
- **src/constants/**: Theme, categories, configuration
- **supabase/**: Database migrations, policies, seeds

### Tech Stack
- **Frontend**: React Native 0.81.5, Expo 54
- **Navigation**: Expo Router 3.5
- **UI**: Tamagui 1.136
- **Backend**: Supabase (PostgreSQL + Auth)
- **State**: Zustand 4.5
- **Data Fetching**: TanStack Query 5.90
- **Forms**: React Hook Form 7.66
- **Language**: TypeScript 5.9

## Database Schema (Version 2.0)

The database migration is ready in `supabase/migrations/20251107_initial_schema.sql`.

### Comprehensive Schema Features:
- **30+ Production Tables** with optimized indexes
- **Role-Based Access Control (RBAC)** with granular permissions
- **Row Level Security (RLS)** policies on all tables
- **Automated Triggers** for business logic
- **Performance Views** for analytics
- **Audit Logging** for compliance

### Core Tables:
- **users** - User profiles extending Supabase Auth
- **roles & permissions** - RBAC system with 50+ permissions
- **venues** - Restaurant listings with full details
- **bookings** - Table reservations with confirmation codes
- **reviews** - Ratings (food, service, ambiance) with photos
- **menu_items** - Restaurant menus with allergens & nutrition

### Advanced Features:
- **Loyalty Program** - Points system with bronze/silver/gold/platinum tiers
- **Premier Subscriptions** - Premium membership with Stripe integration
- **Promotions & Offers** - Discount codes and special deals
- **User Stories** - Time-limited content (Instagram-style)
- **Notifications** - Multi-channel (email, push, SMS)
- **Analytics** - Business intelligence and reporting
- **Payment Methods** - Secure card storage via Stripe
- **Venue Staff** - Team management with role assignments
- **Search History** - Personalized recommendations
- **Reports & Moderation** - Content flagging system
- **Banned Users** - Security and compliance
- **Audit Logs** - Complete activity tracking

### To Apply Migration:
See `supabase/README.md` and `supabase/MIGRATION_GUIDE.md` for detailed instructions.

## Environment Setup
Required environment variables (configured via Replit Secrets):
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL (configured)
- `EXPO_PUBLIC_SUPABASE_KEY` - Your Supabase anon/public key (configured)

## Current State
The app has a working authentication system and basic navigation structure. Users can:
- Sign up for new accounts
- Sign in to existing accounts
- Reset forgotten passwords
- Navigate between main app sections

## Next Steps
Features ready to be built:
1. Restaurant listing and detail pages
2. Search and filtering functionality
3. Booking creation and management
4. Review submission with photos
5. Stories feature implementation
6. Restaurant owner dashboard
7. Menu management
8. Analytics dashboard

## Development Notes
- The Expo web server runs on port 5000
- Package versions have minor warnings but are functional
- Using React 19.1.0 with Expo 54
- All authentication flows are connected to Supabase Auth

## User Preferences
None recorded yet.

## Recent Changes
- **2025-11-07**: 
  - Initial project setup and authentication implementation
  - Replaced "JAW" text with jwa-logo.png image across all authentication screens (sign-in, sign-up, register-restaurant, welcome)
  - Logo displays at appropriate sizes for each screen (120x60 for sign-in/sign-up, 100x50 for register-restaurant header, 150x75 for welcome)
  - **Authentication Enhancement:**
    - Added back buttons to sign-in and sign-up screens (matching register-restaurant pattern)
    - Integrated Supabase authentication (replacing local backend auth)
    - Configured Supabase client with environment variables
    - Updated auth service to use Supabase Auth API for sign-up, sign-in, sign-out, and password reset
    - Added @lib path mapping to TypeScript configuration
    - Implemented cross-platform password reset with proper deep link scheme (jaw://)
  - **Database Migration Ready:**
    - Created comprehensive Supabase database schema (Version 2.0)
    - 30+ production-ready tables with RBAC, RLS policies, triggers, and seed data
    - Migration file: `supabase/migrations/20251107_initial_schema.sql`
    - Complete documentation: `supabase/README.md` and `supabase/MIGRATION_GUIDE.md`
    - Ready to apply via Supabase Dashboard SQL Editor

# JAW Restaurant App - Project Documentation

## Overview
JAW is a comprehensive React Native restaurant discovery and booking application built with modern technologies including Expo Router, Tamagui UI library, Express.js API, and Neon PostgreSQL database via Drizzle ORM.

## Project Status (November 7, 2025)
The project has been initialized with the foundational architecture and core features. The app currently includes:

### Completed Features
- ✅ Project structure setup with Expo Router file-based navigation
- ✅ TypeScript configuration with path aliases and esModuleInterop
- ✅ Tamagui UI library integration
- ✅ Express.js API backend with JWT authentication
- ✅ Neon PostgreSQL database with Drizzle ORM
- ✅ Authentication flow (sign-in, sign-up, reset password)
- ✅ Restaurant registration with owner account creation
- ✅ Main tab navigation (Home, Search, Bookings, Favorites, Profile)
- ✅ Database schema pushed to production
- ✅ Custom hooks (useAuth)
- ✅ Theme constants (colors, spacing, categories)

### Architecture
The app follows clean architecture principles with clear separation:
- **app/**: File-based routing with Expo Router
- **src/components/**: Reusable UI components
- **src/services/**: API service integrations
- **src/domain/**: Business logic, models, repositories, use cases
- **src/lib/**: Utilities, hooks, helpers
- **src/constants/**: Theme, categories, configuration
- **server/**: Express.js API server with routes
- **shared/**: Drizzle ORM database schema

### Tech Stack
- **Frontend**: React Native 0.81.5, Expo 54
- **Navigation**: Expo Router 3.5
- **UI**: Tamagui 1.136
- **Backend**: Express.js 5.1 API
- **Database**: Neon PostgreSQL via Drizzle ORM 0.44
- **Authentication**: JWT-based auth with bcrypt
- **State**: Zustand 4.5
- **Data Fetching**: TanStack Query 5.90
- **Forms**: React Hook Form 7.66
- **Language**: TypeScript 5.9

## Database Schema (Current)

The database schema is managed using Drizzle ORM in `shared/schema.ts`.

### Core Tables:
- **users** - User profiles with authentication
  - Fields: id, email, password, firstName, lastName, phone, profileImage, bio
  - User types: customer, restaurant_owner, admin
- **restaurants** - Restaurant listings
  - Fields: id, ownerId, name, description, address, city, country, phone, email
  - Category, price range, cover image, hours, rating, reviews
- **bookings** - Table reservations
  - Fields: id, userId, restaurantId, bookingDate, bookingTime, numberOfGuests
  - Status: pending, confirmed, cancelled, completed
  - Unique confirmation codes
- **reviews** - Restaurant ratings and reviews
  - Fields: id, userId, restaurantId, rating, comment, images
  - Verified status
- **stories** - Time-limited content (Instagram-style)
  - Fields: id, restaurantId, mediaUrl, mediaType, duration, views
  - Auto-expiring with status tracking
- **favorites** - User saved restaurants
- **menu_items** - Restaurant menus with pricing

### Managing Schema:
- Schema defined in `shared/schema.ts` using Drizzle ORM
- Push changes: `npm run db:push`
- Open Drizzle Studio: `npm run db:studio`

## Environment Setup
Required environment variables (configured via Replit):
- `DATABASE_URL` - Neon PostgreSQL connection string (auto-configured)
- `JWT_SECRET` - Secret key for JWT token signing (optional, has dev fallback)
- `API_PORT` - API server port (defaults to 3000)

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
- The Express API server runs on port 3000
- Package versions have minor warnings but are functional
- Using React 19.1.0 with Expo 54
- Authentication flows use JWT tokens stored in AsyncStorage
- Database schema managed with Drizzle ORM

## User Preferences
None recorded yet.

## Recent Changes
- **2025-11-12 (Latest - Home Screen Design Optimization)**:
  - **Visual Enhancements:**
    - Reduced header padding (8px top/bottom, down from 16px) for more compact layout
    - Tightened control gaps (8px, down from 12px) in filter/location buttons
    - Reduced logo size to 90x45px for better proportions
    - Decreased "Choose Category" title size to 22px with reduced bottom margin (20px)
    - Category label font size reduced to 13px with semi-bold (600) weight
  - **Color & Styling Updates:**
    - Updated all header icons and text to lighter #d0d0d0 color
    - Enhanced background gradient with deeper contrast ['#5A3D7C', '#3D2657', '#1A0E2E', '#0A050F']
    - Filter and location button text now 12px with semi-bold (600) weight
  - **Interactive States:**
    - Added selected category state (defaults to "Cafe")
    - Active category shows stronger glow with intensified gradient colors
    - Active category border increased to 3px with brighter white (0.6 opacity)
    - Inactive categories have subtle glow with lighter gradient
  - **Bottom Navigation:**
    - Compacted tab bar height to 60px with adjusted padding (8px)
    - Tab labels reduced to 11px with semi-bold (600) weight
    - Active tab icons scale to 26px, inactive to 22px
    - Active tab color changed to #B9A2E1 (purple), inactive to #8B8B8B
    - Tab bar background set to #1A0E2E with #3D2657 border
  - **Technical Improvements:**
    - Fixed web deprecation warnings by replacing shadow props with CSS filter: drop-shadow()
    - Replaced textShadowColor/Offset/Radius with standard textShadow
    - All shadow effects now use web-compatible syntax
  - **Files Modified:**
    - `app/(tabs)/index.tsx` - Complete Home screen visual optimization
    - `app/(tabs)/_layout.tsx` - Bottom navigation bar styling improvements
  
- **2025-11-12 (Earlier - Home Screen Redesign)**:
  - **Home Screen Implementation:**
    - Redesigned home screen with circular category layout matching reference design
    - Implemented 6 restaurant categories in a circular arrangement (Cafe, Morocco Way, Fine Dining, Dance, Lounge & Pub, Chiringuito)
    - Added header with JAW logo, Filter Distance button, and Tanger, Morocco location dropdown
    - Created center bottle graphic using three-part design (neck, body, base)
    - Purple gradient background ['#47306F', '#2E214D', '#0A050F'] matching auth screens
    - Responsive layout using useWindowDimensions for all screen sizes
  - **Image Loading Fix:**
    - Fixed category images not loading on Expo Web
    - Issue: Alias-based JPEG requires (`@assets/home/...jpg`) don't resolve on Expo Web
    - Solution: Changed to static relative imports (`require('../../assets/home/...')`)
    - All 6 category images now load correctly with proper circular cropping
  - **Technical Details:**
    - Category positions calculated using responsive radius and angles
    - Purple glow effects around each category button
    - Images use `resizeMode="cover"` for proper cropping in circular containers
    - Bottom navigation bar integrated with existing tab structure
  - **Files Modified:**
    - `app/(tabs)/index.tsx` - Complete home screen redesign
    - `assets/home/` - Added 6 category images (cafe, morocco way, fine dining, dance, lounge & pub, chiringuito)

- **2025-11-12 (Earlier - 6-Digit OTP Password Reset)**:
  - **Password Reset Enhancement:**
    - Implemented 6-digit OTP verification for password reset instead of email links
    - Uses Supabase's built-in recovery OTP system (requires email template configuration)
    - Created new verify-otp.tsx screen with auto-focus, resend functionality, and 60s timer
    - Updated forgot-password.tsx to navigate to OTP verification screen
    - Fixed double verification issue - OTP verified once, then recovery session used for password update
  - **New Screens:**
    - `app/(auth)/verify-otp.tsx` - 6-digit code entry with real-time validation
    - Resend code functionality with countdown timer
    - Auto-advance between input fields
  - **Documentation:**
    - Updated SUPABASE_SETUP.md with email template configuration guide
    - Documented the complete password reset flow
    - Added troubleshooting section for common issues
  - **Security:**
    - OTP expires after 60 minutes (Supabase default)
    - Single-use tokens enforced by Supabase
    - Rate limiting on password reset requests

- **2025-11-07 (Migration to Neon PostgreSQL)**:
  - **Backend Migration:**
    - Migrated from Supabase to Neon PostgreSQL with Drizzle ORM
    - Created Express.js API server with authentication routes
    - Implemented JWT-based authentication with bcrypt password hashing
    - Added restaurant registration endpoint at `/api/restaurants/register`
    - Removed Supabase dependencies and cleaned up unused code
    - Successfully pushed database schema to Neon PostgreSQL
  - **Frontend Updates:**
    - Updated auth service to call Express API instead of Supabase
    - Modified register-restaurant screen with full form (name, password, etc.)
    - Dynamic API URL detection for Replit environment
    - All auth flows now work with JWT tokens
  - **TypeScript Configuration:**
    - Added `esModuleInterop: true` for proper module imports
    - Fixed all LSP errors in server code
  - **Database Schema:**
    - Drizzle schema in `shared/schema.ts`
    - Core tables: users, restaurants, bookings, reviews, stories, favorites, menu_items
    - Enums: user_type, price_range, booking_status, media_type, story_status

- **2025-11-07 (Earlier)**:
  - Initial project setup and authentication implementation
  - Replaced "JAW" text with jwa-logo.png image across all authentication screens
  - Logo displays at appropriate sizes for each screen
  - Added back buttons to sign-in and sign-up screens
  - Added @lib path mapping to TypeScript configuration
  - Implemented cross-platform password reset with proper deep link scheme (jaw://)

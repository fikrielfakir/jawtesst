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
- **2025-11-07 (Latest - Migration to Neon PostgreSQL)**:
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

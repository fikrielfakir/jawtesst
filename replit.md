# JAW Restaurant App - Project Documentation

## Overview
JAW is a comprehensive React Native restaurant discovery and booking application. It aims to provide users with a seamless experience for finding and reserving tables, while offering restaurant owners tools for managing their listings and engaging with customers. The application is built with modern technologies to ensure scalability, performance, and a rich user experience.

## User Preferences
None recorded yet.

## System Architecture
The application adheres to clean architecture principles, separating concerns into distinct layers.

**Frontend (React Native & Expo):**
- **Navigation:** Expo Router for file-based navigation.
- **UI:** Tamagui UI library for consistent and performant cross-platform components.
- **State Management:** Zustand for efficient state management.
- **Data Fetching:** TanStack Query for server-state management.
- **Forms:** React Hook Form for robust form handling.
- **Design:** Features a dynamic purple gradient background, a circular category selection interface on the home screen, and a visually distinct animated bottle for interaction. UI elements like headers, buttons, and tab bars are styled with specific colors, sizes, and shadow effects for a cohesive look. Active states for categories and tabs are visually emphasized with stronger glows, intensified gradients, and scaling animations.
- **Technical Implementations:** Utilizes `useWindowDimensions` for responsive layouts. Employs `withTiming` for animations with careful state management to prevent race conditions and ensure single invocation of navigation handlers. Shadow effects are implemented using web-compatible CSS `filter: drop-shadow()`.

**Backend (Express.js & Drizzle ORM):**
- **API:** Express.js API server handles requests.
- **Database:** Neon PostgreSQL accessed via Drizzle ORM.
- **Authentication:** JWT-based authentication with bcrypt for password hashing.
- **Architecture:** Organized into `app/` (Expo Router), `src/components/`, `src/services/` (API integrations), `src/domain/` (business logic), `src/lib/` (utilities), `src/constants/` (theme, config), `server/` (Express API), and `shared/` (Drizzle schema).
- **TypeScript:** Configured with path aliases and `esModuleInterop: true`.

**Design System:**
- **Global Theme Tokens:** Comprehensive design tokens in `src/constants/theme/` including:
  - `colors.ts`: Dark theme with black background, surface layers, purple accent, status colors, accent colors for UI elements
  - `spacing.ts`: Standardized spacing scale, sizing (icons, avatars, buttons), typography, border radius, elevation
- **Reusable UI Components:** Complete component library in `src/design-system/components/`:
  - Core: Button, Input, Card, Avatar, StatusBadge, TabBar, IconButton
  - Layout: ScreenContainer, SectionHeader, Divider
  - Composite: ListItem
  - Bottom Sheets: FilterBottomSheet (distance filter with slider control), LocationBottomSheet (city selection with search)
- **Implemented Screens:** All user-facing screens built with design system:
  - Account Settings, Become Partner, Bookings (Upcoming/Past)
  - Contact Us, FAQ, Feed (category-based restaurant browsing), Notifications
  - Payment Methods, Premier Plan, Profile (User/Owner variants)
  - Settings, Terms & Conditions, Side Menu drawer
- **Feed Screen (Updated Nov 2025):**
  - **Typography:** Default system fonts with fontWeight (matching Home screen style)
  - **Icons:** Lucide icons from @tamagui/lucide-icons (Bell, Heart, MessageCircle, Star for feed; Home, MessageSquare, PlusCircle, Heart, UserRound for tabs)
  - **Theme-Driven:** Fully uses global theme tokens from colors.ts and spacing.ts (no hardcoded values)
  - **Colors:** All colors use theme tokens (colors.text, colors.rating, colors.accent.*, colors.overlay.*)
  - **Sizing:** All sizes use theme tokens (sizing.icon.*, sizing.avatar.*, spacing.*, borderRadius.*, typography.*)
  - **Header:** User avatar, centered logo with flex layout, Bell icon with notification badge
  - **Chef Stories:** Avatars with colored accent border rings from global theme
  - **Restaurant Cards:** ImageBackground with 3-stop gradient overlay using theme tokens
  - **Bottom Navigation:** Elevated center action button with proper icon sizing and theme colors

**Core Features:**
- Authentication flow (sign-in, sign-up, reset password with 6-digit OTP verification).
- Restaurant registration for owners.
- Main tab navigation (Home, Search, Bookings, Favorites, Profile).
- Home screen with interactive circular category selection and animated bottle.
- **Distance Filter Bottom Sheet (Nov 2025):** 
  - Slide-up modal with smooth spring/timing animations
  - Interactive slider control for distance range (1-50 km)
  - Touch gesture handling with full track interaction
  - Optimized header layout with improved filter/location buttons
  - Real-time distance value display and apply functionality
- **Location Selection Bottom Sheet (Nov 2025):**
  - Slide-up modal with backdrop fade animation
  - Search functionality for filtering cities
  - List of popular Moroccan cities (Tanger, Casablanca, Marrakech, etc.)
  - Visual feedback for selected location
  - Proper touch event handling (backdrop closes, sheet content interactive)
- Category-based Feed screen with chef list and restaurant cards (displays after category selection from Home).
- **Discover Screen (Updated Nov 2025):**
  - **Black Background:** Uses colors.background (#070709) for true dark theme
  - **Theme-Driven:** Fully uses global theme tokens (colors.*, spacing.*, sizing.*, typography.*, borderRadius.*)
  - **Database Query:** Joins with price_ranges table to display venue pricing
  - **Single-Column Layout:** Full-width restaurant cards (380px height) matching FeedScreen design
  - **Card Features:** ImageBackground with gradient overlay, featured badge, verification badge, location, price range, post caption, like/comment/rating interactions
  - **Navigation:** Auto-selects category when navigated from FeedScreen with categoryId parameter
  - **Search:** Real-time search filtering by venue name or city
  - **Category Switching:** Horizontal scrollable category tabs to change content
  - **Smart Scrolling:** Auto-scrolls to selected venue card when deep-linking from Feed
- **Instagram-Style Chef Stories (Nov 2025):**
  - Full-screen story viewer with automatic progression
  - Tap left/right to navigate between stories, swipe down to close
  - Progress bars at top showing story position
  - Auto-advance to next story after duration
  - Chef profile display with avatar, name, and location
  - Pause on hold, resume on release
  - Accessible by tapping chef avatars in Feed screen
  - Stories expire after 24 hours (database-managed)
  - Visual indicators (colored border rings) show which chefs have active stories
- Complete user account management and settings.
- Partner onboarding with document uploads.
- Booking management with status tracking (Approved, Pending, Closed).
- Premium subscription system.
- Multi-payment method support.

**Database Schema:**
Managed by Drizzle ORM, defined in `shared/schema.ts`. Updated types in `src/lib/supabaseClient.ts`.
- `users`: User profiles (customer, restaurant_owner, admin).
- `restaurants`: Restaurant listings with detailed information.
- `bookings`: Table reservations with status tracking.
- `reviews`: Restaurant ratings and comments.
- `chef_stories`: Instagram-style ephemeral stories for venues (media_url, media_type, duration, views, status, expires_at).
- `story_views`: Tracks which users have viewed which stories.
- `favorites`: User-saved restaurants.
- `menu_items`: Restaurant menu details.

## External Dependencies
- **Frontend:**
    - React Native 0.81.5
    - Expo 54, Expo Router 3.5
    - Tamagui 1.136
    - Zustand 4.5
    - TanStack Query 5.90
    - React Hook Form 7.66
- **Backend:**
    - Express.js 5.1
    - Neon PostgreSQL
    - Drizzle ORM 0.44
- **Authentication:**
    - JSON Web Tokens (JWT)
    - bcrypt (for password hashing)
- **Development Tools:**
    - TypeScript 5.9
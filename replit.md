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
  - `colors.ts`: Dark theme with black background (#070709), surface layers, purple accent (#7B61E8), status colors
  - `spacing.ts`: Standardized spacing scale (4-40px), sizing (icons, avatars, buttons), typography, elevation
- **Reusable UI Components:** Complete component library in `src/design-system/components/`:
  - Core: Button, Input, Card, Avatar, StatusBadge, TabBar, IconButton
  - Layout: ScreenContainer, SectionHeader, Divider
  - Composite: ListItem
- **Implemented Screens:** All user-facing screens built with design system:
  - Account Settings, Become Partner, Bookings (Upcoming/Past)
  - Contact Us, FAQ, Notifications
  - Payment Methods, Premier Plan, Profile (User/Owner variants)
  - Settings, Terms & Conditions, Side Menu drawer

**Core Features:**
- Authentication flow (sign-in, sign-up, reset password with 6-digit OTP verification).
- Restaurant registration for owners.
- Main tab navigation (Home, Search, Bookings, Favorites, Profile).
- Home screen with interactive circular category selection and animated bottle.
- Complete user account management and settings.
- Partner onboarding with document uploads.
- Booking management with status tracking (Approved, Pending, Closed).
- Premium subscription system.
- Multi-payment method support.

**Database Schema:**
Managed by Drizzle ORM, defined in `shared/schema.ts`.
- `users`: User profiles (customer, restaurant_owner, admin).
- `restaurants`: Restaurant listings with detailed information.
- `bookings`: Table reservations with status tracking.
- `reviews`: Restaurant ratings and comments.
- `stories`: Time-limited content (e.g., daily specials).
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
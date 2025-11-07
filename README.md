# JAW Restaurant App

A comprehensive React Native restaurant discovery and booking application built with Expo Router, Tamagui, and Supabase.

## Features

### Customer Features
- 🔐 User authentication (sign up, sign in, password recovery)
- 🍽️ Restaurant discovery with search and filters
- ⭐ Reviews and ratings with photo uploads
- 📅 Table booking system
- ❤️ Favorite restaurants
- 📖 Restaurant stories (Instagram-style)
- 👤 User profile management

### Restaurant Owner Features
- 🏪 Restaurant management dashboard
- 📊 Analytics and insights
- 📋 Booking management
- 📝 Menu editor
- 💰 Premier subscription
- 📸 Story creation and management

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **UI Library**: Tamagui (performance-optimized UI components)
- **Backend**: Supabase (PostgreSQL database, authentication, storage)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **Language**: TypeScript

## Project Structure

```
jaw-restaurant-app/
├── app/                      # Expo Router screens
│   ├── (auth)/              # Authentication flow
│   ├── (tabs)/              # Main tab navigation
│   ├── (owner)/             # Restaurant owner portal
│   ├── restaurant/          # Restaurant details
│   └── booking/             # Booking flow
├── src/
│   ├── components/          # Reusable UI components
│   ├── services/            # External service integration
│   ├── domain/              # Business logic layer
│   ├── lib/                 # Utilities, hooks, helpers
│   ├── constants/           # App constants and theme
│   └── types/               # TypeScript types
└── supabase/
    ├── migrations/          # Database schema migrations
    └── seeds/               # Sample data
```

## Getting Started

### Prerequisites

- Node.js (v20.19.3 or higher)
- npm or yarn
- Expo Go app (for testing on physical devices)
- Supabase account

### Environment Setup

1. Copy `.env.example` to `.env` and add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

2. Set up your Supabase project:
   - Create a new project at https://supabase.com
   - Run the migrations in `supabase/migrations/` in order
   - Configure storage buckets for restaurant images, review images, and stories

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Web**: Press `w` in the terminal
- **Physical Device**: Scan the QR code with Expo Go app

## Database Schema

The app uses the following main tables:
- `users` - User profiles and authentication
- `restaurants` - Restaurant information and details
- `bookings` - Table reservations
- `reviews` - User reviews and ratings
- `stories` - Time-limited restaurant stories
- `favorites` - User's favorite restaurants
- `menu_items` - Restaurant menu items

## Architecture

The app follows Clean Architecture principles with clear separation of concerns:

- **Presentation Layer**: React components and screens
- **Domain Layer**: Business logic and use cases
- **Data Layer**: Services for external APIs and database

## Contributing

This project is currently in development. More features and improvements coming soon!

## License

Private - All rights reserved

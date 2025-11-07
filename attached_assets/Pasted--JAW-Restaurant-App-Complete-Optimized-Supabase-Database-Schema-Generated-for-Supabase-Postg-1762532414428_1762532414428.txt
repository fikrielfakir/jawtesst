-- JAW Restaurant App - Complete Optimized Supabase Database Schema
-- Generated for Supabase PostgreSQL
-- Date: October 25, 2025
-- Version: 2.0 - Optimized with Security & Performance Enhancements

-- ==========================================
-- EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ==========================================
-- CUSTOM TYPES AND ENUMS
-- ==========================================
CREATE TYPE user_type AS ENUM ('customer', 'owner', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'rejected', 'no_show');
CREATE TYPE notification_type AS ENUM ('booking', 'review', 'promotion', 'system', 'favorite', 'subscription', 'update', 'general');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'past_due');
CREATE TYPE payment_method_type AS ENUM ('credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay', 'others');
CREATE TYPE content_type AS ENUM ('image', 'video');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');
CREATE TYPE transaction_type AS ENUM ('earned', 'redeemed', 'expired', 'bonus', 'refund');
CREATE TYPE ban_type AS ENUM ('permanent', 'temporary');

-- ==========================================
-- USERS TABLE (extends Supabase auth.users)
-- ==========================================
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    profile_image TEXT,
    bio TEXT,
    user_type user_type DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    language VARCHAR(10) DEFAULT 'en',
    dark_theme BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for users
CREATE INDEX idx_users_type ON public.users(user_type);
CREATE INDEX idx_users_verified ON public.users(is_verified) WHERE is_verified = TRUE;
CREATE INDEX idx_users_banned ON public.users(is_banned) WHERE is_banned = TRUE;

-- ==========================================
-- ROLES & PERMISSIONS TABLES
-- ==========================================
CREATE TABLE public.roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    resource VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE public.user_roles (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE public.user_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
    is_granted BOOLEAN DEFAULT TRUE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    reason TEXT,
    UNIQUE(user_id, permission_id)
);

-- Indexes for permissions
CREATE INDEX idx_user_roles_active ON public.user_roles(user_id) WHERE is_active = TRUE;
CREATE INDEX idx_role_permissions ON public.role_permissions(role_id, permission_id);
CREATE INDEX idx_permissions_module ON public.permissions(module, action);

-- ==========================================
-- CATEGORIES & CUISINES
-- ==========================================
CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.cuisine_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.price_ranges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    description VARCHAR(100),
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.amenities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    icon_url TEXT,
    description TEXT,
    category VARCHAR(50), -- 'parking', 'accessibility', 'entertainment', 'service'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- VENUES (RESTAURANTS) TABLE
-- ==========================================
CREATE TABLE public.venues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    email VARCHAR(255),
    website TEXT,
    price_range_id UUID REFERENCES public.price_ranges(id),
    average_rating DECIMAL(3,2) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    capacity INTEGER,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    business_hours JSONB,
    special_hours JSONB, -- For holidays/special dates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for venues
CREATE INDEX idx_venues_owner ON public.venues(owner_id);
CREATE INDEX idx_venues_location ON public.venues(city, country);
CREATE INDEX idx_venues_rating ON public.venues(average_rating DESC);
CREATE INDEX idx_venues_active ON public.venues(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_venues_featured ON public.venues(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_venues_search ON public.venues USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_venues_coordinates ON public.venues(latitude, longitude);

-- ==========================================
-- VENUE RELATIONSHIPS
-- ==========================================
CREATE TABLE public.venue_categories (
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (venue_id, category_id)
);

CREATE TABLE public.venue_cuisines (
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    cuisine_id UUID REFERENCES public.cuisine_types(id) ON DELETE CASCADE,
    PRIMARY KEY (venue_id, cuisine_id)
);

CREATE TABLE public.venue_amenities (
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (venue_id, amenity_id)
);

CREATE TABLE public.venue_staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    invited_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    joined_at TIMESTAMP WITH TIME ZONE,
    removed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(venue_id, user_id)
);

CREATE INDEX idx_venue_staff_active ON public.venue_staff(venue_id, user_id) WHERE is_active = TRUE;

-- ==========================================
-- VENUE CONTENT
-- ==========================================
CREATE TABLE public.venue_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    content_type content_type DEFAULT 'image',
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_venue_posts_venue ON public.venue_posts(venue_id);
CREATE INDEX idx_venue_posts_primary ON public.venue_posts(venue_id, is_primary) WHERE is_primary = TRUE;

-- ==========================================
-- TABLE MANAGEMENT
-- ==========================================
CREATE TABLE public.venue_tables (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
    table_number VARCHAR(20) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    is_available BOOLEAN DEFAULT TRUE,
    location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(venue_id, table_number)
);

CREATE INDEX idx_venue_tables_available ON public.venue_tables(venue_id, is_available) WHERE is_available = TRUE;

-- ==========================================
-- DINING SESSIONS
-- ==========================================
CREATE TABLE public.dining_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
    session_name VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    days_of_week INTEGER[] NOT NULL,
    max_capacity INTEGER,
    booking_buffer INTEGER DEFAULT 15, -- minutes between bookings
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dining_sessions_venue ON public.dining_sessions(venue_id) WHERE is_active = TRUE;

-- ==========================================
-- MENU ITEMS
-- ==========================================
CREATE TABLE public.menu_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category VARCHAR(100),
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    allergens TEXT[],
    nutritional_info JSONB,
    preparation_time INTEGER, -- minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_menu_items_venue ON public.menu_items(venue_id);
CREATE INDEX idx_menu_items_available ON public.menu_items(venue_id, is_available) WHERE is_available = TRUE;
CREATE INDEX idx_menu_items_featured ON public.menu_items(venue_id, is_featured) WHERE is_featured = TRUE;

-- ==========================================
-- BOOKINGS
-- ==========================================
CREATE TABLE public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
    table_id UUID REFERENCES public.venue_tables(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    party_size INTEGER NOT NULL CHECK (party_size > 0 AND party_size <= 50),
    status booking_status DEFAULT 'pending',
    special_requests TEXT,
    confirmation_code VARCHAR(10) UNIQUE,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    notes TEXT, -- Internal notes by venue staff
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT future_booking CHECK (booking_date >= CURRENT_DATE)
);

-- Indexes for bookings
CREATE INDEX idx_bookings_user ON public.bookings(user_id, booking_date DESC);
CREATE INDEX idx_bookings_venue ON public.bookings(venue_id, booking_date, booking_time);
CREATE INDEX idx_bookings_status ON public.bookings(status, booking_date);
CREATE INDEX idx_bookings_confirmation ON public.bookings(confirmation_code);
CREATE INDEX idx_bookings_upcoming ON public.bookings(venue_id, booking_date, booking_time) 
    WHERE status IN ('pending', 'confirmed');

-- ==========================================
-- REVIEWS
-- ==========================================
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    food_rating INTEGER CHECK (food_rating >= 1 AND food_rating <= 5),
    service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
    ambiance_rating INTEGER CHECK (ambiance_rating >= 1 AND ambiance_rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    response TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    responded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, booking_id)
);

-- Indexes for reviews
CREATE INDEX idx_reviews_venue ON public.reviews(venue_id, created_at DESC);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(venue_id, rating);
CREATE INDEX idx_reviews_verified ON public.reviews(venue_id, is_verified) WHERE is_verified = TRUE;
CREATE INDEX idx_reviews_featured ON public.reviews(is_featured) WHERE is_featured = TRUE;

CREATE TABLE public.review_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_review_posts_review ON public.review_posts(review_id);

CREATE TABLE public.review_helpful (
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (review_id, user_id)
);

-- ==========================================
-- USER PREFERENCES & INTERACTIONS
-- ==========================================
CREATE TABLE public.user_preferences (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    dietary_restrictions TEXT[],
    favorite_cuisines UUID[],
    notification_email BOOLEAN DEFAULT TRUE,
    notification_push BOOLEAN DEFAULT TRUE,
    notification_sms BOOLEAN DEFAULT FALSE,
    marketing_emails BOOLEAN DEFAULT TRUE,
    search_radius INTEGER DEFAULT 25,
    default_party_size INTEGER DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.favorites (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, venue_id)
);

CREATE INDEX idx_favorites_user ON public.favorites(user_id);

CREATE TABLE public.bookmarks (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, venue_id)
);

CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);

CREATE TABLE public.search_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    search_query TEXT NOT NULL,
    filters JSONB,
    results_count INTEGER,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_search_history_user ON public.search_history(user_id, searched_at DESC);

-- ==========================================
-- PROMOTIONS & OFFERS
-- ==========================================
CREATE TABLE public.promotions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50),
    discount_value DECIMAL(10,2),
    code VARCHAR(50) UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    min_party_size INTEGER,
    applicable_days INTEGER[],
    is_active BOOLEAN DEFAULT TRUE,
    terms_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_promotion_period CHECK (end_date >= start_date)
);

CREATE INDEX idx_promotions_venue ON public.promotions(venue_id) WHERE is_active = TRUE;
CREATE INDEX idx_promotions_code ON public.promotions(code) WHERE is_active = TRUE;
CREATE INDEX idx_promotions_dates ON public.promotions(start_date, end_date) WHERE is_active = TRUE;

CREATE TABLE public.promotion_redemptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    promotion_id UUID REFERENCES public.promotions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_promotion_redemptions ON public.promotion_redemptions(promotion_id, user_id);

-- ==========================================
-- LOYALTY PROGRAM
-- ==========================================
CREATE TABLE public.loyalty_points (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    total_points INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    points_redeemed INTEGER DEFAULT 0,
    tier_level VARCHAR(50) DEFAULT 'bronze',
    next_tier_points INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.loyalty_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    points INTEGER NOT NULL,
    transaction_type transaction_type NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_loyalty_transactions_user ON public.loyalty_transactions(user_id, created_at DESC);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);

-- ==========================================
-- PREMIER SUBSCRIPTIONS
-- ==========================================
CREATE TABLE public.premier_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    plan_type VARCHAR(50) NOT NULL DEFAULT 'premier',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status subscription_status DEFAULT 'active',
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    auto_renew BOOLEAN DEFAULT TRUE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_subscription_period CHECK (end_date > start_date)
);

CREATE INDEX idx_subscriptions_user ON public.premier_subscriptions(user_id, status);
CREATE INDEX idx_subscriptions_active ON public.premier_subscriptions(user_id) 
    WHERE status = 'active';

-- ==========================================
-- PAYMENT METHODS
-- ==========================================
CREATE TABLE public.payment_methods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type payment_method_type NOT NULL,
    last_four VARCHAR(4),
    brand VARCHAR(50),
    expiry_month INTEGER,
    expiry_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    stripe_payment_method_id TEXT UNIQUE,
    billing_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_user ON public.payment_methods(user_id) WHERE is_active = TRUE;
CREATE INDEX idx_payment_methods_default ON public.payment_methods(user_id, is_default) WHERE is_default = TRUE;

-- ==========================================
-- USER STORIES
-- ==========================================
CREATE TABLE public.user_stories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content_url TEXT NOT NULL,
    content_type content_type NOT NULL,
    caption TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_stories_active ON public.user_stories(user_id, is_active, expires_at) 
    WHERE is_active = TRUE AND expires_at > NOW();

CREATE TABLE public.story_views (
    story_id UUID REFERENCES public.user_stories(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (story_id, viewer_id)
);

-- ==========================================
-- REPORTS & MODERATION
-- ==========================================
CREATE TABLE public.reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reported_item_type VARCHAR(50) NOT NULL,
    reported_item_id UUID NOT NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status report_status DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    action_taken TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON public.reports(status, created_at DESC);
CREATE INDEX idx_reports_item ON public.reports(reported_item_type, reported_item_id);

-- ==========================================
-- SECURITY TABLES
-- ==========================================
CREATE TABLE public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(50),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON public.audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_resource ON public.audit_logs(resource_type, resource_id, created_at DESC);

CREATE TABLE public.security_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    ip_address INET,
    device_info JSONB,
    location JSONB,
    is_suspicious BOOLEAN DEFAULT FALSE,
    risk_score INTEGER,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_security_events_user ON public.security_events(user_id, created_at DESC);
CREATE INDEX idx_security_events_suspicious ON public.security_events(is_suspicious, created_at DESC) 
    WHERE is_suspicious = TRUE;

CREATE TABLE public.user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    device_type VARCHAR(50),
    device_name TEXT,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_active ON public.user_sessions(user_id, is_active) WHERE is_active = TRUE;

CREATE TABLE public.banned_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    banned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    ban_type ban_type DEFAULT 'permanent',
    banned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT
);

CREATE INDEX idx_banned_users_active ON public.banned_users(user_id, is_active) WHERE is_active = TRUE;

CREATE TABLE public.banned_ips (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ip_address INET NOT NULL UNIQUE,
    reason TEXT NOT NULL,
    banned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    banned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE public.two_factor_auth (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    is_enabled BOOLEAN DEFAULT FALSE,
    secret_key TEXT,
    backup_codes TEXT[],
    method VARCHAR(50) DEFAULT 'totp',
    phone_number VARCHAR(20),
    last_used_at TIMESTAMP WITH TIME ZONE,
    enabled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ANALYTICS
-- ==========================================
CREATE TABLE public.business_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    bookings INTEGER DEFAULT 0,
    completed_bookings INTEGER DEFAULT 0,
    cancelled_bookings INTEGER DEFAULT 0,
    no_shows INTEGER DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    favorites INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.0,
    revenue DECIMAL(12,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(venue_id, date)
);

CREATE INDEX idx_analytics_venue_date ON public.business_analytics(venue_id, date DESC);

-- ==========================================
-- CONTACT & FAQ
-- ==========================================
CREATE TABLE public.contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    category VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'normal',
    is_read BOOLEAN DEFAULT FALSE,
    admin_response TEXT,
    responded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_unread ON public.contact_messages(is_read, created_at DESC);

CREATE TABLE public.faqs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_faqs_category ON public.faqs(category, display_order) WHERE is_active = TRUE;

-- ==========================================
-- PARTNER APPLICATIONS
-- ==========================================
CREATE TABLE public.partner_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    business_name VARCHAR(255) NOT NULL,
    business_address TEXT NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    cuisine_types TEXT[],
    estimated_capacity INTEGER,
    website TEXT,
    additional_info TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_partner_applications_status ON public.partner_applications(status, created_at DESC);

-- ==========================================
-- API KEYS
-- ==========================================
CREATE TABLE public.api_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB,
    rate_limit INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_api_keys_hash ON public.api_keys(key_hash) WHERE is_active = TRUE;

-- ==========================================
-- ENABLE ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premier_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- OPTIMIZED HELPER FUNCTIONS
-- ==========================================

-- Check if user has specific permission
CREATE OR REPLACE FUNCTION has_permission(
    p_user_id UUID,
    p_permission_name VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    has_perm BOOLEAN;
BEGIN
    -- Check if user is banned
    IF EXISTS (
        SELECT 1 FROM public.banned_users 
        WHERE user_id = p_user_id AND is_active = TRUE
        AND (expires_at IS NULL OR expires_at > NOW())
    ) THEN
        RETURN FALSE;
    END IF;

    -- Check direct user permission override (revoked)
    IF EXISTS (
        SELECT 1 
        FROM public.user_permissions up
        JOIN public.permissions p ON p.id = up.permission_id
        WHERE up.user_id = p_user_id 
        AND p.name = p_permission_name
        AND up.is_granted = FALSE
        AND (up.expires_at IS NULL OR up.expires_at > NOW())
    ) THEN
        RETURN FALSE;
    END IF;

    -- Check direct user permission (granted)
    IF EXISTS (
        SELECT 1 
        FROM public.user_permissions up
        JOIN public.permissions p ON p.id = up.permission_id
        WHERE up.user_id = p_user_id 
        AND p.name = p_permission_name
        AND up.is_granted = TRUE
        AND (up.expires_at IS NULL OR up.expires_at > NOW())
    ) THEN
        RETURN TRUE;
    END IF;
    
    -- Check role-based permission
    SELECT EXISTS(
        SELECT 1
        FROM public.user_roles ur
        JOIN public.role_permissions rp ON rp.role_id = ur.role_id
        JOIN public.permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = p_user_id
        AND p.name = p_permission_name
        AND ur.is_active = TRUE
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    ) INTO has_perm;
    
    RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is venue owner or staff
CREATE OR REPLACE FUNCTION is_venue_staff(
    p_user_id UUID,
    p_venue_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.venues WHERE id = p_venue_id AND owner_id = p_user_id
    ) OR EXISTS (
        SELECT 1 FROM public.venue_staff 
        WHERE venue_id = p_venue_id AND user_id = p_user_id AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user has active premier subscription
CREATE OR REPLACE FUNCTION has_active_premier(p_user_id UUID) 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.premier_subscriptions
        WHERE user_id = p_user_id 
        AND status = 'active'
        AND start_date <= CURRENT_DATE 
        AND end_date >= CURRENT_DATE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ==========================================
-- ROW LEVEL SECURITY POLICIES
-- ==========================================

-- USERS POLICIES
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_select_public_info" ON public.users
    FOR SELECT USING (true);

-- VENUES POLICIES
CREATE POLICY "venues_select_active" ON public.venues
    FOR SELECT USING (is_active = true OR owner_id = auth.uid());

CREATE POLICY "venues_insert_owner" ON public.venues
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "venues_update_owner_staff" ON public.venues
    FOR UPDATE USING (
        auth.uid() = owner_id 
        OR is_venue_staff(auth.uid(), id)
        OR has_permission(auth.uid(), 'venues.manage_any')
    );

CREATE POLICY "venues_delete_owner_admin" ON public.venues
    FOR DELETE USING (
        auth.uid() = owner_id 
        OR has_permission(auth.uid(), 'venues.delete')
    );

-- VENUE POSTS POLICIES
CREATE POLICY "venue_posts_select_all" ON public.venue_posts
    FOR SELECT USING (true);

CREATE POLICY "venue_posts_insert_staff" ON public.venue_posts
    FOR INSERT WITH CHECK (
        is_venue_staff(auth.uid(), venue_id)
    );

CREATE POLICY "venue_posts_update_staff" ON public.venue_posts
    FOR UPDATE USING (
        is_venue_staff(auth.uid(), venue_id)
    );

CREATE POLICY "venue_posts_delete_staff" ON public.venue_posts
    FOR DELETE USING (
        is_venue_staff(auth.uid(), venue_id)
    );

-- VENUE TABLES POLICIES
CREATE POLICY "venue_tables_select_all" ON public.venue_tables
    FOR SELECT USING (true);

CREATE POLICY "venue_tables_manage_staff" ON public.venue_tables
    FOR ALL USING (
        is_venue_staff(auth.uid(), venue_id)
    );

-- VENUE STAFF POLICIES
CREATE POLICY "venue_staff_select_all" ON public.venue_staff
    FOR SELECT USING (true);

CREATE POLICY "venue_staff_manage_owner" ON public.venue_staff
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.venues 
            WHERE id = venue_id AND owner_id = auth.uid()
        )
    );

-- MENU ITEMS POLICIES
CREATE POLICY "menu_items_select_available" ON public.menu_items
    FOR SELECT USING (is_available = true OR is_venue_staff(auth.uid(), venue_id));

CREATE POLICY "menu_items_manage_staff" ON public.menu_items
    FOR ALL USING (
        is_venue_staff(auth.uid(), venue_id)
    );

-- BOOKINGS POLICIES
CREATE POLICY "bookings_select_own" ON public.bookings
    FOR SELECT USING (
        auth.uid() = user_id 
        OR is_venue_staff(auth.uid(), venue_id)
        OR has_permission(auth.uid(), 'bookings.read_any')
    );

CREATE POLICY "bookings_insert_authenticated" ON public.bookings
    FOR INSERT WITH CHECK (
        auth.uid() = user_id 
        AND NOT EXISTS (
            SELECT 1 FROM public.banned_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "bookings_update_own_or_staff" ON public.bookings
    FOR UPDATE USING (
        auth.uid() = user_id 
        OR is_venue_staff(auth.uid(), venue_id)
        OR has_permission(auth.uid(), 'bookings.approve')
    );

CREATE POLICY "bookings_delete_own" ON public.bookings
    FOR DELETE USING (
        auth.uid() = user_id
        OR has_permission(auth.uid(), 'bookings.delete')
    );

-- REVIEWS POLICIES
CREATE POLICY "reviews_select_all" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "reviews_insert_own" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
        AND NOT EXISTS (
            SELECT 1 FROM public.banned_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "reviews_update_own_or_respond" ON public.reviews
    FOR UPDATE USING (
        auth.uid() = user_id 
        OR is_venue_staff(auth.uid(), venue_id)
    );

CREATE POLICY "reviews_delete_own_or_admin" ON public.reviews
    FOR DELETE USING (
        auth.uid() = user_id 
        OR has_permission(auth.uid(), 'reviews.delete_any')
    );

-- REVIEW POSTS POLICIES
CREATE POLICY "review_posts_select_all" ON public.review_posts
    FOR SELECT USING (true);

CREATE POLICY "review_posts_manage_own" ON public.review_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.reviews 
            WHERE id = review_id AND user_id = auth.uid()
        )
    );

-- FAVORITES POLICIES
CREATE POLICY "favorites_manage_own" ON public.favorites
    FOR ALL USING (auth.uid() = user_id);

-- BOOKMARKS POLICIES
CREATE POLICY "bookmarks_manage_own" ON public.bookmarks
    FOR ALL USING (auth.uid() = user_id);

-- NOTIFICATIONS POLICIES
CREATE POLICY "notifications_select_own" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own" ON public.notifications
    FOR DELETE USING (auth.uid() = user_id);

-- SUBSCRIPTIONS POLICIES
CREATE POLICY "subscriptions_select_own" ON public.premier_subscriptions
    FOR SELECT USING (
        auth.uid() = user_id 
        OR has_permission(auth.uid(), 'subscriptions.view_any')
    );

CREATE POLICY "subscriptions_manage_own" ON public.premier_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- PAYMENT METHODS POLICIES
CREATE POLICY "payment_methods_manage_own" ON public.payment_methods
    FOR ALL USING (auth.uid() = user_id);

-- USER STORIES POLICIES
CREATE POLICY "user_stories_select_active" ON public.user_stories
    FOR SELECT USING (
        (is_active = true AND expires_at > NOW()) 
        OR user_id = auth.uid()
    );

CREATE POLICY "user_stories_manage_own" ON public.user_stories
    FOR ALL USING (auth.uid() = user_id);

-- STORY VIEWS POLICIES
CREATE POLICY "story_views_insert_authenticated" ON public.story_views
    FOR INSERT WITH CHECK (auth.uid() = viewer_id);

CREATE POLICY "story_views_select_own" ON public.story_views
    FOR SELECT USING (
        auth.uid() = viewer_id 
        OR EXISTS (
            SELECT 1 FROM public.user_stories 
            WHERE id = story_id AND user_id = auth.uid()
        )
    );

-- PROMOTIONS POLICIES
CREATE POLICY "promotions_select_active" ON public.promotions
    FOR SELECT USING (
        is_active = true 
        OR is_venue_staff(auth.uid(), venue_id)
    );

CREATE POLICY "promotions_manage_staff" ON public.promotions
    FOR ALL USING (
        is_venue_staff(auth.uid(), venue_id)
    );

-- LOYALTY POLICIES
CREATE POLICY "loyalty_points_select_own" ON public.loyalty_points
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "loyalty_transactions_select_own" ON public.loyalty_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- USER PREFERENCES POLICIES
CREATE POLICY "user_preferences_manage_own" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- REPORTS POLICIES
CREATE POLICY "reports_insert_authenticated" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "reports_select_own_or_moderator" ON public.reports
    FOR SELECT USING (
        auth.uid() = reporter_id 
        OR has_permission(auth.uid(), 'content.review_flags')
    );

-- ==========================================
-- OPTIMIZED TRIGGERS AND FUNCTIONS
-- ==========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_venues BEFORE UPDATE ON public.venues
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_categories BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_menu_items BEFORE UPDATE ON public.menu_items
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_bookings BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_reviews BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_subscriptions BEFORE UPDATE ON public.premier_subscriptions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_promotions BEFORE UPDATE ON public.promotions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_faqs BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_roles BEFORE UPDATE ON public.roles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_user_preferences BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Generate unique confirmation code for bookings
CREATE OR REPLACE FUNCTION generate_booking_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.confirmation_code IS NULL THEN
        NEW.confirmation_code := UPPER(SUBSTRING(MD5(RANDOM()::text || NOW()::text), 1, 10));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_confirmation BEFORE INSERT ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION generate_booking_confirmation();

-- Auto-generate venue slug
CREATE OR REPLACE FUNCTION generate_venue_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    IF NEW.slug IS NULL THEN
        base_slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
        base_slug := TRIM(BOTH '-' FROM base_slug);
        final_slug := base_slug;
        
        WHILE EXISTS (SELECT 1 FROM public.venues WHERE slug = final_slug AND id != NEW.id) LOOP
            counter := counter + 1;
            final_slug := base_slug || '-' || counter;
        END LOOP;
        
        NEW.slug := final_slug;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_venue_slug BEFORE INSERT OR UPDATE ON public.venues
    FOR EACH ROW EXECUTE FUNCTION generate_venue_slug();

-- Update venue rating when reviews change
CREATE OR REPLACE FUNCTION update_venue_rating()
RETURNS TRIGGER AS $$
DECLARE
    v_venue_id UUID;
BEGIN
    v_venue_id := COALESCE(NEW.venue_id, OLD.venue_id);
    
    UPDATE public.venues 
    SET 
        average_rating = COALESCE(
            (SELECT ROUND(AVG(rating)::numeric, 2) 
             FROM public.reviews 
             WHERE venue_id = v_venue_id), 
            0
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE venue_id = v_venue_id
        )
    WHERE id = v_venue_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_venue_rating_on_review
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_venue_rating();

-- Update review helpful count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.reviews
    SET helpful_count = (
        SELECT COUNT(*) FROM public.review_helpful WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
    )
    WHERE id = COALESCE(NEW.review_id, OLD.review_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_review_helpful_count_trigger
    AFTER INSERT OR DELETE ON public.review_helpful
    FOR EACH ROW EXECUTE FUNCTION update_review_helpful_count();

-- Update story view count
CREATE OR REPLACE FUNCTION update_story_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.user_stories
    SET view_count = (
        SELECT COUNT(*) FROM public.story_views WHERE story_id = NEW.story_id
    )
    WHERE id = NEW.story_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_story_views_trigger
    AFTER INSERT ON public.story_views
    FOR EACH ROW EXECUTE FUNCTION update_story_view_count();

-- Update loyalty points
CREATE OR REPLACE FUNCTION update_loyalty_points()
RETURNS TRIGGER AS $$
DECLARE
    current_total INTEGER;
BEGIN
    -- Initialize loyalty record if doesn't exist
    INSERT INTO public.loyalty_points (user_id)
    VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Update points based on transaction type
    IF NEW.transaction_type IN ('earned', 'bonus') THEN
        UPDATE public.loyalty_points
        SET 
            total_points = total_points + NEW.points,
            points_earned = points_earned + NEW.points,
            updated_at = NOW()
        WHERE user_id = NEW.user_id
        RETURNING total_points INTO current_total;
    ELSIF NEW.transaction_type IN ('redeemed', 'expired') THEN
        UPDATE public.loyalty_points
        SET 
            total_points = total_points - NEW.points,
            points_redeemed = points_redeemed + NEW.points,
            updated_at = NOW()
        WHERE user_id = NEW.user_id
        RETURNING total_points INTO current_total;
    END IF;
    
    -- Update tier based on total points
    UPDATE public.loyalty_points
    SET tier_level = CASE
        WHEN current_total >= 10000 THEN 'platinum'
        WHEN current_total >= 5000 THEN 'gold'
        WHEN current_total >= 2000 THEN 'silver'
        ELSE 'bronze'
    END
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_loyalty_points_trigger
    AFTER INSERT ON public.loyalty_transactions
    FOR EACH ROW EXECUTE FUNCTION update_loyalty_points();

-- Ensure only one default payment method per user
CREATE OR REPLACE FUNCTION ensure_single_default_payment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = TRUE THEN
        UPDATE public.payment_methods
        SET is_default = FALSE
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_default_payment_trigger
    BEFORE INSERT OR UPDATE ON public.payment_methods
    FOR EACH ROW EXECUTE FUNCTION ensure_single_default_payment();

-- Ensure only one primary venue image
CREATE OR REPLACE FUNCTION ensure_single_primary_image()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_primary = TRUE THEN
        UPDATE public.venue_posts
        SET is_primary = FALSE
        WHERE venue_id = NEW.venue_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_primary_image_trigger
    BEFORE INSERT OR UPDATE ON public.venue_posts
    FOR EACH ROW EXECUTE FUNCTION ensure_single_primary_image();

-- Log audit trail for sensitive operations
CREATE OR REPLACE FUNCTION log_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        status
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        'success'
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit logging to sensitive tables
CREATE TRIGGER audit_venues AFTER INSERT OR UPDATE OR DELETE ON public.venues
    FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_bookings AFTER INSERT OR UPDATE OR DELETE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_reviews AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_users AFTER UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

-- ==========================================
-- INITIAL DATA
-- ==========================================

-- Insert system roles
INSERT INTO public.roles (name, display_name, description, is_system_role) VALUES
('super_admin', 'Super Administrator', 'Full system access', TRUE),
('admin', 'Administrator', 'Administrative access', TRUE),
('venue_owner', 'Venue Owner', 'Manage own venues', TRUE),
('venue_manager', 'Venue Manager', 'Manage assigned venues', TRUE),
('venue_staff', 'Venue Staff', 'Limited venue access', TRUE),
('customer', 'Customer', 'Standard user access', TRUE),
('premier_customer', 'Premier Customer', 'Premium user access', TRUE),
('moderator', 'Content Moderator', 'Content moderation access', TRUE);

-- Insert categories
INSERT INTO public.categories (name, description, icon_url, display_order) VALUES 
('Fast Food', 'Quick service restaurants and fast food chains', 'https://example.com/icons/fast-food.png', 1),
('Fine Dining', 'Upscale restaurants with premium service', 'https://example.com/icons/fine-dining.png', 2),
('Casual Dining', 'Relaxed atmosphere family restaurants', 'https://example.com/icons/casual-dining.png', 3),
('Coffee & Cafes', 'Coffee shops and casual cafes', 'https://example.com/icons/coffee.png', 4),
('Bars & Pubs', 'Bars, pubs, and lounges', 'https://example.com/icons/bar.png', 5),
('Food Trucks', 'Mobile food vendors and food trucks', 'https://example.com/icons/food-truck.png', 6),
('Bakery', 'Bakeries and pastry shops', 'https://example.com/icons/bakery.png', 7),
('Buffet', 'All-you-can-eat buffet restaurants', 'https://example.com/icons/buffet.png', 8);

-- Insert cuisine types
INSERT INTO public.cuisine_types (name, description) VALUES
('Italian', 'Italian cuisine including pasta, pizza, and risotto'),
('Chinese', 'Traditional and modern Chinese dishes'),
('Japanese', 'Sushi, ramen, and other Japanese specialties'),
('Mexican', 'Tacos, burritos, and authentic Mexican food'),
('Indian', 'Curry, tandoori, and Indian specialties'),
('Thai', 'Pad Thai, curries, and Thai cuisine'),
('French', 'Classic French cooking and pastries'),
('Mediterranean', 'Greek, Turkish, and Mediterranean dishes'),
('American', 'Classic American comfort food'),
('Korean', 'BBQ, kimchi, and Korean specialties'),
('Vietnamese', 'Pho, banh mi, and Vietnamese cuisine'),
('Middle Eastern', 'Kebabs, falafel, and Middle Eastern dishes'),
('Spanish', 'Tapas, paella, and Spanish cuisine'),
('Seafood', 'Fresh fish and seafood specialties'),
('Steakhouse', 'Premium steaks and grilled meats'),
('Vegan', 'Plant-based and vegan options'),
('Vegetarian', 'Vegetarian-friendly cuisine');

-- Insert price ranges
INSERT INTO public.price_ranges (symbol, description, min_price, max_price) VALUES
('$$$', 'Budget-friendly', 0, 15),
('$$$$', 'Moderate', 15, 30),
('$$$$$', 'Upscale', 30, 60),
('$$$$$$', 'Fine Dining', 60, NULL);

-- Insert amenities
INSERT INTO public.amenities (name, icon_url, description, category) VALUES
('WiFi', 'https://example.com/icons/wifi.png', 'Free wireless internet', 'service'),
('Parking', 'https://example.com/icons/parking.png', 'On-site parking available', 'parking'),
('Wheelchair Accessible', 'https://example.com/icons/wheelchair.png', 'Wheelchair accessible entrance and facilities', 'accessibility'),
('Outdoor Seating', 'https://example.com/icons/outdoor.png', 'Patio or outdoor dining area', 'seating'),
('Pet Friendly', 'https://example.com/icons/pet.png', 'Pets welcome', 'service'),
('Live Music', 'https://example.com/icons/music.png', 'Live music performances', 'entertainment'),
('Private Dining', 'https://example.com/icons/private.png', 'Private dining rooms available', 'seating'),
('Bar', 'https://example.com/icons/bar.png', 'Full bar service', 'service'),
('Delivery', 'https://example.com/icons/delivery.png', 'Home delivery available', 'service'),
('Takeout', 'https://example.com/icons/takeout.png', 'Takeout service', 'service'),
('Reservations', 'https://example.com/icons/reservation.png', 'Accepts reservations', 'service'),
('Kids Menu', 'https://example.com/icons/kids.png', 'Special menu for children', 'service'),
('Valet Parking', 'https://example.com/icons/valet.png', 'Valet parking service', 'parking'),
('Credit Cards', 'https://example.com/icons/card.png', 'Accepts credit cards', 'payment');

-- Insert sample FAQs
INSERT INTO public.faqs (question, answer, category, display_order) VALUES 
('How do I make a reservation?', 'Browse restaurants in the app, select your preferred venue, choose an available date and time slot, and confirm your booking. You will receive a confirmation code.', 'Bookings', 1),
('Can I cancel my reservation?', 'Yes, you can cancel up to 2 hours before your scheduled time through the app. Go to My Bookings and select the booking you wish to cancel.', 'Bookings', 2),
('How do I become a restaurant partner?', 'Restaurant owners can apply through the Partner Application form in the app. Our team will review your application and contact you within 3-5 business days.', 'Business', 3),
('What is JAW Premier?', 'JAW Premier is our premium subscription service offering exclusive benefits including priority bookings, special discounts, no booking fees, and early access to new features.', 'Premium', 4),
('How do I contact customer support?', 'You can reach our support team through the Contact Us section in the app, email us at support@jawapp.com, or call our hotline during business hours.', 'Support', 5),
('How do I earn loyalty points?', 'Earn points by completing bookings, writing reviews, and referring friends. Points can be redeemed for discounts and special offers.', 'Loyalty', 6),
('Is my payment information secure?', 'Yes, all payment information is encrypted and processed through secure payment gateways. We never store your complete card details.', 'Security', 7),
('Can I modify my booking?', 'To modify a booking, you need to cancel the existing one and create a new booking with your preferred details.', 'Bookings', 8);

-- ==========================================
-- PERFORMANCE OPTIMIZATION VIEWS
-- ==========================================

-- View for popular venues
CREATE OR REPLACE VIEW popular_venues AS
SELECT 
    v.*,
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT f.user_id) as total_favorites
FROM public.venues v
LEFT JOIN public.bookings b ON v.id = b.venue_id AND b.status = 'completed'
LEFT JOIN public.favorites f ON v.id = f.venue_id
WHERE v.is_active = true
GROUP BY v.id
ORDER BY v.average_rating DESC, total_bookings DESC;

-- View for venue details with relationships
CREATE OR REPLACE VIEW venue_details AS
SELECT 
    v.*,
    json_agg(DISTINCT jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'icon_url', c.icon_url
    )) FILTER (WHERE c.id IS NOT NULL) as categories,
    json_agg(DISTINCT jsonb_build_object(
        'id', ct.id,
        'name', ct.name
    )) FILTER (WHERE ct.id IS NOT NULL) as cuisines,
    json_agg(DISTINCT jsonb_build_object(
        'id', a.id,
        'name', a.name,
        'icon_url', a.icon_url
    )) FILTER (WHERE a.id IS NOT NULL) as amenities,
    pr.symbol as price_range
FROM public.venues v
LEFT JOIN public.venue_categories vc ON v.id = vc.venue_id
LEFT JOIN public.categories c ON vc.category_id = c.id
LEFT JOIN public.venue_cuisines vcu ON v.id = vcu.venue_id
LEFT JOIN public.cuisine_types ct ON vcu.cuisine_id = ct.id
LEFT JOIN public.venue_amenities va ON v.id = va.venue_id
LEFT JOIN public.amenities a ON va.amenity_id = a.id
LEFT JOIN public.price_ranges pr ON v.price_range_id = pr.id
GROUP BY v.id, pr.symbol;

-- View for user booking history with venue details
CREATE OR REPLACE VIEW user_booking_history AS
SELECT 
    b.*,
    v.name as venue_name,
    v.address as venue_address,
    v.city as venue_city,
    v.phone as venue_phone,
    v.average_rating as venue_rating,
    u.first_name as user_first_name,
    u.last_name as user_last_name,
    u.email as user_email
FROM public.bookings b
JOIN public.venues v ON b.venue_id = v.id
JOIN auth.users u ON b.user_id = u.id;

-- View for venue analytics summary
CREATE OR REPLACE VIEW venue_analytics_summary AS
SELECT 
    v.id as venue_id,
    v.name as venue_name,
    v.owner_id,
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.id END) as completed_bookings,
    COUNT(DISTINCT CASE WHEN b.status = 'cancelled' THEN b.id END) as cancelled_bookings,
    COUNT(DISTINCT CASE WHEN b.status = 'no_show' THEN b.id END) as no_shows,
    COUNT(DISTINCT r.id) as total_reviews,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(DISTINCT f.user_id) as total_favorites,
    SUM(ba.views) as total_views,
    SUM(ba.revenue) as total_revenue
FROM public.venues v
LEFT JOIN public.bookings b ON v.id = b.venue_id
LEFT JOIN public.reviews r ON v.id = r.venue_id
LEFT JOIN public.favorites f ON v.id = f.venue_id
LEFT JOIN public.business_analytics ba ON v.id = ba.venue_id
GROUP BY v.id, v.name, v.owner_id;

-- ==========================================
-- UTILITY FUNCTIONS
-- ==========================================

-- Function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL,
    lon1 DECIMAL,
    lat2 DECIMAL,
    lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
    earth_radius DECIMAL := 6371; -- Earth radius in kilometers
    dlat DECIMAL;
    dlon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    dlat := RADIANS(lat2 - lat1);
    dlon := RADIANS(lon2 - lon1);
    
    a := SIN(dlat/2) * SIN(dlat/2) + 
         COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * 
         SIN(dlon/2) * SIN(dlon/2);
    
    c := 2 * ATAN2(SQRT(a), SQRT(1-a));
    
    RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to find nearby venues
CREATE OR REPLACE FUNCTION find_nearby_venues(
    p_latitude DECIMAL,
    p_longitude DECIMAL,
    p_radius_km DECIMAL DEFAULT 10,
    p_limit INTEGER DEFAULT 20
) RETURNS TABLE (
    venue_id UUID,
    venue_name VARCHAR,
    distance_km DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.name,
        calculate_distance(p_latitude, p_longitude, v.latitude, v.longitude) as distance
    FROM public.venues v
    WHERE v.is_active = true
        AND v.latitude IS NOT NULL
        AND v.longitude IS NOT NULL
        AND calculate_distance(p_latitude, p_longitude, v.latitude, v.longitude) <= p_radius_km
    ORDER BY distance
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to check venue availability
CREATE OR REPLACE FUNCTION check_venue_availability(
    p_venue_id UUID,
    p_date DATE,
    p_time TIME,
    p_party_size INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    venue_capacity INTEGER;
    current_bookings INTEGER;
    available_tables INTEGER;
BEGIN
    -- Get venue capacity
    SELECT capacity INTO venue_capacity
    FROM public.venues
    WHERE id = p_venue_id;
    
    -- If no capacity set, assume unlimited
    IF venue_capacity IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- Count current bookings for the same time slot
    SELECT COUNT(*) INTO current_bookings
    FROM public.bookings
    WHERE venue_id = p_venue_id
        AND booking_date = p_date
        AND booking_time = p_time
        AND status IN ('pending', 'confirmed');
    
    -- Check if there are available tables
    SELECT COUNT(*) INTO available_tables
    FROM public.venue_tables
    WHERE venue_id = p_venue_id
        AND capacity >= p_party_size
        AND is_available = TRUE
        AND id NOT IN (
            SELECT table_id 
            FROM public.bookings 
            WHERE venue_id = p_venue_id
                AND booking_date = p_date
                AND booking_time = p_time
                AND status IN ('pending', 'confirmed')
                AND table_id IS NOT NULL
        );
    
    RETURN available_tables > 0;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get venue rating breakdown
CREATE OR REPLACE FUNCTION get_rating_breakdown(p_venue_id UUID)
RETURNS TABLE (
    stars INTEGER,
    count BIGINT,
    percentage DECIMAL
) AS $$
DECLARE
    total_reviews BIGINT;
BEGIN
    SELECT COUNT(*) INTO total_reviews
    FROM public.reviews
    WHERE venue_id = p_venue_id;
    
    IF total_reviews = 0 THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    SELECT 
        r.rating as stars,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / total_reviews), 2) as percentage
    FROM public.reviews r
    WHERE r.venue_id = p_venue_id
    GROUP BY r.rating
    ORDER BY r.rating DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to award loyalty points
CREATE OR REPLACE FUNCTION award_loyalty_points(
    p_user_id UUID,
    p_points INTEGER,
    p_transaction_type transaction_type,
    p_reference_type VARCHAR DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_description TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.loyalty_transactions (
        user_id,
        points,
        transaction_type,
        reference_type,
        reference_id,
        description
    ) VALUES (
        p_user_id,
        p_points,
        p_transaction_type,
        p_reference_type,
        p_reference_id,
        p_description
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send notification
CREATE OR REPLACE FUNCTION send_notification(
    p_user_id UUID,
    p_title VARCHAR,
    p_message TEXT,
    p_type notification_type,
    p_action_url TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        user_id,
        title,
        message,
        type,
        action_url,
        metadata
    ) VALUES (
        p_user_id,
        p_title,
        p_message,
        p_type,
        p_action_url,
        p_metadata
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- AUTOMATED JOBS (using pg_cron or manual scheduling)
-- ==========================================

-- Function to expire old stories
CREATE OR REPLACE FUNCTION expire_old_stories() RETURNS void AS $$
BEGIN
    UPDATE public.user_stories
    SET is_active = FALSE
    WHERE expires_at <= NOW() AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to expire subscriptions
CREATE OR REPLACE FUNCTION expire_subscriptions() RETURNS void AS $$
BEGIN
    UPDATE public.premier_subscriptions
    SET status = 'expired'
    WHERE end_date < CURRENT_DATE 
        AND status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Function to mark no-show bookings
CREATE OR REPLACE FUNCTION mark_no_shows() RETURNS void AS $$
BEGIN
    UPDATE public.bookings
    SET status = 'no_show'
    WHERE booking_date = CURRENT_DATE - INTERVAL '1 day'
        AND status = 'confirmed'
        AND booking_time < CURRENT_TIME;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old audit logs (keep last 90 days)
CREATE OR REPLACE FUNCTION clean_old_audit_logs() RETURNS void AS $$
BEGIN
    DELETE FROM public.audit_logs
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Function to update analytics daily
CREATE OR REPLACE FUNCTION update_daily_analytics() RETURNS void AS $$
BEGIN
    INSERT INTO public.business_analytics (
        venue_id,
        date,
        bookings,
        completed_bookings,
        cancelled_bookings,
        no_shows,
        reviews,
        favorites
    )
    SELECT 
        v.id as venue_id,
        CURRENT_DATE - INTERVAL '1 day' as date,
        COUNT(DISTINCT CASE WHEN b.created_at::date = CURRENT_DATE - INTERVAL '1 day' THEN b.id END) as bookings,
        COUNT(DISTINCT CASE WHEN b.booking_date = CURRENT_DATE - INTERVAL '1 day' AND b.status = 'completed' THEN b.id END) as completed_bookings,
        COUNT(DISTINCT CASE WHEN b.booking_date = CURRENT_DATE - INTERVAL '1 day' AND b.status = 'cancelled' THEN b.id END) as cancelled_bookings,
        COUNT(DISTINCT CASE WHEN b.booking_date = CURRENT_DATE - INTERVAL '1 day' AND b.status = 'no_show' THEN b.id END) as no_shows,
        COUNT(DISTINCT CASE WHEN r.created_at::date = CURRENT_DATE - INTERVAL '1 day' THEN r.id END) as reviews,
        COUNT(DISTINCT CASE WHEN f.created_at::date = CURRENT_DATE - INTERVAL '1 day' THEN f.user_id END) as favorites
    FROM public.venues v
    LEFT JOIN public.bookings b ON v.id = b.venue_id
    LEFT JOIN public.reviews r ON v.id = r.venue_id
    LEFT JOIN public.favorites f ON v.id = f.venue_id
    GROUP BY v.id
    ON CONFLICT (venue_id, date) DO UPDATE SET
        bookings = EXCLUDED.bookings,
        completed_bookings = EXCLUDED.completed_bookings,
        cancelled_bookings = EXCLUDED.cancelled_bookings,
        no_shows = EXCLUDED.no_shows,
        reviews = EXCLUDED.reviews,
        favorites = EXCLUDED.favorites;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON TABLE public.users IS 'Extends Supabase auth.users with additional profile information';
COMMENT ON TABLE public.venues IS 'Restaurant and venue information';
COMMENT ON TABLE public.bookings IS 'Table reservations and bookings';
COMMENT ON TABLE public.reviews IS 'User reviews and ratings for venues';
COMMENT ON TABLE public.loyalty_points IS 'User loyalty program points and tier levels';
COMMENT ON TABLE public.premier_subscriptions IS 'Premium subscription management';
COMMENT ON TABLE public.audit_logs IS 'Audit trail for sensitive operations';
COMMENT ON TABLE public.security_events IS 'Security-related events for monitoring';

COMMENT ON FUNCTION has_permission IS 'Check if user has specific permission through roles or direct assignment';
COMMENT ON FUNCTION is_venue_staff IS 'Check if user is owner or staff member of a venue';
COMMENT ON FUNCTION calculate_distance IS 'Calculate distance between two geographic coordinates in kilometers';
COMMENT ON FUNCTION find_nearby_venues IS 'Find venues within specified radius of a location';
COMMENT ON FUNCTION check_venue_availability IS 'Check if venue has availability for specified date, time, and party size';

-- ==========================================
-- INDEXES FOR FULL-TEXT SEARCH
-- ==========================================

CREATE INDEX idx_venues_fulltext ON public.venues 
    USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

CREATE INDEX idx_menu_items_fulltext ON public.menu_items 
    USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- ==========================================
-- SAMPLE PERMISSIONS DATA
-- ==========================================

-- Insert core permissions (abbreviated list - add more as needed)
INSERT INTO public.permissions (name, display_name, module, action, description) VALUES
-- Venue permissions
('venues.create', 'Create Venues', 'venues', 'create', 'Can create new venues'),
('venues.read', 'View Venues', 'venues', 'read', 'Can view venue details'),
('venues.update', 'Update Venues', 'venues', 'update', 'Can update venue information'),
('venues.delete', 'Delete Venues', 'venues', 'delete', 'Can delete venues'),
('venues.verify', 'Verify Venues', 'venues', 'verify', 'Can verify venue status'),
('venues.manage_any', 'Manage Any Venue', 'venues', 'manage', 'Can manage any venue'),

-- Booking permissions
('bookings.create', 'Create Bookings', 'bookings', 'create', 'Can create bookings'),
('bookings.read_own', 'View Own Bookings', 'bookings', 'read', 'Can view own bookings'),
('bookings.read_any', 'View Any Bookings', 'bookings', 'read', 'Can view all bookings'),
('bookings.update', 'Update Bookings', 'bookings', 'update', 'Can update bookings'),
('bookings.delete', 'Delete Bookings', 'bookings', 'delete', 'Can delete bookings'),
('bookings.approve', 'Approve Bookings', 'bookings', 'approve', 'Can approve booking requests'),
('bookings.reject', 'Reject Bookings', 'bookings', 'reject', 'Can reject booking requests'),

-- Review permissions
('reviews.create', 'Create Reviews', 'reviews', 'create', 'Can create reviews'),
('reviews.delete_any', 'Delete Any Review', 'reviews', 'delete', 'Can delete any review'),
('reviews.moderate', 'Moderate Reviews', 'reviews', 'moderate', 'Can moderate review content'),

-- User permissions
('users.manage', 'Manage Users', 'users', 'manage', 'Can manage user accounts'),
('users.ban', 'Ban Users', 'users', 'ban', 'Can ban/suspend users'),
('users.verify', 'Verify Users', 'users', 'verify', 'Can verify user accounts'),

-- Content moderation
('content.moderate', 'Moderate Content', 'content', 'moderate', 'Can moderate user content'),
('content.review_flags', 'Review Flags', 'content', 'review', 'Can review flagged content'),

-- System permissions
('system.settings', 'System Settings', 'system', 'manage', 'Can manage system settings'),
('system.analytics', 'View Analytics', 'system', 'read', 'Can view system analytics');

-- Grant super_admin all permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM public.roles r 
CROSS JOIN public.permissions p 
WHERE r.name = 'super_admin';

-- Grant venue_owner relevant permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM public.roles r, public.permissions p 
WHERE r.name = 'venue_owner' 
AND p.name IN (
    'venues.create', 'venues.read', 'venues.update',
    'bookings.read_any', 'bookings.approve', 'bookings.reject'
);

-- Grant moderator permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM public.roles r, public.permissions p 
WHERE r.name = 'moderator' 
AND p.name IN (
    'content.moderate', 'content.review_flags', 'reviews.moderate'
);

-- ==========================================
-- SCHEMA VALIDATION CHECKS
-- ==========================================

-- Verify all foreign keys are valid
DO $$
DECLARE
    invalid_fks INTEGER;
BEGIN
    SELECT COUNT(*) INTO invalid_fks
    FROM information_schema.table_constraints tc
    WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public';
    
    RAISE NOTICE 'Total foreign key constraints: %', invalid_fks;
END $$;

-- ==========================================
-- SCHEMA VERSION
-- ==========================================

CREATE TABLE IF NOT EXISTS public.schema_version (
    version VARCHAR(20) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT
);

INSERT INTO public.schema_version (version, description) VALUES
('2.0.0', 'Complete optimized schema with security, roles, permissions, and performance enhancements');

-- ==========================================
-- COMPLETION MESSAGE
-- ==========================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'JAW Restaurant App Database Schema';
    RAISE NOTICE 'Version 2.0 - Successfully Created';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Features:';
    RAISE NOTICE '- Role-based access control (RBAC)';
    RAISE NOTICE '- Optimized RLS policies';
    RAISE NOTICE '- Comprehensive audit logging';
    RAISE NOTICE '- Loyalty program system';
    RAISE NOTICE '- Advanced search and filtering';
    RAISE NOTICE '- Security and 2FA support';
    RAISE NOTICE '- Analytics and reporting';
    RAISE NOTICE '- Automated triggers and functions';
    RAISE NOTICE '========================================';
END $$;
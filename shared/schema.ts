import { pgTable, uuid, text, timestamp, boolean, decimal, integer, jsonb, time, date, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const userTypeEnum = pgEnum('user_type', ['customer', 'restaurant_owner', 'admin']);
export const priceRangeEnum = pgEnum('price_range', ['$', '$$', '$$$', '$$$$']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled', 'completed']);
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video']);
export const storyStatusEnum = pgEnum('story_status', ['active', 'expired']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  profileImage: text('profile_image'),
  bio: text('bio'),
  userType: userTypeEnum('user_type').default('customer'),
  isVerified: boolean('is_verified').default(false),
  language: text('language').default('en'),
  darkTheme: boolean('dark_theme').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  phone: text('phone').notNull(),
  email: text('email'),
  website: text('website'),
  category: text('category').notNull(),
  priceRange: priceRangeEnum('price_range'),
  coverImage: text('cover_image'),
  hours: jsonb('hours'),
  rating: decimal('rating', { precision: 2, scale: 1 }).default('0'),
  totalReviews: integer('total_reviews').default(0),
  isPremier: boolean('is_premier').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  bookingDate: date('booking_date').notNull(),
  bookingTime: time('booking_time').notNull(),
  numberOfGuests: integer('number_of_guests').notNull(),
  status: bookingStatusEnum('status').default('pending'),
  specialRequests: text('special_requests'),
  confirmationCode: text('confirmation_code').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  images: text('images').array(),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const stories = pgTable('stories', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  mediaUrl: text('media_url').notNull(),
  mediaType: mediaTypeEnum('media_type'),
  duration: integer('duration').default(5),
  views: integer('views').default(0),
  status: storyStatusEnum('status').default('active'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const favorites = pgTable('favorites', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const menuItems = pgTable('menu_items', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),
  image: text('image'),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

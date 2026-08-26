-- DATABASE SCHEMA FOR SALONBOOK LK (PostgreSQL)

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- DROP EXISTING TABLES AND ENUMS IF NEEDED
DROP TABLE IF EXISTS user_favourites CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS shop_images CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS time_slots CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS blocked_dates CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS shop_status CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- ENUMS
CREATE TYPE user_role AS ENUM ('customer', 'owner', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'rejected', 'rescheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE shop_status AS ENUM ('pending', 'approved', 'suspended', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
CREATE TYPE payment_method AS ENUM ('cash', 'payhere', 'card');

-- USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash TEXT NOT NULL,
  role user_role DEFAULT 'customer',
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  warning_strikes INTEGER DEFAULT 0,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- SHOPS
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city VARCHAR(100),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  phone VARCHAR(20),
  email VARCHAR(150),
  cover_image_url TEXT,
  logo_url TEXT,
  working_hours JSONB DEFAULT '{"mon":{"open":"09:00","close":"18:00"},"tue":{"open":"09:00","close":"18:00"},"wed":{"open":"09:00","close":"18:00"},"thu":{"open":"09:00","close":"18:00"},"fri":{"open":"09:00","close":"18:00"},"sat":{"open":"09:00","close":"17:00"},"sun":{"open":"closed","close":"closed"}}',
  advance_booking_days INTEGER DEFAULT 14,
  status shop_status DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- BLOCKED DATES (owner holiday management)
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  blocked_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(shop_id, blocked_date)
);

-- SERVICES
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_mins INTEGER NOT NULL,
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- STAFF
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  specialization TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TIME SLOTS (generated per shop per day)
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(shop_id, staff_id, slot_date, slot_time)
);

-- BOOKINGS
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  slot_id UUID REFERENCES time_slots(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status booking_status DEFAULT 'pending',
  customer_note TEXT,
  owner_note TEXT,
  reschedule_date DATE,
  reschedule_time TIME,
  reschedule_reason TEXT,
  no_show_count INTEGER DEFAULT 0,
  auto_expire_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- REVIEWS (only after completed booking)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT true,
  owner_reply TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id),
  shop_id UUID REFERENCES shops(id),
  amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2),
  owner_payout DECIMAL(10,2),
  status payment_status DEFAULT 'pending',
  method payment_method DEFAULT 'cash',
  transaction_id TEXT,
  refund_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200),
  message TEXT,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  related_booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- SHOP IMAGES (gallery)
CREATE TABLE shop_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- SUBSCRIPTIONS (shop plans)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  plan VARCHAR(20) DEFAULT 'free',
  price DECIMAL(10,2),
  started_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- USER FAVOURITES
CREATE TABLE user_favourites (
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (customer_id, shop_id)
);

-- INDEXES
CREATE INDEX idx_bookings_shop_id ON bookings(shop_id);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_time_slots_shop_date ON time_slots(shop_id, slot_date);
CREATE INDEX idx_shops_city ON shops(city);
CREATE INDEX idx_shops_status ON shops(status);
CREATE INDEX idx_reviews_shop_id ON reviews(shop_id);

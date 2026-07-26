-- GymEase Database Migration & RLS Security Script
-- Target: Supabase / PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- 1. ENUMS & ROLES
-- =========================================================

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed basic roles
INSERT INTO roles (name, description) VALUES
  ('guest', 'Public unregistered or guest user'),
  ('user', 'Registered customer'),
  ('branch_admin', 'Admin managing a specific gym branch'),
  ('super_admin', 'System administrator with full access')
ON CONFLICT (name) DO NOTHING;

-- =========================================================
-- 2. USERS & ADMINS
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE, -- Links to auth.users if Supabase Auth is active
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  role_name VARCHAR(50) DEFAULT 'user' REFERENCES roles(name),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branches table (Must precede admins for FK)
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) DEFAULT 'DKI Jakarta',
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  google_maps_url TEXT,
  opening_hours VARCHAR(50) NOT NULL,
  closing_hours VARCHAR(50) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  image_url TEXT,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL, -- NULL for Super Admin, specific UUID for Branch Admin
  admin_level VARCHAR(50) DEFAULT 'branch_admin', -- branch_admin, super_admin
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 3. PARTNER GYMS & GALLERY
-- =========================================================

CREATE TABLE IF NOT EXISTS partner_gyms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  main_image TEXT NOT NULL,
  facilities TEXT[] DEFAULT '{}', -- e.g. {'Locker Room', 'Shower', 'Sauna', 'WiFi', 'Parking', 'Personal Trainer'}
  rating DECIMAL(3, 2) DEFAULT 4.8,
  total_reviews INT DEFAULT 0,
  google_maps_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  opening_hours VARCHAR(50) NOT NULL,
  closing_hours VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gym_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID NOT NULL REFERENCES partner_gyms(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption VARCHAR(255),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 4. PACKAGES & CATEGORIES
-- =========================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(50) DEFAULT 'product', -- product, gym
  icon VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID REFERENCES partner_gyms(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  duration_days INT DEFAULT 1, -- 1 day pass, 30 days monthly, etc.
  benefits TEXT[] DEFAULT '{}',
  image_url TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 5. PRODUCTS & PRODUCT IMAGES
-- =========================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  stock INT DEFAULT 10,
  main_image TEXT NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 5.0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 6. RENTALS & SIZES
-- =========================================================

CREATE TABLE IF NOT EXISTS rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'clothes' or 'towel'
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rental_price DECIMAL(12, 2) NOT NULL,
  total_stock INT DEFAULT 50,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rental_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
  size_name VARCHAR(10) NOT NULL, -- XS, S, M, L, XL, XXL
  stock INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_rental_size UNIQUE(rental_id, size_name)
);

-- =========================================================
-- 7. PROMO CODES & BANNERS
-- =========================================================

CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percentage INT DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  min_spend DECIMAL(12, 2) DEFAULT 0,
  max_discount DECIMAL(12, 2) DEFAULT 0,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  target_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 8. BOOKINGS & RENTAL ITEMS
-- =========================================================

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_code VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  gym_id UUID NOT NULL REFERENCES partner_gyms(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(12, 2) NOT NULL,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  grand_total DECIMAL(12, 2) NOT NULL,
  promo_code VARCHAR(50),
  status VARCHAR(50) DEFAULT 'confirmed', -- pending, confirmed, checked_in, cancelled
  qr_code_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL, -- 'package', 'clothes', 'towel', 'product'
  item_name VARCHAR(255) NOT NULL,
  size VARCHAR(10), -- XS, S, M, L, XL, XXL if clothes
  quantity INT DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 9. ORDERS & ORDER ITEMS
-- =========================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  total_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'paid', -- pending, paid, shipped, completed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL
);

-- =========================================================
-- 10. PAYMENTS, REVIEWS, FAVORITES & NOTIFICATIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL, -- QRIS, Credit Card, Bank Transfer, E-Wallet
  payment_status VARCHAR(50) DEFAULT 'success',
  amount DECIMAL(12, 2) NOT NULL,
  paid_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gym_id UUID REFERENCES partner_gyms(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gym_id UUID REFERENCES partner_gyms(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_fav_gym UNIQUE (user_id, gym_id),
  CONSTRAINT unique_user_fav_prod UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  type VARCHAR(50) DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 11. REPORTS, ACTIVITY LOGS & AUDIT LOGS
-- =========================================================

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  report_type VARCHAR(50) NOT NULL, -- revenue, booking, customer, rental, product, branch
  title VARCHAR(255) NOT NULL,
  file_url TEXT,
  generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  details JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  operation VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
  old_data JSONB,
  new_data JSONB,
  performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 12. SUPABASE STORAGE BUCKETS
-- =========================================================

INSERT INTO storage.buckets (id, name, public) VALUES
  ('products', 'products', true),
  ('packages', 'packages', true),
  ('gyms', 'gyms', true),
  ('branches', 'branches', true),
  ('avatars', 'avatars', true),
  ('reviews', 'reviews', true),
  ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage public read policy
CREATE POLICY "Public Read Storage" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Authenticated Upload Storage" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =========================================================
-- 13. SUPABASE ROW LEVEL SECURITY (RLS) & BRANCH ISOLATION
-- =========================================================

-- Enable RLS on core tables
ALTER TABLE partner_gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is Super Admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON u.role_name = r.name
    WHERE u.auth_id = auth.uid() AND r.name = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get Branch Admin's branch_id
CREATE OR REPLACE FUNCTION get_user_branch_id()
RETURNS UUID AS $$
DECLARE
  v_branch_id UUID;
BEGIN
  SELECT a.branch_id INTO v_branch_id
  FROM admins a
  JOIN users u ON a.user_id = u.id
  WHERE u.auth_id = auth.uid();

  RETURN v_branch_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public READ for Partner Gyms, Products, Packages
CREATE POLICY "Public Can Read Gyms" ON partner_gyms FOR SELECT USING (true);
CREATE POLICY "Public Can Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Can Read Packages" ON packages FOR SELECT USING (true);

-- BOOKINGS RLS RULES (Branch Isolation)
-- 1. Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- 2. Branch Admins CAN ONLY SEE Bookings for THEIR ASSIGNED BRANCH!
CREATE POLICY "Branch Admins can view branch bookings" ON bookings
  FOR SELECT USING (
    is_super_admin() OR branch_id = get_user_branch_id()
  );

-- 3. Branch Admins CAN ONLY UPDATE Bookings for THEIR ASSIGNED BRANCH!
CREATE POLICY "Branch Admins can update branch bookings" ON bookings
  FOR UPDATE USING (
    is_super_admin() OR branch_id = get_user_branch_id()
  );

-- 4. Super Admin full access on Bookings
CREATE POLICY "Super Admin all access on bookings" ON bookings
  FOR ALL USING (is_super_admin());

-- ORDERS RLS RULES (Branch Isolation)
CREATE POLICY "Users view own orders" ON orders
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Branch Admins view branch orders" ON orders
  FOR SELECT USING (is_super_admin() OR branch_id = get_user_branch_id());

-- Grant access
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

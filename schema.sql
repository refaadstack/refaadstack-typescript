-- RefaadStack Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Portfolios Table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  problem TEXT,
  solution TEXT,
  impact_result TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  challenge TEXT,
  approach TEXT,
  outcome TEXT,
  services TEXT[] DEFAULT '{}',
  stack TEXT[] DEFAULT '{}',
  year TEXT DEFAULT EXTRACT(YEAR FROM NOW())::TEXT,
  image_url TEXT DEFAULT '/images/refaadstack-system-still.png',
  featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  reading_time TEXT DEFAULT '5 menit',
  image_url TEXT DEFAULT '/images/refaadstack-system-still.png',
  author_name TEXT DEFAULT 'RefaadStack',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Portfolio Images Table
CREATE TABLE IF NOT EXISTS portfolio_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  price INTEGER,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  company_name TEXT,
  testimonial TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_title TEXT NOT NULL DEFAULT 'RefaadStack - Build Better Digital Solutions',
  site_description TEXT NOT NULL DEFAULT 'RefaadStack adalah software house modern yang membangun website, aplikasi web, POS system, dan SaaS untuk bisnis Anda.',
  site_keywords TEXT[] DEFAULT ARRAY['software house', 'website development', 'POS system', 'SaaS'],
  og_image_url TEXT DEFAULT '/og-image.png',
  canonical_url TEXT DEFAULT 'https://www.refaadstack.com',
  author_name TEXT DEFAULT 'RefaadStack',
  published_time TIMESTAMPTZ DEFAULT '2026-05-01T00:00:00.000Z',
  robots_index BOOLEAN DEFAULT true,
  robots_follow BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);

-- Create RLS Policies (Row Level Security)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read portfolios" ON portfolios FOR SELECT USING (true);
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read blog_posts" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read portfolio_images" ON portfolio_images FOR SELECT USING (true);
CREATE POLICY "Public can read services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (true);

-- Admin policies (only authenticated admins can modify)
CREATE POLICY "Admins can manage portfolios" ON portfolios FOR ALL USING (
  exists (select 1 from admins where id::text = current_user::text)
);
CREATE POLICY "Admins can manage projects" ON projects FOR ALL USING (
  exists (select 1 from admins where id::text = current_user::text)
);
CREATE POLICY "Admins can manage blog_posts" ON blog_posts FOR ALL USING (
  exists (select 1 from admins where id::text = current_user::text)
);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (
  exists (select 1 from admins where id::text = current_user::text)
);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  exists (select 1 from admins where id::text = current_user::text)
);
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (
  exists (select 1 from admins where id::text = current_user::text)
);
CREATE POLICY "Admins can manage site_settings" ON site_settings FOR ALL USING (
  exists (select 1 from admins where id::text = current_user::text)
);

INSERT INTO site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for blog/project/content media
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-media', 'content-media', true)
ON CONFLICT (id) DO NOTHING;

-- Upgrade helper for existing databases
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE services ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'RefaadStack';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS published_time TIMESTAMPTZ DEFAULT '2026-05-01T00:00:00.000Z';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_portfolios_category ON portfolios(category);
CREATE INDEX IF NOT EXISTS idx_portfolios_featured ON portfolios(featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_portfolio_id ON portfolio_images(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);

-- Done!
SELECT 'Database schema created successfully!' as status;

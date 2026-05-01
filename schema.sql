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

-- 3. Portfolio Images Table
CREATE TABLE IF NOT EXISTS portfolio_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  price INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  company_name TEXT,
  testimonial TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin (Password: admin123 - CHANGE THIS IN PRODUCTION)
-- Using bcrypt hash - you'll need to generate this properly
-- For development, use a simple hash. In production, use proper bcrypt.
INSERT INTO admins (email, password_hash, name) 
VALUES ('admin@refaadstack.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS6W.fN4u', 'Admin');

-- Insert sample portfolios
INSERT INTO portfolios (title, slug, category, short_description, full_description, problem, solution, impact_result, tech_stack, featured)
VALUES 
(
  'Toko Ritel Maju Bersama',
  'toko-maju-pos',
  'POS System + Inventory Management',
  'Sistem kasir digital untuk toko retail',
  'Pengembangan sistem POS lengkap dengan fitur manajemen stok, laporan real-time, dan multi-outlet untuk jaringan retail.',
  'Proses kasir manual yang memakan waktu dan sering terjadi kesalahan dalam perhitungan.',
  'Sistem POS digital dengan scan barcode, laporan otomatis, dan integrasi printer thermal.',
  'Penjualan meningkat 40% dalam 3 bulan, waktu checkout berkurang 60%.',
  ARRAY['Next.js', 'PostgreSQL', 'Tailwind', 'Framer Motion'],
  true
),
(
  'Logistik Express Dashboard',
  'logistik-dashboard',
  'Custom Web Application',
  'Dashboard manajemen pengiriman real-time',
  'Platform tracking pengiriman dengan visualisasi data dan notifikasi otomatis.',
  'Kesulitan melacak posisi paket danestimasi waktu tiba yang tidak akurat.',
  'Dashboard real-time dengan GPS tracking dan AI predictive ETA.',
  'Efisiensi operasional meningkat 35%, customer satisfaction naik 25%.',
  ARRAY['React', 'Node.js', 'PostgreSQL'],
  true
),
(
  'Firma Hukum Nusantara',
  'firma-hukum-company',
  'Company Profile Website',
  'Website profesional untuk firma hukum',
  'Website company profile dengan desain premium dan SEO optimization.',
  'Tidak punya keberadaan online yang kuat.',
  'Website modern dengan SEO, animasi halus, dan contact form terintegrasi.',
  'Traffic meningkat 300% dalam 6 bulan, lead generation naik 150%.',
  ARRAY['Next.js', 'Framer Motion', 'Tailwind'],
  true
),
(
  'Undangan Digital Premium',
  'undangan-digital-premium',
  'SaaS Platform – RefaadInvite',
  'Platform undangan digital interaktif',
  'Platform undangan digitale dengan RSVP, galeri foto, dan countdown wedding.',
  'Undangan fisik yang tidak praktis dan mahal.',
  'Platform digital dengan berbagi link, RSVP online, dan galeri foto.',
  '节省 biaya 70%, lebih from 1000+ use in first month.',
  ARRAY['Next.js', 'Supabase', 'Firebase'],
  true
),
(
  'AgriTrack Platform',
  'agritrack-iot',
  'IoT + Web App Integration',
  'Platform monitoring pertanian cerdas',
  'Sistem monitoring tanaman dengan IoT sensor dan analitik data.',
  'Petani kesulitan memantau kondisi tanaman secara realtime.',
  'Platform IoT dengan sensor soil moisture, weather data, dan AI recommendations.',
  'Crop yield meningkat 25%, water usage reduced 40%.',
  ARRAY['IoT', 'API', 'PostgreSQL', 'React'],
  true
),
(
  'Service Center AutoBot',
  'autobot-service',
  'Automation + WhatsApp Integration',
  'Sistem客服 automation dengan WhatsApp',
  'Otomatisasi客服 melalui WhatsApp API dengan AI chatbot.',
  'Respons lambat dan tidak konsisten.',
  'WhatsApp bot dengan AI, auto ticket, dan CRM integration.',
  'Response time berkurang 90%, customer satisfaction meningkat 40%.',
  ARRAY['Automation', 'WhatsApp API', 'CRM'],
  true
);

-- Insert sample services
INSERT INTO services (name, description, icon, sort_order)
VALUES 
('Company Profile Website', 'Website profesional yang merepresentasikan brand Anda dengan desain modern dan performa tinggi.', '🌐', 1),
('Custom Dashboard', 'Aplikasi web dengan panel admin, visualisasi data real-time, dan manajemen konten yang intuitif.', '📊', 2),
('POS System', 'Sistem kasir digital yang ringan, cepat, dan mendukung multi-outlet.', '🧾', 3),
('SaaS Platform', 'Platform berbasis subscription dengan autentikasi, billing, dan infrastruktur scalable.', '☁️', 4),
('API Integration', 'Integrasi sistem third-party seperti payment gateway, WhatsApp API, dan platform lainnya.', '🔗', 5),
('Automation System', 'Otomatisasi workflow bisnis: report generation, notifikasi otomatis, dan proses repetitif.', '⚙️', 6);

-- Insert sample products
INSERT INTO products (name, tagline, description, features, price, is_active)
VALUES 
(
  'RefaadPOS',
  'Sistem kasir modern untuk UMKM Indonesia',
  'Sistem kasir digital modern untuk bisnis retail.',
  ARRAY['Multi-outlet & multi-user', 'Laporan real-time & export Excel', 'Integrasi printer thermal', 'Manajemen stok & kategori'],
  0,
  true
),
(
  'RefaadInvite',
  'Undangan digital premium dengan RSVP dan galeri foto',
  'Platform undangan digital interaktif.',
  ARRAY['Desain premium & customizable', 'RSVP & ucapan digital interaktif', 'Galeri foto & countdown wedding', 'Share via link & QR code'],
  199000,
  true
);

-- Insert sample testimonials
INSERT INTO testimonials (client_name, company_name, testimonial, rating)
VALUES 
('Budi Santoso', 'Toko Maju Bersama', 'Sistem POS yang sangat membantu bisnis kami. Tim responsive dan profesional!', 5),
('Siti Rahayu', 'Firma Hukum Nusantara', 'Website kami terlihat sangat premium. Sangat recommended!', 5),
('Ahmad Fauzi', 'Logistik Express', 'Dashboard yang sangat membantu memantau pengiriman. Mantap!', 5);

-- Create RLS Policies (Row Level Security)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read portfolios" ON portfolios FOR SELECT USING (true);
CREATE POLICY "Public can read portfolio_images" ON portfolio_images FOR SELECT USING (true);
CREATE POLICY "Public can read services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read testimonials" ON testimonials FOR SELECT USING (is_active = true);

-- Admin policies (only authenticated admins can modify)
CREATE POLICY "Admins can manage portfolios" ON portfolios FOR ALL USING (
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

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_portfolios_category ON portfolios(category);
CREATE INDEX IF NOT EXISTS idx_portfolios_featured ON portfolios(featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_portfolio_id ON portfolio_images(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);

-- Done!
SELECT 'Database schema created successfully!' as status;

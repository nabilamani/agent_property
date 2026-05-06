-- ============================================
-- Agent Property - Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: agents
-- ============================================
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  photo TEXT,
  bio TEXT,
  phone TEXT NOT NULL,
  logo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Table: properties
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  price BIGINT NOT NULL DEFAULT 0,
  address TEXT NOT NULL,
  map_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('Rumah', 'Tanah', 'Kavling', 'Cluster', 'Apartemen')),
  land_area INT NOT NULL DEFAULT 0,
  building_area INT NOT NULL DEFAULT 0,
  condition TEXT NOT NULL CHECK (condition IN ('Baru', 'Bekas', 'Indent')) DEFAULT 'Baru',
  description TEXT,
  agent_whatsapp TEXT NOT NULL,
  owner_whatsapp TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_sold BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  whatsapp_clicks_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RPC Functions for Analytics
-- ============================================
CREATE OR REPLACE FUNCTION increment_property_views(id UUID)
RETURNS void AS $$
BEGIN
  UPDATE properties
  SET views_count = views_count + 1
  WHERE properties.id = increment_property_views.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_property_whatsapp_clicks(id UUID)
RETURNS void AS $$
BEGIN
  UPDATE properties
  SET whatsapp_clicks_count = whatsapp_clicks_count + 1
  WHERE properties.id = increment_property_whatsapp_clicks.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Table: property_images
-- ============================================
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_is_active ON properties(is_active);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Public can read agents
CREATE POLICY "Anyone can view agents"
  ON agents FOR SELECT
  USING (true);

-- Authenticated users can manage agents
CREATE POLICY "Authenticated users can insert agents"
  ON agents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update agents"
  ON agents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public can read active properties
CREATE POLICY "Anyone can view active properties"
  ON properties FOR SELECT
  USING (is_active = true);

-- Authenticated users can view ALL properties (including inactive)
CREATE POLICY "Authenticated users can view all properties"
  ON properties FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can manage properties
CREATE POLICY "Authenticated users can insert properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete properties"
  ON properties FOR DELETE
  TO authenticated
  USING (true);

-- Public can read property images
CREATE POLICY "Anyone can view property images"
  ON property_images FOR SELECT
  USING (true);

-- Authenticated users can manage property images
CREATE POLICY "Authenticated users can insert property images"
  ON property_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update property images"
  ON property_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete property images"
  ON property_images FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Storage Bucket: property-images
-- ============================================
-- Run these in a separate SQL query or via Supabase Dashboard:
-- 1. Create bucket "property-images" (public)
-- 2. Create bucket "agent-assets" (public)

INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('agent-assets', 'agent-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Anyone can view property images storage"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('property-images', 'agent-assets'));

CREATE POLICY "Authenticated users can upload property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('property-images', 'agent-assets'));

CREATE POLICY "Authenticated users can update property images storage"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('property-images', 'agent-assets'));

CREATE POLICY "Authenticated users can delete property images storage"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('property-images', 'agent-assets'));

-- ============================================
-- Seed data: Insert a default agent
-- ============================================
INSERT INTO agents (name, bio, phone)
VALUES (
  'Budi Santoso',
  'Agent properti profesional dengan pengalaman lebih dari 10 tahun di area Jabodetabek. Siap membantu menemukan rumah impian Anda.',
  '6281234567890'
);

-- ============================================
-- Function: auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

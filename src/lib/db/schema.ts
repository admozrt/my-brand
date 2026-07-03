export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  material TEXT,
  colors TEXT,
  images TEXT,
  description TEXT,
  is_new BOOLEAN DEFAULT 0,
  is_promo BOOLEAN DEFAULT 0,
  stock_status TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  discount_percent INTEGER,
  start_date TEXT,
  end_date TEXT,
  banner_image TEXT
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT,
  rating INTEGER,
  comment TEXT,
  photo TEXT,
  product_id INTEGER,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS brand_profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  brand_id TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  tagline TEXT,
  business_category TEXT NOT NULL,

  logo_url TEXT,
  favicon_url TEXT,
  color_primary TEXT NOT NULL DEFAULT '#1F3A2E',
  color_secondary TEXT NOT NULL DEFAULT '#6B5B4D',
  color_accent TEXT NOT NULL DEFAULT '#C15F3C',
  color_neutral_bg TEXT NOT NULL DEFAULT '#FAFAF8',
  color_neutral_text TEXT NOT NULL DEFAULT '#1A1917',
  font_heading TEXT DEFAULT 'Outfit',
  font_body TEXT DEFAULT 'Plus Jakarta Sans',

  hero_headline TEXT,
  hero_subheadline TEXT,
  about_story TEXT,

  primary_attribute_label TEXT DEFAULT 'Bahan',
  secondary_attribute_label TEXT DEFAULT 'Warna',
  size_chart_enabled BOOLEAN DEFAULT 0,

  whatsapp_number TEXT,
  whatsapp_message_template TEXT DEFAULT 'Halo, saya tertarik dengan {{productName}}',
  instagram_url TEXT,
  tiktok_url TEXT,
  address TEXT,
  map_embed_url TEXT,
  operating_hours TEXT,

  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS brand_hero_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS brand_feature_flags (
  flag_key TEXT PRIMARY KEY,
  is_enabled BOOLEAN DEFAULT 0
);
`;

import type { Database } from 'sql.js';

interface SeedData {
  brand_profile: Record<string, unknown>;
  brand_hero_images: { image_url: string; sort_order?: number }[];
  categories: { name: string; slug: string }[];
  brand_feature_flags: Record<string, boolean>;
  products: {
    name: string;
    category: string;
    price: number;
    material?: string;
    colors?: string[];
    images?: string[];
    description?: string;
    is_new?: boolean;
    is_promo?: boolean;
    stock_status?: string;
  }[];
  promotions: {
    title: string;
    description?: string;
    discount_percent?: number;
    start_date?: string;
    end_date?: string;
    banner_image?: string;
  }[];
  testimonials: {
    customer_name?: string;
    rating?: number;
    comment?: string;
    photo?: string;
    product_id?: number;
  }[];
}

export function loadSeedIntoDb(db: Database, seed: SeedData) {
  const p = seed.brand_profile;
  db.run(
    `INSERT INTO brand_profile (
      id, brand_id, brand_name, tagline, business_category,
      logo_url, favicon_url, color_primary, color_secondary, color_accent, color_neutral_bg, color_neutral_text,
      font_heading, font_body, hero_headline, hero_subheadline, about_story,
      primary_attribute_label, secondary_attribute_label, size_chart_enabled,
      whatsapp_number, whatsapp_message_template, instagram_url, tiktok_url, address, map_embed_url, operating_hours,
      updated_at
    ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      p.brand_id as string, p.brand_name as string, (p.tagline as string) ?? '', p.business_category as string,
      (p.logo_url as string) ?? '', (p.favicon_url as string) ?? '',
      p.color_primary as string, p.color_secondary as string, p.color_accent as string,
      p.color_neutral_bg as string, p.color_neutral_text as string,
      p.font_heading as string, p.font_body as string,
      (p.hero_headline as string) ?? '', (p.hero_subheadline as string) ?? '', (p.about_story as string) ?? '',
      p.primary_attribute_label as string, (p.secondary_attribute_label as string) ?? '',
      p.size_chart_enabled ? 1 : 0,
      (p.whatsapp_number as string) ?? '', p.whatsapp_message_template as string,
      (p.instagram_url as string) ?? '', (p.tiktok_url as string) ?? '',
      (p.address as string) ?? '', (p.map_embed_url as string) ?? '', (p.operating_hours as string) ?? '',
      new Date().toISOString(),
    ]
  );

  for (const img of seed.brand_hero_images) {
    db.run('INSERT INTO brand_hero_images (image_url, sort_order) VALUES (?, ?)', [
      img.image_url,
      img.sort_order ?? 0,
    ]);
  }

  for (const cat of seed.categories) {
    db.run('INSERT INTO categories (name, slug) VALUES (?, ?)', [cat.name, cat.slug]);
  }

  for (const [key, enabled] of Object.entries(seed.brand_feature_flags)) {
    db.run('INSERT INTO brand_feature_flags (flag_key, is_enabled) VALUES (?, ?)', [key, enabled ? 1 : 0]);
  }

  for (const prod of seed.products) {
    db.run(
      `INSERT INTO products (name, category, price, material, colors, images, description, is_new, is_promo, stock_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prod.name, prod.category, prod.price, prod.material ?? '',
        JSON.stringify(prod.colors ?? []), JSON.stringify(prod.images ?? []),
        prod.description ?? '', prod.is_new ? 1 : 0, prod.is_promo ? 1 : 0,
        prod.stock_status ?? 'ready', new Date().toISOString(),
      ]
    );
  }

  for (const promo of seed.promotions) {
    db.run(
      `INSERT INTO promotions (title, description, discount_percent, start_date, end_date, banner_image)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [promo.title, promo.description ?? '', promo.discount_percent ?? 0, promo.start_date ?? '', promo.end_date ?? '', promo.banner_image ?? '']
    );
  }

  for (const t of seed.testimonials) {
    db.run(
      `INSERT INTO testimonials (customer_name, rating, comment, photo, product_id) VALUES (?, ?, ?, ?, ?)`,
      [t.customer_name ?? '', t.rating ?? 5, t.comment ?? '', t.photo ?? '', t.product_id ?? null]
    );
  }
}

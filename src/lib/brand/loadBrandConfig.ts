import type { Database } from 'sql.js';
import type { BrandConfig } from './types';

export function loadBrandConfigFromDb(db: Database): BrandConfig {
  const result = db.exec('SELECT * FROM brand_profile WHERE id = 1');
  if (!result[0]) throw new Error('brand_profile belum diisi — jalankan seed terlebih dahulu');

  const { columns, values } = result[0];
  const row: Record<string, unknown> = {};
  columns.forEach((col, i) => (row[col] = values[0][i]));

  const heroImages =
    db.exec('SELECT image_url FROM brand_hero_images ORDER BY sort_order')[0]?.values.map(
      (r) => r[0] as string
    ) ?? [];

  const categories =
    db.exec('SELECT slug, name FROM categories ORDER BY id')[0]?.values.map((r) => ({
      slug: r[0] as string,
      label: r[1] as string,
    })) ?? [];

  const flagRows = db.exec('SELECT flag_key, is_enabled FROM brand_feature_flags')[0]?.values ?? [];
  const flags = Object.fromEntries(flagRows.map((r) => [r[0], Boolean(r[1])]));

  return {
    meta: {
      brandId: row.brand_id as string,
      brandName: row.brand_name as string,
      tagline: (row.tagline as string) ?? '',
      category: row.business_category as string,
    },
    theme: {
      colors: {
        primary: row.color_primary as string,
        secondary: row.color_secondary as string,
        accent: row.color_accent as string,
        neutralBg: row.color_neutral_bg as string,
        neutralText: row.color_neutral_text as string,
      },
      fontHeading: row.font_heading as string,
      fontBody: row.font_body as string,
      logoUrl: (row.logo_url as string) ?? '',
      faviconUrl: (row.favicon_url as string) ?? '',
      heroImages,
    },
    content: {
      aboutStory: (row.about_story as string) ?? '',
      heroHeadline: (row.hero_headline as string) ?? '',
      heroSubheadline: (row.hero_subheadline as string) ?? '',
    },
    productTaxonomy: {
      categories,
      attributeLabels: {
        primaryAttribute: row.primary_attribute_label as string,
        secondaryAttribute: (row.secondary_attribute_label as string) ?? undefined,
      },
      sizeChartEnabled: Boolean(row.size_chart_enabled),
    },
    contact: {
      whatsapp: (row.whatsapp_number as string) ?? '',
      whatsappMessageTemplate: row.whatsapp_message_template as string,
      instagram: (row.instagram_url as string) ?? undefined,
      tiktok: (row.tiktok_url as string) ?? undefined,
      address: (row.address as string) ?? '',
      mapEmbedUrl: (row.map_embed_url as string) ?? undefined,
      operatingHours: (row.operating_hours as string) ?? '',
    },
    featureFlags: flags as BrandConfig['featureFlags'],
  };
}

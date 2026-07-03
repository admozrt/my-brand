import { getDb, persistDb } from './client';

export async function updateBrandIdentity(values: {
  brandName: string;
  tagline?: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  aboutStory?: string;
}) {
  const db = await getDb();
  db.run(
    `UPDATE brand_profile
     SET brand_name = ?, tagline = ?, color_primary = ?, color_secondary = ?, color_accent = ?,
         about_story = ?, updated_at = ?
     WHERE id = 1`,
    [
      values.brandName, values.tagline ?? '', values.colorPrimary, values.colorSecondary, values.colorAccent,
      values.aboutStory ?? '', new Date().toISOString(),
    ]
  );
  await persistDb(db);
}

export async function updateBrandContact(values: {
  whatsappNumber: string;
  whatsappMessageTemplate: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  address?: string;
  mapEmbedUrl?: string;
  operatingHours?: string;
}) {
  const db = await getDb();
  db.run(
    `UPDATE brand_profile
     SET whatsapp_number = ?, whatsapp_message_template = ?, instagram_url = ?, tiktok_url = ?,
         address = ?, map_embed_url = ?, operating_hours = ?, updated_at = ?
     WHERE id = 1`,
    [
      values.whatsappNumber, values.whatsappMessageTemplate, values.instagramUrl ?? '', values.tiktokUrl ?? '',
      values.address ?? '', values.mapEmbedUrl ?? '', values.operatingHours ?? '', new Date().toISOString(),
    ]
  );
  await persistDb(db);
}

export async function updateBrandHomeContent(values: {
  heroHeadline?: string;
  heroSubheadline?: string;
}) {
  const db = await getDb();
  db.run(
    `UPDATE brand_profile SET hero_headline = ?, hero_subheadline = ?, updated_at = ? WHERE id = 1`,
    [values.heroHeadline ?? '', values.heroSubheadline ?? '', new Date().toISOString()]
  );
  await persistDb(db);
}

export async function updateFeatureFlag(flagKey: string, isEnabled: boolean) {
  const db = await getDb();
  db.run('UPDATE brand_feature_flags SET is_enabled = ? WHERE flag_key = ?', [isEnabled ? 1 : 0, flagKey]);
  await persistDb(db);
}

export async function addCategory(name: string, slug: string) {
  const db = await getDb();
  db.run('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug]);
  await persistDb(db);
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  db.run('DELETE FROM categories WHERE id = ?', [id]);
  await persistDb(db);
}

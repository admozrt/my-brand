import { getDb, persistDb } from './client';
import type { Product, Promotion, Testimonial, Category } from './types';

function rowsToObjects<T>(result: { columns: string[]; values: unknown[][] }[] | undefined, map: (row: Record<string, unknown>) => T): T[] {
  if (!result || result.length === 0) return [];
  const { columns, values } = result[0];
  return values.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => (obj[col] = row[i]));
    return map(obj);
  });
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as number,
    name: row.name as string,
    category: row.category as string,
    price: row.price as number,
    material: (row.material as string) || null,
    colors: JSON.parse((row.colors as string) || '[]'),
    images: JSON.parse((row.images as string) || '[]'),
    description: (row.description as string) || null,
    isNew: Boolean(row.is_new),
    isPromo: Boolean(row.is_promo),
    stockStatus: (row.stock_status as string) || 'ready',
    createdAt: (row.created_at as string) || null,
  };
}

export async function listProducts(): Promise<Product[]> {
  const db = await getDb();
  const result = db.exec('SELECT * FROM products ORDER BY created_at DESC');
  return rowsToObjects(result, mapProduct);
}

export async function getProductById(id: number): Promise<Product | null> {
  const db = await getDb();
  const result = db.exec('SELECT * FROM products WHERE id = ?', [id]);
  const list = rowsToObjects(result, mapProduct);
  return list[0] ?? null;
}

export async function createProduct(input: Omit<Product, 'id' | 'createdAt'>): Promise<void> {
  const db = await getDb();
  db.run(
    `INSERT INTO products (name, category, price, material, colors, images, description, is_new, is_promo, stock_status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name, input.category, input.price, input.material ?? '',
      JSON.stringify(input.colors ?? []), JSON.stringify(input.images ?? []),
      input.description ?? '', input.isNew ? 1 : 0, input.isPromo ? 1 : 0,
      input.stockStatus, new Date().toISOString(),
    ]
  );
  await persistDb(db);
}

export async function updateProduct(id: number, input: Omit<Product, 'id' | 'createdAt'>): Promise<void> {
  const db = await getDb();
  db.run(
    `UPDATE products SET name = ?, category = ?, price = ?, material = ?, colors = ?, images = ?,
     description = ?, is_new = ?, is_promo = ?, stock_status = ? WHERE id = ?`,
    [
      input.name, input.category, input.price, input.material ?? '',
      JSON.stringify(input.colors ?? []), JSON.stringify(input.images ?? []),
      input.description ?? '', input.isNew ? 1 : 0, input.isPromo ? 1 : 0,
      input.stockStatus, id,
    ]
  );
  await persistDb(db);
}

export async function deleteProduct(id: number): Promise<void> {
  const db = await getDb();
  db.run('DELETE FROM products WHERE id = ?', [id]);
  await persistDb(db);
}

function mapPromotion(row: Record<string, unknown>): Promotion {
  return {
    id: row.id as number,
    title: row.title as string,
    description: (row.description as string) || null,
    discountPercent: (row.discount_percent as number) ?? null,
    startDate: (row.start_date as string) || null,
    endDate: (row.end_date as string) || null,
    bannerImage: (row.banner_image as string) || null,
  };
}

export async function listPromotions(): Promise<Promotion[]> {
  const db = await getDb();
  const result = db.exec('SELECT * FROM promotions ORDER BY id DESC');
  return rowsToObjects(result, mapPromotion);
}

export async function createPromotion(input: Omit<Promotion, 'id'>): Promise<void> {
  const db = await getDb();
  db.run(
    `INSERT INTO promotions (title, description, discount_percent, start_date, end_date, banner_image) VALUES (?, ?, ?, ?, ?, ?)`,
    [input.title, input.description ?? '', input.discountPercent ?? 0, input.startDate ?? '', input.endDate ?? '', input.bannerImage ?? '']
  );
  await persistDb(db);
}

export async function deletePromotion(id: number): Promise<void> {
  const db = await getDb();
  db.run('DELETE FROM promotions WHERE id = ?', [id]);
  await persistDb(db);
}

function mapTestimonial(row: Record<string, unknown>): Testimonial {
  return {
    id: row.id as number,
    customerName: (row.customer_name as string) || null,
    rating: (row.rating as number) ?? null,
    comment: (row.comment as string) || null,
    photo: (row.photo as string) || null,
    productId: (row.product_id as number) ?? null,
  };
}

export async function listTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  const result = db.exec('SELECT * FROM testimonials ORDER BY id DESC');
  return rowsToObjects(result, mapTestimonial);
}

export async function createTestimonial(input: Omit<Testimonial, 'id'>): Promise<void> {
  const db = await getDb();
  db.run(
    `INSERT INTO testimonials (customer_name, rating, comment, photo, product_id) VALUES (?, ?, ?, ?, ?)`,
    [input.customerName ?? '', input.rating ?? 5, input.comment ?? '', input.photo ?? '', input.productId]
  );
  await persistDb(db);
}

export async function deleteTestimonial(id: number): Promise<void> {
  const db = await getDb();
  db.run('DELETE FROM testimonials WHERE id = ?', [id]);
  await persistDb(db);
}

function mapCategory(row: Record<string, unknown>): Category {
  return { id: row.id as number, name: row.name as string, slug: row.slug as string };
}

export async function listCategories(): Promise<Category[]> {
  const db = await getDb();
  const result = db.exec('SELECT * FROM categories ORDER BY id');
  return rowsToObjects(result, mapCategory);
}

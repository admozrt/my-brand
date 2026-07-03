import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBrand } from '@/lib/brand/BrandProvider';
import { addCategory, deleteCategory } from '@/lib/db/brandRepository';
import { getDb } from '@/lib/db/client';
import { toast } from '@/components/ui/use-toast';

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function CategoriesTab() {
  const brand = useBrand();
  const [name, setName] = useState('');

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await addCategory(name.trim(), slugify(name));
    setName('');
    await brand.refresh();
    toast({ title: 'Kategori ditambahkan' });
  }

  async function handleDelete(slug: string) {
    const db = await getDb();
    const result = db.exec('SELECT id FROM categories WHERE slug = ?', [slug]);
    const id = result[0]?.values[0]?.[0] as number | undefined;
    if (id) {
      await deleteCategory(id);
      await brand.refresh();
      toast({ title: 'Kategori dihapus' });
    }
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kategori baru" />
        <Button type="submit">Tambah</Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {brand.productTaxonomy.categories.map((cat) => (
          <div key={cat.slug} className="flex items-center gap-2 rounded-full border border-neutral-text/20 px-3 py-2 text-sm">
            {cat.label}
            <button onClick={() => handleDelete(cat.slug)} className="text-neutral-text/40 hover:text-red-600" aria-label={`Hapus ${cat.label}`}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

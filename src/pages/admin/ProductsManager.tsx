import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useBrand } from '@/lib/brand/BrandProvider';
import { createProduct, deleteProduct, listProducts } from '@/lib/db/productRepository';
import type { Product } from '@/lib/db/types';

const productSchema = z.object({
  name: z.string().min(2, 'Nama produk minimal 2 karakter'),
  category: z.string().min(1, 'Pilih kategori'),
  price: z.coerce.number().min(0, 'Harga tidak valid'),
  material: z.string().optional(),
  colors: z.string().optional(),
  description: z.string().optional(),
  isNew: z.boolean().optional(),
  isPromo: z.boolean().optional(),
  stockStatus: z.enum(['ready', 'limited', 'sold_out']),
});

type ProductForm = z.infer<typeof productSchema>;

export function ProductsManager() {
  const brand = useBrand();
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', category: brand.productTaxonomy.categories[0]?.slug ?? '', price: 0, stockStatus: 'ready' },
  });

  async function refresh() {
    setProducts(await listProducts());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onSubmit(values: ProductForm) {
    await createProduct({
      name: values.name,
      category: values.category,
      price: values.price,
      material: values.material ?? null,
      colors: values.colors ? values.colors.split(',').map((c) => c.trim()) : [],
      images: [],
      description: values.description ?? null,
      isNew: values.isNew ?? false,
      isPromo: values.isPromo ?? false,
      stockStatus: values.stockStatus,
    });
    toast({ title: 'Produk ditambahkan' });
    form.reset();
    setOpen(false);
    refresh();
  }

  async function handleDelete(id: number) {
    await deleteProduct(id);
    toast({ title: 'Produk dihapus' });
    refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Kelola Produk</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Tambah Produk</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogTitle>Tambah Produk</DialogTitle>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Produk</Label>
                <Input id="name" {...form.register('name')} />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Kategori</Label>
                <select id="category" {...form.register('category')} className="h-11 rounded-md border border-neutral-text/20 px-3 text-sm">
                  {brand.productTaxonomy.categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input id="price" type="number" {...form.register('price')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="material">{brand.productTaxonomy.attributeLabels.primaryAttribute}</Label>
                <Input id="material" {...form.register('material')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="colors">
                  {brand.productTaxonomy.attributeLabels.secondaryAttribute ?? 'Warna'} (pisahkan dengan koma)
                </Label>
                <Input id="colors" {...form.register('colors')} placeholder="Merah, Biru" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" rows={3} {...form.register('description')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stockStatus">Status Stok</Label>
                <select id="stockStatus" {...form.register('stockStatus')} className="h-11 rounded-md border border-neutral-text/20 px-3 text-sm">
                  <option value="ready">Tersedia</option>
                  <option value="limited">Stok Terbatas</option>
                  <option value="sold_out">Habis</option>
                </select>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...form.register('isNew')} /> Produk Baru
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...form.register('isPromo')} /> Sedang Promo
                </label>
              </div>
              <Button type="submit" className="mt-2">
                Simpan Produk
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {products.length === 0 && <p className="text-sm text-neutral-text/50">Belum ada produk.</p>}
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-neutral-text/10 bg-white p-4">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-neutral-text/50">
                {p.category} &middot; Rp {p.price.toLocaleString('id-ID')}
              </p>
            </div>
            <Button variant="outline" size="default" onClick={() => handleDelete(p.id)}>
              Hapus
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

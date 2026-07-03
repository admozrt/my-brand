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
import { createPromotion, deletePromotion, listPromotions } from '@/lib/db/productRepository';
import type { Promotion } from '@/lib/db/types';

const promoSchema = z.object({
  title: z.string().min(2, 'Judul minimal 2 karakter'),
  description: z.string().optional(),
  discountPercent: z.coerce.number().min(0).max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type PromoForm = z.infer<typeof promoSchema>;

export function PromotionsManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [open, setOpen] = useState(false);
  const form = useForm<PromoForm>({ resolver: zodResolver(promoSchema) });

  async function refresh() {
    setPromotions(await listPromotions());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onSubmit(values: PromoForm) {
    await createPromotion({
      title: values.title,
      description: values.description ?? null,
      discountPercent: values.discountPercent ?? null,
      startDate: values.startDate ?? null,
      endDate: values.endDate ?? null,
      bannerImage: null,
    });
    toast({ title: 'Promo ditambahkan' });
    form.reset();
    setOpen(false);
    refresh();
  }

  async function handleDelete(id: number) {
    await deletePromotion(id);
    toast({ title: 'Promo dihapus' });
    refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Kelola Promo</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Tambah Promo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Tambah Promo</DialogTitle>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Judul Promo</Label>
                <Input id="title" {...form.register('title')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discountPercent">Diskon (%)</Label>
                <Input id="discountPercent" type="number" {...form.register('discountPercent')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" rows={3} {...form.register('description')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Mulai</Label>
                  <Input id="startDate" type="date" {...form.register('startDate')} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">Selesai</Label>
                  <Input id="endDate" type="date" {...form.register('endDate')} />
                </div>
              </div>
              <Button type="submit" className="mt-2">
                Simpan Promo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {promotions.length === 0 && <p className="text-sm text-neutral-text/50">Belum ada promo.</p>}
        {promotions.map((promo) => (
          <div key={promo.id} className="flex items-center justify-between rounded-lg border border-neutral-text/10 bg-white p-4">
            <div>
              <p className="font-medium">{promo.title}</p>
              {promo.discountPercent ? <p className="text-sm text-accent">Diskon {promo.discountPercent}%</p> : null}
            </div>
            <Button variant="outline" onClick={() => handleDelete(promo.id)}>
              Hapus
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

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
import { createTestimonial, deleteTestimonial, listTestimonials } from '@/lib/db/productRepository';
import type { Testimonial } from '@/lib/db/types';

const testimonialSchema = z.object({
  customerName: z.string().min(2, 'Nama minimal 2 karakter'),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(2, 'Komentar tidak boleh kosong'),
});

type TestimonialForm = z.infer<typeof testimonialSchema>;

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [open, setOpen] = useState(false);
  const form = useForm<TestimonialForm>({ resolver: zodResolver(testimonialSchema), defaultValues: { rating: 5 } });

  async function refresh() {
    setTestimonials(await listTestimonials());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onSubmit(values: TestimonialForm) {
    await createTestimonial({
      customerName: values.customerName,
      rating: values.rating,
      comment: values.comment,
      photo: null,
      productId: null,
    });
    toast({ title: 'Testimoni ditambahkan' });
    form.reset();
    setOpen(false);
    refresh();
  }

  async function handleDelete(id: number) {
    await deleteTestimonial(id);
    toast({ title: 'Testimoni dihapus' });
    refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Kelola Testimoni</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Tambah Testimoni</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Tambah Testimoni</DialogTitle>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="customerName">Nama Pelanggan</Label>
                <Input id="customerName" {...form.register('customerName')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input id="rating" type="number" min={1} max={5} {...form.register('rating')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="comment">Komentar</Label>
                <Textarea id="comment" rows={3} {...form.register('comment')} />
              </div>
              <Button type="submit" className="mt-2">
                Simpan Testimoni
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {testimonials.length === 0 && <p className="text-sm text-neutral-text/50">Belum ada testimoni.</p>}
        {testimonials.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-lg border border-neutral-text/10 bg-white p-4">
            <div>
              <p className="font-medium">{t.customerName}</p>
              <p className="text-sm text-neutral-text/50 line-clamp-1">{t.comment}</p>
            </div>
            <Button variant="outline" onClick={() => handleDelete(t.id)}>
              Hapus
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

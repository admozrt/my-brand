import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBrand } from '@/lib/brand/BrandProvider';
import { updateBrandContact } from '@/lib/db/brandRepository';
import { toast } from '@/components/ui/use-toast';

const schema = z.object({
  whatsappNumber: z.string().min(6, 'Nomor WhatsApp tidak valid'),
  whatsappMessageTemplate: z.string().min(1),
  instagramUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  address: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  operatingHours: z.string().optional(),
});

type ContactForm = z.infer<typeof schema>;

export function ContactLocationTab() {
  const brand = useBrand();
  const form = useForm<ContactForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      whatsappNumber: brand.contact.whatsapp,
      whatsappMessageTemplate: brand.contact.whatsappMessageTemplate,
      instagramUrl: brand.contact.instagram,
      tiktokUrl: brand.contact.tiktok,
      address: brand.contact.address,
      mapEmbedUrl: brand.contact.mapEmbedUrl,
      operatingHours: brand.contact.operatingHours,
    },
  });

  async function onSubmit(values: ContactForm) {
    await updateBrandContact(values);
    await brand.refresh();
    toast({ title: 'Kontak & lokasi tersimpan' });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-xl">
      <div className="grid gap-2">
        <Label htmlFor="whatsappNumber">Nomor WhatsApp (format 62...)</Label>
        <Input id="whatsappNumber" {...form.register('whatsappNumber')} placeholder="6281234567890" />
        {form.formState.errors.whatsappNumber && (
          <p className="text-sm text-red-600">{form.formState.errors.whatsappNumber.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="whatsappMessageTemplate">Template Pesan WhatsApp</Label>
        <Input id="whatsappMessageTemplate" {...form.register('whatsappMessageTemplate')} />
        <p className="text-xs text-neutral-text/50">Gunakan {'{{productName}}'} untuk nama produk otomatis.</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="instagramUrl">Instagram</Label>
        <Input id="instagramUrl" {...form.register('instagramUrl')} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="tiktokUrl">TikTok</Label>
        <Input id="tiktokUrl" {...form.register('tiktokUrl')} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Alamat</Label>
        <Textarea id="address" rows={2} {...form.register('address')} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="mapEmbedUrl">URL Embed Peta</Label>
        <Input id="mapEmbedUrl" {...form.register('mapEmbedUrl')} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="operatingHours">Jam Operasional</Label>
        <Input id="operatingHours" {...form.register('operatingHours')} placeholder="Senin–Sabtu, 09.00–17.00 WITA" />
      </div>
      <Button type="submit" className="w-full md:w-fit">
        Simpan Perubahan
      </Button>
    </form>
  );
}

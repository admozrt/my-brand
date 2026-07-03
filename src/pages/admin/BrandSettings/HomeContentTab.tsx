import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBrand } from '@/lib/brand/BrandProvider';
import { updateBrandHomeContent } from '@/lib/db/brandRepository';
import { toast } from '@/components/ui/use-toast';

const schema = z.object({
  heroHeadline: z.string().optional(),
  heroSubheadline: z.string().optional(),
});

type HomeContentForm = z.infer<typeof schema>;

export function HomeContentTab() {
  const brand = useBrand();
  const form = useForm<HomeContentForm>({
    resolver: zodResolver(schema),
    defaultValues: { heroHeadline: brand.content.heroHeadline, heroSubheadline: brand.content.heroSubheadline },
  });

  async function onSubmit(values: HomeContentForm) {
    await updateBrandHomeContent(values);
    await brand.refresh();
    toast({ title: 'Konten beranda tersimpan' });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-xl">
      <div className="grid gap-2">
        <Label htmlFor="heroHeadline">Judul Hero</Label>
        <Input id="heroHeadline" {...form.register('heroHeadline')} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="heroSubheadline">Subjudul Hero</Label>
        <Input id="heroSubheadline" {...form.register('heroSubheadline')} />
      </div>
      <Button type="submit" className="w-full md:w-fit">
        Simpan Perubahan
      </Button>
    </form>
  );
}

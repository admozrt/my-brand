import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBrand } from '@/lib/brand/BrandProvider';
import { updateBrandIdentity } from '@/lib/db/brandRepository';
import { toast } from '@/components/ui/use-toast';
import { applyBrandTheme } from '@/lib/theme/applyBrandTheme';

const brandProfileSchema = z.object({
  brandName: z.string().min(2, 'Nama brand minimal 2 karakter'),
  tagline: z.string().optional(),
  colorPrimary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format warna harus hex, mis. #D4A017'),
  colorSecondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format warna harus hex'),
  colorAccent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format warna harus hex'),
  aboutStory: z.string().optional(),
});

type BrandProfileForm = z.infer<typeof brandProfileSchema>;

export function IdentityThemeTab() {
  const brand = useBrand();

  const form = useForm<BrandProfileForm>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: {
      brandName: brand.meta.brandName,
      tagline: brand.meta.tagline,
      colorPrimary: brand.theme.colors.primary,
      colorSecondary: brand.theme.colors.secondary,
      colorAccent: brand.theme.colors.accent,
      aboutStory: brand.content.aboutStory,
    },
  });

  function previewColors() {
    const v = form.getValues();
    applyBrandTheme({
      ...brand,
      theme: { ...brand.theme, colors: { ...brand.theme.colors, primary: v.colorPrimary, secondary: v.colorSecondary, accent: v.colorAccent } },
    });
  }

  async function onSubmit(values: BrandProfileForm) {
    await updateBrandIdentity(values);
    await brand.refresh();
    toast({ title: 'Pengaturan brand tersimpan', description: 'Jangan lupa Export & Publish agar tampil ke pengunjung.' });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-xl">
      <div className="grid gap-2">
        <Label htmlFor="brandName">Nama Brand</Label>
        <Input id="brandName" {...form.register('brandName')} placeholder="Nadhira Hijab" />
        {form.formState.errors.brandName && (
          <p className="text-sm text-red-600">{form.formState.errors.brandName.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" {...form.register('tagline')} placeholder="Hijab Nyaman, Motif Khas Banjar" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(['colorPrimary', 'colorSecondary', 'colorAccent'] as const).map((field) => (
          <div key={field} className="grid gap-2">
            <Label htmlFor={field} className="capitalize">
              {field.replace('color', '')}
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.watch(field)}
                onChange={(e) => {
                  form.setValue(field, e.target.value);
                  previewColors();
                }}
                className="h-10 w-10 rounded border border-neutral-text/20 cursor-pointer shrink-0"
                aria-label={`Pilih warna ${field}`}
              />
              <Input
                id={field}
                {...form.register(field, { onChange: previewColors })}
                className="flex-1"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="aboutStory">Cerita Brand</Label>
        <Textarea id="aboutStory" {...form.register('aboutStory')} rows={5} />
      </div>

      <Button type="submit" className="w-full md:w-fit">
        Simpan Perubahan
      </Button>
    </form>
  );
}

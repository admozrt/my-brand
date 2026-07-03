import { useBrand } from '@/lib/brand/BrandProvider';
import { updateFeatureFlag } from '@/lib/db/brandRepository';
import { toast } from '@/components/ui/use-toast';

const flagLabels: Record<string, string> = {
  enableWishlist: 'Wishlist',
  enableBlog: 'Blog',
  enableDarkMode: 'Mode Gelap',
  enablePWA: 'Progressive Web App',
  enableSizeCalculator: 'Kalkulator Ukuran',
};

export function FeatureFlagsTab() {
  const brand = useBrand();

  async function toggle(key: string, current: boolean) {
    await updateFeatureFlag(key, !current);
    await brand.refresh();
    toast({ title: 'Pengaturan fitur diperbarui' });
  }

  return (
    <div className="max-w-xl flex flex-col gap-3">
      {Object.entries(brand.featureFlags).map(([key, enabled]) => (
        <label
          key={key}
          className="flex items-center justify-between rounded-lg border border-neutral-text/10 bg-white p-4 cursor-pointer"
        >
          <span className="text-sm font-medium">{flagLabels[key] ?? key}</span>
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => toggle(key, enabled)}
            className="h-5 w-5 accent-primary"
          />
        </label>
      ))}
    </div>
  );
}

import { useBrand } from '@/lib/brand/BrandProvider';

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
}

export function BrandMark({ size = 32 }: { size?: number }) {
  const brand = useBrand();

  if (brand.theme.logoUrl && !brand.theme.logoUrl.includes('placeholder')) {
    return (
      <img
        src={brand.theme.logoUrl}
        alt={brand.meta.brandName}
        style={{ height: size, width: size }}
        className="object-contain"
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label={brand.meta.brandName}
      className="shrink-0"
    >
      <circle cx="16" cy="16" r="16" className="fill-primary" />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        className="fill-white font-heading font-semibold"
        style={{ fontSize: 13 }}
      >
        {initials(brand.meta.brandName)}
      </text>
    </svg>
  );
}

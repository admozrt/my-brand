import { Link } from 'react-router-dom';
import { useBrand } from '@/lib/brand/BrandProvider';
import { BrandMark } from './BrandMark';
import { CraftedByMark } from './CraftedByMark';

export function Footer() {
  const brand = useBrand();

  return (
    <footer className="mt-24 mb-16 md:mb-0 border-t border-neutral-text/8 px-4 md:px-10 py-12 text-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between gap-8">
        <div className="flex items-start gap-3">
          <BrandMark size={36} />
          <div>
            <p className="font-heading font-semibold text-neutral-text">{brand.meta.brandName}</p>
            <p className="mt-1 text-neutral-text/55">{brand.contact.address}</p>
            <p className="text-neutral-text/55">{brand.contact.operatingHours}</p>
          </div>
        </div>
        <div className="flex gap-6 md:items-start">
          {brand.contact.instagram && (
            <a href={brand.contact.instagram} target="_blank" rel="noreferrer" className="text-neutral-text/60 hover:text-primary transition-colors">
              Instagram
            </a>
          )}
          {brand.contact.tiktok && (
            <a href={brand.contact.tiktok} target="_blank" rel="noreferrer" className="text-neutral-text/60 hover:text-primary transition-colors">
              TikTok
            </a>
          )}
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-xs text-neutral-text/35">
          &copy; {new Date().getFullYear()} {brand.meta.brandName}. Seluruh hak cipta dilindungi.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <Link to="/tentang-template" className="text-xs text-neutral-text/45 hover:text-primary transition-colors">
            Ingin situs seperti ini untuk usahamu?
          </Link>
          <CraftedByMark />
        </div>
      </div>
    </footer>
  );
}

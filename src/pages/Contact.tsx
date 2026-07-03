import { useBrand } from '@/lib/brand/BrandProvider';
import { Button } from '@/components/ui/button';

export function Contact() {
  const brand = useBrand();

  return (
    <div className="px-4 md:px-10 py-10 md:py-16 max-w-xl mx-auto">
      <h1 className="font-heading text-2xl md:text-3xl font-semibold text-neutral-text mb-8">Kontak & Lokasi</h1>
      <div className="space-y-3 text-sm">
        <p>
          <span className="text-neutral-text/45">Alamat </span>
          <span className="text-neutral-text/80">{brand.contact.address}</span>
        </p>
        <p>
          <span className="text-neutral-text/45">Jam Operasional </span>
          <span className="text-neutral-text/80">{brand.contact.operatingHours}</span>
        </p>
        {brand.contact.instagram && (
          <p>
            <span className="text-neutral-text/45">Instagram </span>
            <a href={brand.contact.instagram} target="_blank" rel="noreferrer" className="text-primary hover:underline">
              {brand.contact.instagram}
            </a>
          </p>
        )}
      </div>

      {brand.contact.mapEmbedUrl && (
        <div className="mt-8 aspect-video rounded-[1.25rem] overflow-hidden bg-neutral-text/5">
          <iframe src={brand.contact.mapEmbedUrl} className="w-full h-full" loading="lazy" title="Lokasi" />
        </div>
      )}

      <Button asChild className="mt-8 w-full md:w-fit">
        <a href={`https://wa.me/${brand.contact.whatsapp}`} target="_blank" rel="noreferrer">
          Chat WhatsApp
        </a>
      </Button>
    </div>
  );
}

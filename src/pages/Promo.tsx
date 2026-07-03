import { useEffect, useState } from 'react';
import { listPromotions } from '@/lib/db/productRepository';
import type { Promotion } from '@/lib/db/types';

export function Promo() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPromotions().then((all) => {
      setPromotions(all);
      setLoading(false);
    });
  }, []);

  return (
    <div className="px-4 md:px-10 py-10 md:py-16 max-w-5xl mx-auto">
      <h1 className="font-heading text-2xl md:text-3xl font-semibold text-neutral-text mb-8">Promo</h1>
      {loading ? (
        <p className="text-neutral-text/40">Memuat...</p>
      ) : promotions.length === 0 ? (
        <p className="text-neutral-text/40">Belum ada promo aktif saat ini.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {promotions.map((promo) => (
            <div key={promo.id} className="rounded-[1.25rem] overflow-hidden bg-neutral-text/5">
              {promo.bannerImage && (
                <div className="aspect-video overflow-hidden">
                  <img src={promo.bannerImage} alt={promo.title} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <h2 className="font-heading font-semibold text-lg text-neutral-text">{promo.title}</h2>
                {promo.discountPercent ? (
                  <p className="text-accent font-semibold mt-1">Diskon {promo.discountPercent}%</p>
                ) : null}
                {promo.description && <p className="mt-2 text-sm text-neutral-text/60 leading-relaxed">{promo.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

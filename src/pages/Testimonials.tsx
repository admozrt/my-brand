import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { listTestimonials } from '@/lib/db/productRepository';
import type { Testimonial } from '@/lib/db/types';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listTestimonials().then((all) => {
      setTestimonials(all);
      setLoading(false);
    });
  }, []);

  return (
    <div className="px-4 md:px-10 py-10 md:py-16 max-w-4xl mx-auto">
      <h1 className="font-heading text-2xl md:text-3xl font-semibold text-neutral-text mb-10">
        Apa Kata Pelanggan
      </h1>
      {loading ? (
        <p className="text-neutral-text/40">Memuat...</p>
      ) : testimonials.length === 0 ? (
        <p className="text-neutral-text/40">Belum ada testimoni.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
          {testimonials.map((t) => (
            <div key={t.id} className="pb-8 border-b border-neutral-text/8 last:border-0 md:last:border-b">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-3 text-neutral-text/75 leading-relaxed">{t.comment}</p>
              <p className="mt-4 text-sm font-medium text-neutral-text/50">{t.customerName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

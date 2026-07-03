import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Leaf, Package, Truck } from 'lucide-react';
import { useBrand } from '@/lib/brand/BrandProvider';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { listProducts, listTestimonials } from '@/lib/db/productRepository';
import type { Product, Testimonial } from '@/lib/db/types';

const differentiators = [
  { icon: Leaf, title: 'Motif Lokal', body: 'Setiap corak terinspirasi kain sasirangan khas Kalimantan Selatan.' },
  { icon: Package, title: 'Bahan Adem', body: 'Voal dan katun ceruty premium, nyaman dipakai seharian.' },
  { icon: Truck, title: 'Respon Cepat', body: 'Tanya stok dan ukuran langsung dibalas lewat WhatsApp.' },
];

export function Home() {
  const brand = useBrand();
  const reduce = useReducedMotion();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listProducts(), listTestimonials()]).then(([products, allTestimonials]) => {
      setFeatured(products.slice(0, 4));
      setTestimonials(allTestimonials.slice(0, 2));
      setLoading(false);
    });
  }, []);

  const heroImage = brand.theme.heroImages[0];

  return (
    <div>
      {/* Hero */}
      <section className="px-4 md:px-10 pt-10 md:pt-20 pb-14 md:pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 md:order-1"
          >
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-neutral-text">
              {brand.content.heroHeadline || brand.meta.tagline}
            </h1>
            <p className="mt-5 text-base md:text-lg text-neutral-text/60 max-w-md leading-relaxed">
              {brand.content.heroSubheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/katalog">Lihat Katalog</Link>
              </Button>
              <Button asChild variant="outline">
                <a href={`https://wa.me/${brand.contact.whatsapp}`} target="_blank" rel="noreferrer">
                  Chat WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 md:order-2 aspect-4/5 rounded-[1.25rem] overflow-hidden bg-neutral-text/5"
          >
            {heroImage && (
              <img src={heroImage} alt={brand.meta.brandName} className="h-full w-full object-cover" />
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured products */}
      <section className="px-4 md:px-10 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-neutral-text">Koleksi Unggulan</h2>
            <Link to="/katalog" className="text-sm font-medium text-primary hover:underline">
              Lihat semua
            </Link>
          </div>
          <ProductGrid products={featured} isLoading={loading} />
        </div>
      </section>

      {/* Brand story - image/text split */}
      <section className="px-4 md:px-10 py-14 md:py-20 bg-neutral-text/[0.025]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="aspect-square rounded-[1.25rem] overflow-hidden bg-neutral-text/5 order-1">
            <img
              src="https://picsum.photos/seed/nadhira-story-craft/900/900"
              alt="Proses pembuatan sasirangan"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="order-2">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-neutral-text">Cerita Brand</h2>
            <p className="mt-5 text-neutral-text/65 leading-relaxed max-w-md">{brand.content.aboutStory}</p>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="px-4 md:px-10 py-14 md:py-20">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-6">
          {differentiators.map((item, i) => (
            <motion.div
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <item.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <h3 className="mt-4 font-heading font-semibold text-neutral-text">{item.title}</h3>
              <p className="mt-1.5 text-sm text-neutral-text/60 leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials teaser */}
      {testimonials.length > 0 && (
        <section className="px-4 md:px-10 py-14 md:py-20 bg-neutral-text/[0.025]">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-neutral-text mb-8">
              Apa kata pelanggan
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <div key={t.id}>
                  <p className="text-neutral-text/75 leading-relaxed text-lg">&ldquo;{t.comment}&rdquo;</p>
                  <p className="mt-4 text-sm font-medium text-neutral-text/50">{t.customerName}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA band */}
      <section className="px-4 md:px-10 py-16 md:py-24">
        <div className="max-w-6xl mx-auto rounded-[1.25rem] bg-primary text-white px-8 md:px-16 py-12 md:py-16 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold">Ada yang ingin ditanyakan?</h2>
          <p className="mt-3 text-white/75 max-w-md mx-auto">
            Tim kami siap bantu pilihkan motif dan ukuran yang pas untukmu.
          </p>
          <Button asChild variant="outline" className="mt-7 border-white/30 text-white hover:bg-white/10">
            <a href={`https://wa.me/${brand.contact.whatsapp}`} target="_blank" rel="noreferrer">
              Chat WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ShoppingBag, MessageCircle, SlidersHorizontal, Wallet, ArrowRight } from 'lucide-react';
import { useBrand } from '@/lib/brand/BrandProvider';
import { Button } from '@/components/ui/button';
import { PosterHero } from '@/components/home/PosterHero';

const EASE = [0.16, 1, 0.3, 1] as const;

const benefits = [
  {
    icon: ShoppingBag,
    title: 'Katalog produk online',
    body: 'Pelanggan bisa lihat semua produk, harga, dan stok kapan saja tanpa nunggu di-reply.',
    tone: 'primary',
  },
  {
    icon: MessageCircle,
    title: 'Chat WhatsApp otomatis',
    body: 'Tombol tanya produk langsung buka WhatsApp dengan pesan yang sudah terisi.',
    tone: 'plain',
  },
  {
    icon: SlidersHorizontal,
    title: 'Kelola sendiri, tanpa developer',
    body: 'Tambah produk, ubah harga, ganti warna brand, semua dari dashboard sendiri.',
    tone: 'plain',
  },
  {
    icon: Wallet,
    title: 'Tanpa biaya bulanan',
    body: 'Hosting gratis. Yang kamu bayar cuma sekali di awal untuk setup.',
    tone: 'accent',
  },
];

const steps = [
  { title: 'Ceritakan produkmu', body: 'Kirim nama usaha, produk, dan kontak WhatsApp lewat developer.' },
  { title: 'Kami siapkan situsnya', body: 'Katalog, warna, dan logo disesuaikan dengan brand kamu.' },
  { title: 'Situs siap dipakai', body: 'Tinggal bagikan link ke pelanggan lewat Instagram atau story WA.' },
];

export function TemplatePromo() {
  const brand = useBrand();
  const reduce = useReducedMotion();
  const heroImage = brand.theme.heroImages[0];

  return (
    <div>
      <PosterHero
        headline="Website profesional untuk usahamu, siap dalam sehari"
        subheadline="Katalog produk, kontak WhatsApp otomatis, dan tampilan modern, tanpa perlu ngerti coding."
        image={heroImage}
        imageAlt="Contoh tampilan situs UMKM"
        badgeLabel="Gratis Hosting"
        primaryCta={{ label: 'Lihat Contoh Situs', to: '/' }}
        secondaryCta={{ label: 'Hubungi Developer', href: 'https://admoz.pages.dev' }}
      />

      {/* Manfaat - bento asimetris */}
      <section className="px-4 md:px-10 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-neutral-text max-w-md">
            Semua yang usahamu butuhkan, sudah tersedia
          </h2>
          <div className="mt-8 grid sm:grid-cols-2 gap-4 md:gap-5">
            {benefits.map((item, i) => (
              <motion.div
                key={item.title}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
                className={
                  item.tone === 'primary'
                    ? 'rounded-[1.25rem] bg-primary text-white p-6 md:p-7'
                    : item.tone === 'accent'
                      ? 'rounded-[1.25rem] bg-accent text-white p-6 md:p-7'
                      : 'rounded-[1.25rem] bg-neutral-text/[0.03] p-6 md:p-7'
                }
              >
                <item.icon
                  className={item.tone === 'plain' ? 'h-6 w-6 text-primary' : 'h-6 w-6 text-white'}
                  strokeWidth={1.5}
                />
                <h3 className="mt-4 font-heading font-semibold">{item.title}</h3>
                <p className={item.tone === 'plain' ? 'mt-1.5 text-sm text-neutral-text/60 leading-relaxed' : 'mt-1.5 text-sm text-white/80 leading-relaxed'}>
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bukti nyata - showcase demo */}
      <section className="px-4 md:px-10 py-14 md:py-20 bg-neutral-text/[0.025]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-neutral-text">
              Ini contoh nyata, bukan mockup
            </h2>
            <p className="mt-5 text-neutral-text/65 leading-relaxed max-w-md">
              {brand.meta.brandName} sudah pakai template ini untuk jualan hijab sasirangan khas Kalimantan
              Selatan. Katalog, warna, sampai cerita brand semuanya bisa disesuaikan seperti ini untuk
              usahamu.
            </p>
            <Button asChild className="mt-7">
              <Link to="/">Lihat Contoh Situs</Link>
            </Button>
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="order-1 md:order-2 aspect-4/5 rounded-[1.25rem] overflow-hidden bg-neutral-text/5"
          >
            {heroImage && (
              <img src={heroImage} alt={`Tampilan situs ${brand.meta.brandName}`} className="h-full w-full object-cover" />
            )}
          </motion.div>
        </div>
      </section>

      {/* Proses */}
      <section className="px-4 md:px-10 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-neutral-text max-w-md">
            Tiga langkah sampai situsmu online
          </h2>
          <div className="mt-10 flex flex-col md:flex-row gap-8 md:gap-6 md:items-start">
            {steps.map((step, i) => (
              <Fragment key={step.title}>
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: i * 0.1, ease: EASE }}
                  className="flex-1"
                >
                  <h3 className="font-heading font-semibold text-neutral-text">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-neutral-text/60 leading-relaxed">{step.body}</p>
                </motion.div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block h-5 w-5 text-neutral-text/25 mt-1.5 shrink-0" strokeWidth={1.5} />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* CTA akhir */}
      <section className="px-4 md:px-10 py-16 md:py-24">
        <div className="max-w-6xl mx-auto rounded-[1.25rem] bg-primary text-white px-8 md:px-16 py-12 md:py-16 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold">Siap punya situs sendiri?</h2>
          <p className="mt-3 text-white/75 max-w-md mx-auto">
            Ceritakan usahamu dan kami bantu siapkan situsnya.
          </p>
          <Button asChild variant="outline" className="mt-7 border-white/30 text-white hover:bg-white/10">
            <a href="https://admoz.pages.dev" target="_blank" rel="noreferrer">
              Hubungi Developer
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

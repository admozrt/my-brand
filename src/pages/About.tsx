import { useBrand } from '@/lib/brand/BrandProvider';

export function About() {
  const brand = useBrand();

  return (
    <div className="px-4 md:px-10 py-10 md:py-16 max-w-3xl mx-auto">
      <h1 className="font-heading text-2xl md:text-3xl font-semibold text-neutral-text mb-8">
        Tentang {brand.meta.brandName}
      </h1>
      <div className="aspect-16/9 rounded-[1.25rem] overflow-hidden bg-neutral-text/5 mb-8">
        <img
          src="https://picsum.photos/seed/nadhira-about-workshop/1200/675"
          alt={`Proses produksi ${brand.meta.brandName}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <p className="text-neutral-text/65 leading-relaxed whitespace-pre-line text-base md:text-lg">
        {brand.content.aboutStory}
      </p>
    </div>
  );
}

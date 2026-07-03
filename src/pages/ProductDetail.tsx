import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useBrand } from '@/lib/brand/BrandProvider';
import { getProductById } from '@/lib/db/productRepository';
import type { Product } from '@/lib/db/types';

export function ProductDetail() {
  const { id } = useParams();
  const brand = useBrand();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    setProduct(undefined);
    getProductById(Number(id)).then(setProduct);
  }, [id]);

  if (product === undefined) {
    return <div className="px-4 py-24 text-center text-neutral-text/40">Memuat...</div>;
  }

  if (product === null) {
    return (
      <div className="px-4 py-24 text-center">
        <p className="text-neutral-text/60">Produk tidak ditemukan.</p>
        <Link to="/katalog" className="text-primary underline mt-2 inline-block">
          Kembali ke katalog
        </Link>
      </div>
    );
  }

  const waMessage = brand.contact.whatsappMessageTemplate.replace('{{productName}}', product.name);
  const waLink = `https://wa.me/${brand.contact.whatsapp}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="px-4 md:px-10 py-10 md:py-16 grid md:grid-cols-2 gap-10 md:gap-16 max-w-5xl mx-auto">
      <div className="aspect-4/5 rounded-[1.25rem] bg-neutral-text/5 overflow-hidden">
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-neutral-text/30 text-sm">Tanpa Foto</span>
          </div>
        )}
      </div>
      <div className="py-2">
        <h1 className="font-heading text-2xl md:text-3xl font-semibold text-neutral-text leading-tight">
          {product.name}
        </h1>
        <p className="mt-3 text-xl font-heading font-semibold text-primary">
          Rp {product.price.toLocaleString('id-ID')}
        </p>

        <dl className="mt-8 space-y-3 text-sm border-t border-neutral-text/8 pt-6">
          {product.material && (
            <div className="flex gap-4">
              <dt className="text-neutral-text/45 w-28 shrink-0">{brand.productTaxonomy.attributeLabels.primaryAttribute}</dt>
              <dd className="text-neutral-text/85">{product.material}</dd>
            </div>
          )}
          {product.colors.length > 0 && (
            <div className="flex gap-4">
              <dt className="text-neutral-text/45 w-28 shrink-0">
                {brand.productTaxonomy.attributeLabels.secondaryAttribute ?? 'Warna'}
              </dt>
              <dd className="text-neutral-text/85">{product.colors.join(', ')}</dd>
            </div>
          )}
        </dl>

        {product.description && (
          <p className="mt-6 text-neutral-text/65 leading-relaxed">{product.description}</p>
        )}

        <Button asChild className="mt-8 w-full md:w-fit">
          <a href={waLink} target="_blank" rel="noreferrer">
            Chat WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}

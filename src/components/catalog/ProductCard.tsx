import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/db/types';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/katalog/${product.id}`}
      className="group block"
    >
      <div className="relative aspect-4/5 overflow-hidden rounded-[1.25rem] bg-neutral-text/5">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-neutral-text/30">Tanpa Foto</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.isNew && <Badge>Baru</Badge>}
          {product.stockStatus === 'limited' && <Badge>Stok Terbatas</Badge>}
        </div>
        {product.isPromo && (
          <Badge variant="accent" className="absolute top-3 right-3">
            Diskon
          </Badge>
        )}
      </div>
      <div className="pt-3.5">
        <h3 className="font-body text-sm text-neutral-text/90 line-clamp-1">{product.name}</h3>
        <p className="mt-1 font-heading font-semibold text-neutral-text text-sm md:text-base">
          Rp {product.price.toLocaleString('id-ID')}
        </p>
      </div>
    </Link>
  );
}

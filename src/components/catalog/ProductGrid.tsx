import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/db/types';

export function ProductGrid({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-4/5 rounded-[1.25rem] bg-neutral-text/8 animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-sm text-neutral-text/50 py-12 text-center">Belum ada produk yang cocok.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.2) }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}

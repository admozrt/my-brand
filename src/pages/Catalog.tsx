import { useEffect, useMemo, useState } from 'react';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { ProductFilter, type FilterState } from '@/components/catalog/ProductFilter';
import { Input } from '@/components/ui/input';
import { listProducts } from '@/lib/db/productRepository';
import type { Product } from '@/lib/db/types';

export function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterState>({ category: null, sort: 'newest' });

  useEffect(() => {
    listProducts().then((all) => {
      setProducts(all);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (filter.category) list = list.filter((p) => p.category === filter.category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (filter.sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (filter.sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [products, filter, search]);

  return (
    <div className="px-4 md:px-10 py-10 md:py-16 max-w-6xl mx-auto">
      <h1 className="font-heading text-2xl md:text-3xl font-semibold text-neutral-text mb-8">Katalog Produk</h1>
      <Input
        placeholder="Cari produk..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 lg:max-w-sm"
      />
      <div className="lg:flex lg:items-start">
        <ProductFilter value={filter} onChange={setFilter} />
        <div className="flex-1">
          <ProductGrid products={filtered} isLoading={loading} />
        </div>
      </div>
    </div>
  );
}

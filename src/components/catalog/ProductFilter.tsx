import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { useBrand } from '@/lib/brand/BrandProvider';

export interface FilterState {
  category: string | null;
  sort: 'newest' | 'price-asc' | 'price-desc';
}

function FilterFields({ value, onChange }: { value: FilterState; onChange: (v: FilterState) => void }) {
  const brand = useBrand();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-heading font-semibold mb-3">Kategori</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange({ ...value, category: null })}
            className={`px-3.5 py-2 min-h-[44px] rounded-full text-sm border transition-colors
              ${value.category === null ? 'bg-primary text-white border-primary' : 'border-neutral-text/15 text-neutral-text/70 hover:border-neutral-text/30'}`}
          >
            Semua
          </button>
          {brand.productTaxonomy.categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onChange({ ...value, category: cat.slug })}
              className={`px-3.5 py-2 min-h-[44px] rounded-full text-sm border transition-colors
                ${value.category === cat.slug ? 'bg-primary text-white border-primary' : 'border-neutral-text/15 text-neutral-text/70 hover:border-neutral-text/30'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-heading font-semibold mb-3">Urutkan</h3>
        <select
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value as FilterState['sort'] })}
          className="w-full h-11 rounded-xl border border-neutral-text/15 bg-white px-3 text-sm"
        >
          <option value="newest">Terbaru</option>
          <option value="price-asc">Termurah</option>
          <option value="price-desc">Termahal</option>
        </select>
      </div>
    </div>
  );
}

export function ProductFilter({ value, onChange }: { value: FilterState; onChange: (v: FilterState) => void }) {
  return (
    <>
      <div className="lg:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filter & Urutkan
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto p-6">
            <FilterFields value={value} onChange={onChange} />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:block w-64 shrink-0 pr-8">
        <FilterFields value={value} onChange={onChange} />
      </aside>
    </>
  );
}

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { BrandConfig } from './types';
import { loadBrandConfigFromDb } from './loadBrandConfig';
import { applyBrandTheme } from '@/lib/theme/applyBrandTheme';
import { getDb } from '@/lib/db/client';

interface BrandContextValue extends BrandConfig {
  refresh: () => Promise<void>;
}

const BrandContext = createContext<BrandContextValue | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<BrandConfig | null>(null);

  const refresh = useCallback(async () => {
    const db = await getDb();
    const loaded = loadBrandConfigFromDb(db);
    applyBrandTheme(loaded);
    setConfig(loaded);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutral-text/60">
        Memuat...
      </div>
    );
  }

  return <BrandContext.Provider value={{ ...config, refresh }}>{children}</BrandContext.Provider>;
}

export function useBrand(): BrandContextValue {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand harus dipakai di dalam <BrandProvider>');
  return ctx;
}

import { hexToHslTriplet } from './colorUtils';
import type { BrandConfig } from '@/lib/brand/types';

export function applyBrandTheme(config: BrandConfig) {
  const root = document.documentElement;
  const { colors } = config.theme;

  root.style.setProperty('--color-primary', hexToHslTriplet(colors.primary));
  root.style.setProperty('--color-secondary', hexToHslTriplet(colors.secondary));
  root.style.setProperty('--color-accent', hexToHslTriplet(colors.accent));
  root.style.setProperty('--color-neutral-bg', hexToHslTriplet(colors.neutralBg));
  root.style.setProperty('--color-neutral-text', hexToHslTriplet(colors.neutralText));
  root.style.setProperty('--font-heading', config.theme.fontHeading);
  root.style.setProperty('--font-body', config.theme.fontBody);

  document.title = config.meta.brandName;
}

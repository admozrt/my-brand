export interface BrandConfig {
  meta: { brandId: string; brandName: string; tagline: string; category: string };
  theme: {
    colors: { primary: string; secondary: string; accent: string; neutralBg: string; neutralText: string };
    fontHeading: string;
    fontBody: string;
    logoUrl: string;
    faviconUrl: string;
    heroImages: string[];
  };
  content: { aboutStory: string; heroHeadline: string; heroSubheadline: string };
  productTaxonomy: {
    categories: { slug: string; label: string }[];
    attributeLabels: { primaryAttribute: string; secondaryAttribute?: string };
    sizeChartEnabled: boolean;
  };
  contact: {
    whatsapp: string;
    whatsappMessageTemplate: string;
    instagram?: string;
    tiktok?: string;
    address: string;
    mapEmbedUrl?: string;
    operatingHours: string;
  };
  featureFlags: Record<
    'enableWishlist' | 'enableBlog' | 'enableDarkMode' | 'enablePWA' | 'enableSizeCalculator',
    boolean
  >;
}

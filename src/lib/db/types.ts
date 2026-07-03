export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  material: string | null;
  colors: string[];
  images: string[];
  description: string | null;
  isNew: boolean;
  isPromo: boolean;
  stockStatus: 'ready' | 'limited' | 'sold_out' | string;
  createdAt: string | null;
}

export interface Promotion {
  id: number;
  title: string;
  description: string | null;
  discountPercent: number | null;
  startDate: string | null;
  endDate: string | null;
  bannerImage: string | null;
}

export interface Testimonial {
  id: number;
  customerName: string | null;
  rating: number | null;
  comment: string | null;
  photo: string | null;
  productId: number | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

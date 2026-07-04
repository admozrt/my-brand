import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PromoLayout } from '@/components/layout/PromoLayout';
import { Home } from '@/pages/Home';
import { Catalog } from '@/pages/Catalog';
import { ProductDetail } from '@/pages/ProductDetail';
import { Promo } from '@/pages/Promo';
import { About } from '@/pages/About';
import { Testimonials } from '@/pages/Testimonials';
import { Contact } from '@/pages/Contact';
import { TemplatePromo } from '@/pages/TemplatePromo';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { ProductsManager } from '@/pages/admin/ProductsManager';
import { PromotionsManager } from '@/pages/admin/PromotionsManager';
import { TestimonialsManager } from '@/pages/admin/TestimonialsManager';
import { BrandSettings } from '@/pages/admin/BrandSettings';
import { ExportImport } from '@/pages/admin/ExportImport';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/katalog', element: <Catalog /> },
      { path: '/katalog/:id', element: <ProductDetail /> },
      { path: '/promo', element: <Promo /> },
      { path: '/tentang', element: <About /> },
      { path: '/testimoni', element: <Testimonials /> },
      { path: '/kontak', element: <Contact /> },
    ],
  },
  {
    element: <PromoLayout />,
    children: [{ path: '/beranda', element: <TemplatePromo /> }],
  },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <ProductsManager /> },
      { path: 'promo', element: <PromotionsManager /> },
      { path: 'testimoni', element: <TestimonialsManager /> },
      { path: 'brand/*', element: <BrandSettings /> },
      { path: 'export', element: <ExportImport /> },
    ],
  },
]);

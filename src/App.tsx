import { RouterProvider } from 'react-router-dom';
import { BrandProvider } from '@/lib/brand/BrandProvider';
import { router } from '@/router';

export function App() {
  return (
    <BrandProvider>
      <RouterProvider router={router} />
    </BrandProvider>
  );
}

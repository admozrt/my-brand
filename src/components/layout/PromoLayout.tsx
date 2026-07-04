import { Outlet } from 'react-router-dom';
import { PromoHeader } from './PromoHeader';
import { PromoFooter } from './PromoFooter';

export function PromoLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PromoHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PromoFooter />
    </div>
  );
}

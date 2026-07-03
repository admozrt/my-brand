import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/lib/admin/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/Toaster';
import { CraftedByMark } from '@/components/layout/CraftedByMark';
import { cn } from '@/lib/utils';

const links = [
  { to: '/admin', label: 'Produk', end: true },
  { to: '/admin/promo', label: 'Promo' },
  { to: '/admin/testimoni', label: 'Testimoni' },
  { to: '/admin/brand', label: 'Pengaturan Brand' },
  { to: '/admin/export', label: 'Export/Import' },
];

export function AdminLayout() {
  const isAuthenticated = useAdminAuth((s) => s.isAuthenticated);
  const logout = useAdminAuth((s) => s.logout);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-neutral-text/10 bg-white md:flex md:flex-col md:min-h-screen">
        <div className="p-4 flex items-center justify-between md:block">
          <h2 className="font-heading font-bold">Dashboard Admin</h2>
        </div>
        <nav className="flex md:flex-col gap-1 px-2 pb-2 overflow-x-auto md:overflow-visible">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 rounded-md text-sm whitespace-nowrap min-h-[44px] flex items-center',
                  isActive ? 'bg-primary text-white' : 'hover:bg-neutral-text/5'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4">
          <Button variant="outline" className="w-full" onClick={logout}>
            Keluar
          </Button>
        </div>
        <div className="hidden md:block px-4 pb-4 mt-auto">
          <CraftedByMark />
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
        <div className="md:hidden mt-10">
          <CraftedByMark />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Tag, MessageCircle, Menu } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { BrandMark } from './BrandMark';
import { useBrand } from '@/lib/brand/BrandProvider';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Beranda', icon: Home },
  { to: '/katalog', label: 'Katalog', icon: ShoppingBag },
  { to: '/promo', label: 'Promo', icon: Tag },
  { to: '/kontak', label: 'Kontak', icon: MessageCircle },
];

const secondaryLinks = [
  { to: '/tentang', label: 'Tentang' },
  { to: '/testimoni', label: 'Testimoni' },
];

export function Navbar() {
  const brand = useBrand();
  const { pathname } = useLocation();

  return (
    <>
      <header className="hidden md:flex items-center justify-between h-[72px] px-6 lg:px-10 bg-neutral-bg/90 backdrop-blur-sm border-b border-neutral-text/8 sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2.5 font-heading text-lg font-semibold text-neutral-text shrink-0">
          <BrandMark size={30} />
          {brand.meta.brandName}
        </Link>
        <nav className="flex items-center gap-7 mx-6">
          {[...navItems, ...secondaryLinks].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'text-sm font-medium transition-colors whitespace-nowrap',
                pathname === to ? 'text-primary' : 'text-neutral-text/60 hover:text-neutral-text'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Button asChild size="default" className="shrink-0">
          <a href={`https://wa.me/${brand.contact.whatsapp}`} target="_blank" rel="noreferrer">
            Chat WhatsApp
          </a>
        </Button>
      </header>

      <header className="flex md:hidden items-center justify-between px-4 h-16 bg-neutral-bg/90 backdrop-blur-sm border-b border-neutral-text/8 sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <BrandMark size={28} />
          <span className="font-heading font-semibold text-neutral-text">{brand.meta.brandName}</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Buka menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0">
            <div className="flex items-center gap-2.5 px-5 pr-14 h-16 border-b border-neutral-text/8 shrink-0">
              <BrandMark size={26} />
              <span className="font-heading font-semibold text-neutral-text">{brand.meta.brandName}</span>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {navItems.map(({ to, label, icon: Icon }) => (
                <SheetClose asChild key={to}>
                  <Link
                    to={to}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-3 min-h-[44px] text-base font-medium',
                      pathname === to ? 'bg-primary/8 text-primary' : 'text-neutral-text hover:bg-neutral-text/5'
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                    {label}
                  </Link>
                </SheetClose>
              ))}

              <div className="my-3 border-t border-neutral-text/8" />

              {secondaryLinks.map(({ to, label }) => (
                <SheetClose asChild key={to}>
                  <Link
                    to={to}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-3 min-h-[44px] text-base font-medium',
                      pathname === to ? 'bg-primary/8 text-primary' : 'text-neutral-text hover:bg-neutral-text/5'
                    )}
                  >
                    {label}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            <div className="p-4 border-t border-neutral-text/8 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <Button asChild className="w-full">
                <a href={`https://wa.me/${brand.contact.whatsapp}`} target="_blank" rel="noreferrer">
                  Chat WhatsApp
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <nav
        className="fixed bottom-0 inset-x-0 z-40 flex md:hidden items-center justify-around
                   bg-neutral-bg/95 backdrop-blur-sm border-t border-neutral-text/8 py-2 pb-[env(safe-area-inset-bottom)]"
      >
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-1 min-w-[44px] min-h-[44px] justify-center',
              pathname === to ? 'text-primary' : 'text-neutral-text/50'
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

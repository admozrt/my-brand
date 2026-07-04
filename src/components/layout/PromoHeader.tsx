import { Link } from 'react-router-dom';

export function PromoHeader() {
  return (
    <header className="flex items-center justify-between px-4 md:px-10 h-16 md:h-[72px] border-b border-neutral-text/8 sticky top-0 z-40 bg-neutral-bg/90 backdrop-blur-sm">
      <Link to="/tentang-template" className="font-heading font-semibold text-neutral-text">
        Template UMKM
      </Link>
      <div className="flex items-center gap-4 md:gap-6">
        <Link to="/" className="text-sm font-medium text-neutral-text/60 hover:text-neutral-text transition-colors">
          Lihat Demo
        </Link>
        <a
          href="https://admoz.pages.dev"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium bg-primary text-white rounded-full px-4 py-2 min-h-[40px] flex items-center hover:bg-primary/90 transition-colors"
        >
          Hubungi Developer
        </a>
      </div>
    </header>
  );
}

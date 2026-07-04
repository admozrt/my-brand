import { Link } from 'react-router-dom';
import { CraftedByMark } from './CraftedByMark';

export function PromoFooter() {
  return (
    <footer className="mt-24 border-t border-neutral-text/8 px-4 md:px-10 py-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
        <Link to="/" className="text-neutral-text/60 hover:text-primary transition-colors">
          Lihat contoh situs demo
        </Link>
        <CraftedByMark />
      </div>
    </footer>
  );
}

import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { IdentityThemeTab } from './IdentityThemeTab';
import { CategoriesTab } from './CategoriesTab';
import { ContactLocationTab } from './ContactLocationTab';
import { HomeContentTab } from './HomeContentTab';
import { FeatureFlagsTab } from './FeatureFlagsTab';

const tabs = [
  { to: '', label: 'Identitas & Tema', end: true },
  { to: 'kategori', label: 'Kategori & Atribut' },
  { to: 'kontak', label: 'Kontak & Lokasi' },
  { to: 'konten', label: 'Konten Beranda' },
  { to: 'fitur', label: 'Fitur' },
];

export function BrandSettings() {
  return (
    <div>
      <h1 className="font-heading text-xl font-bold mb-6">Pengaturan Brand</h1>
      <div className="flex gap-1 mb-6 overflow-x-auto border-b border-neutral-text/10">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                'px-4 py-2 text-sm whitespace-nowrap border-b-2 -mb-px',
                isActive ? 'border-primary text-primary font-medium' : 'border-transparent text-neutral-text/60'
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index element={<IdentityThemeTab />} />
        <Route path="kategori" element={<CategoriesTab />} />
        <Route path="kontak" element={<ContactLocationTab />} />
        <Route path="konten" element={<HomeContentTab />} />
        <Route path="fitur" element={<FeatureFlagsTab />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </div>
  );
}

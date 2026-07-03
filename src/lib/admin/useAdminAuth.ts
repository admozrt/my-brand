import { create } from 'zustand';

const SESSION_KEY = 'admin-session';
/** MVP: password lokal sederhana, tanpa backend. Bisa dipindah ke brand_profile di iterasi berikutnya. */
const ADMIN_PASSWORD = 'admin123';

interface AdminAuthStore {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

export const useAdminAuth = create<AdminAuthStore>((set) => ({
  isAuthenticated: sessionStorage.getItem(SESSION_KEY) === '1',
  login: (password: string) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ isAuthenticated: false });
  },
}));

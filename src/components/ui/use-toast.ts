import { create } from 'zustand';

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
}

interface ToastStore {
  toasts: ToastMessage[];
  push: (t: Omit<ToastMessage, 'id'>) => void;
  dismiss: (id: number) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (t) =>
    set((s) => ({ toasts: [...s.toasts, { ...t, id: Date.now() + Math.random() }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

export function toast(t: { title: string; description?: string }) {
  useToastStore.getState().push(t);
  const id = useToastStore.getState().toasts.at(-1)?.id;
  if (id !== undefined) {
    setTimeout(() => useToastStore.getState().dismiss(id), 3500);
  }
}

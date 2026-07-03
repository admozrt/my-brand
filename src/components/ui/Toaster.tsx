import { useToastStore } from './use-toast';

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-xs">
      {toasts.map((t) => (
        <div key={t.id} className="rounded-lg bg-neutral-text text-neutral-bg px-4 py-3 shadow-lg text-sm">
          <p className="font-semibold">{t.title}</p>
          {t.description && <p className="opacity-80 mt-0.5">{t.description}</p>}
        </div>
      ))}
    </div>
  );
}

import { cn } from '@/lib/utils';

export function CraftedByMark({ className }: { className?: string }) {
  return (
    <p className={cn('text-xs text-neutral-text/35', className)}>
      Crafted by{' '}
      <a
        href="https://admoz.pages.dev"
        target="_blank"
        rel="noreferrer"
        className="text-neutral-text/50 hover:text-primary transition-colors underline underline-offset-2"
      >
        Dirakhmat
      </a>
    </p>
  );
}

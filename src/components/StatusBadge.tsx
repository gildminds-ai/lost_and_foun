import type { ItemStatus } from '@/types';

const STYLES: Record<ItemStatus, string> = {
  lost: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  found: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};

const DOT: Record<ItemStatus, string> = {
  lost: 'bg-rose-500',
  found: 'bg-emerald-500',
};

export function StatusBadge({
  status,
  size = 'md',
}: {
  status: ItemStatus;
  size?: 'sm' | 'md';
}) {
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wide ring-1 ring-inset ${pad} ${STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} />
      {status}
    </span>
  );
}

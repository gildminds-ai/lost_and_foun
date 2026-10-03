import { MapPin, CalendarDays, Tag } from 'lucide-react';
import type { Item } from '@/types';
import { StatusBadge } from './StatusBadge';

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ItemCard({
  item,
  onView,
}: {
  item: Item;
  onView: (id: string) => void;
}) {
  return (
    <article className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <button
        onClick={() => onView(item.id)}
        className="block w-full text-left"
        aria-label={`View details for ${item.name}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3">
            <StatusBadge status={item.status} />
          </div>
        </div>
        <div className="p-4">
          <h3 className="truncate text-base font-bold text-slate-900">
            {item.name}
          </h3>
          <div className="mt-2 space-y-1.5 text-sm text-slate-500">
            <p className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{item.category}</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{item.location}</span>
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{formatDate(item.date)}</span>
            </p>
          </div>
        </div>
      </button>
      <div className="px-4 pb-4">
        <button
          onClick={() => onView(item.id)}
          className="btn-secondary w-full"
        >
          View Details
        </button>
      </div>
    </article>
  );
}

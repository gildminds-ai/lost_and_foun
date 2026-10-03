import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Inbox } from 'lucide-react';
import type { Item, ItemStatus } from '@/types';
import { CATEGORIES } from '@/types';
import { ItemCard } from '@/components/ItemCard';

type Filter = 'all' | ItemStatus;

export function BrowsePage({
  items,
  onView,
}: {
  items: Item[];
  onView: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [category, setCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (filter !== 'all' && it.status !== filter) return false;
      if (category !== 'all' && it.category !== category) return false;
      if (!q) return true;
      return (
        it.name.toLowerCase().includes(q) ||
        it.location.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q)
      );
    });
  }, [items, query, filter, category]);

  const filterBtn = (key: Filter, label: string) => (
    <button
      onClick={() => setFilter(key)}
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
        filter === key
          ? 'bg-slate-900 text-white'
          : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Browse Items
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Search through items reported lost or found across campus.
        </p>
      </div>

      {/* Search + filters */}
      <div className="card p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by item name, location, or keyword..."
            className="input pl-10"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Status
          </span>
          {filterBtn('all', 'All')}
          {filterBtn('lost', 'Lost')}
          {filterBtn('found', 'Found')}
          <div className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="mt-5 mb-4 text-sm text-slate-500">
        {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
      </p>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
          <Inbox className="h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-700">
            No matching items
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Try a different search term or adjust your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} onView={onView} />
          ))}
        </div>
      )}
    </div>
  );
}

import { ArrowRight, Search, PackageSearch, PackagePlus, Sparkles } from 'lucide-react';
import type { Item } from '@/types';
import { ItemCard } from '@/components/ItemCard';

export function HomePage({
  items,
  onView,
  onNavigate,
}: {
  items: Item[];
  onView: (id: string) => void;
  onNavigate: (p: 'home' | 'browse' | 'report') => void;
}) {
  const featured = items.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-teal-500">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-inset ring-white/25">
              <Sparkles className="h-3.5 w-3.5" />
              Campus Lost &amp; Found
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Lost something? Found something? Help get it back.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-50/90 sm:text-lg">
              A simple way for students to report lost items, post found ones,
              and reconnect belongings with their owners across campus.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('report')}
                className="btn bg-white text-brand-700 hover:bg-brand-50 active:scale-[0.98]"
              >
                <PackagePlus className="h-4 w-4" />
                Report Lost Item
              </button>
              <button
                onClick={() => onNavigate('report')}
                className="btn bg-brand-800/40 text-white ring-1 ring-inset ring-white/30 hover:bg-brand-800/60 active:scale-[0.98]"
              >
                <PackageSearch className="h-4 w-4" />
                Report Found Item
              </button>
              <button
                onClick={() => onNavigate('browse')}
                className="btn bg-transparent text-white hover:bg-white/10 active:scale-[0.98]"
              >
                Browse Items
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured items */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Recently reported
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              The latest items lost or found around campus.
            </p>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="hidden items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:inline-flex"
          >
            <Search className="h-4 w-4" />
            Browse all
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <ItemCard key={item.id} item={item} onView={onView} />
          ))}
        </div>
        <div className="mt-8 sm:hidden">
          <button
            onClick={() => onNavigate('browse')}
            className="btn-secondary w-full"
          >
            Browse all items
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            How it works
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Report an item',
                body: 'Lost something or found an item? Fill out a quick report with a photo and details.',
              },
              {
                step: '02',
                title: 'Browse listings',
                body: 'Search and filter through reported items to find a match by category or location.',
              },
              {
                step: '03',
                title: 'Connect & claim',
                body: 'Spot a match? Reach out to the person who reported it to coordinate a return.',
              },
            ].map((s) => (
              <div key={s.step} className="card p-5">
                <span className="text-xs font-bold tracking-widest text-brand-600">
                  STEP {s.step}
                </span>
                <h3 className="mt-2 text-base font-bold text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

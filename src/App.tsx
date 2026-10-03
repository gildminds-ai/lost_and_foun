import { useState } from 'react';
import type { Item } from '@/types';
import { sampleItems } from '@/data';
import { Header } from '@/components/Header';
import { HomePage } from '@/pages/HomePage';
import { BrowsePage } from '@/pages/BrowsePage';
import { ReportPage } from '@/pages/ReportPage';
import { ItemDetailPage } from '@/pages/ItemDetailPage';

type Page = 'home' | 'browse' | 'report' | 'detail';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [items, setItems] = useState<Item[]>(sampleItems);
  const [activeId, setActiveId] = useState<string | null>(null);

  function navigate(p: 'home' | 'browse' | 'report') {
    setPage(p);
    window.scrollTo({ top: 0 });
  }

  function viewItem(id: string) {
    setActiveId(id);
    setPage('detail');
    window.scrollTo({ top: 0 });
  }

  function addItem(item: Omit<Item, 'id'>) {
    const newItem: Item = { ...item, id: `item-${Date.now()}` };
    setItems((prev) => [newItem, ...prev]);
  }

  const activeItem = items.find((i) => i.id === activeId) ?? null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        page={page === 'detail' ? 'browse' : page}
        onNavigate={navigate}
      />
      <main>
        {page === 'home' && (
          <HomePage items={items} onView={viewItem} onNavigate={navigate} />
        )}
        {page === 'browse' && (
          <BrowsePage items={items} onView={viewItem} />
        )}
        {page === 'report' && (
          <ReportPage
            items={items}
            onAdd={addItem}
            onBrowse={() => navigate('browse')}
            onView={viewItem}
          />
        )}
        {page === 'detail' && activeItem && (
          <ItemDetailPage
            item={activeItem}
            onBack={() => navigate('browse')}
          />
        )}
        {page === 'detail' && !activeItem && (
          <div className="mx-auto max-w-md px-4 py-20 text-center">
            <p className="text-sm text-slate-500">
              That item is no longer available.
            </p>
            <button
              onClick={() => navigate('browse')}
              className="btn-primary mt-4"
            >
              Back to listings
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-center text-xs text-slate-400">
            Campus Lost &amp; Found — a showcase prototype. Not affiliated with
            any institution.
          </p>
        </div>
      </footer>
    </div>
  );
}

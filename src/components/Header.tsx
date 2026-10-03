import { Compass, Home as HomeIcon, PlusCircle } from 'lucide-react';

type Page = 'home' | 'browse' | 'report';

export function Header({
  page,
  onNavigate,
}: {
  page: Page;
  onNavigate: (p: Page) => void;
}) {
  const navItem = (key: Page, label: string, Icon: typeof HomeIcon) => (
    <button
      onClick={() => onNavigate(key)}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        page === key
          ? 'bg-brand-50 text-brand-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Compass className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Campus<span className="text-brand-600">Lost&Found</span>
          </span>
        </button>
        <nav className="hidden items-center gap-1 sm:flex">
          {navItem('home', 'Home', HomeIcon)}
          {navItem('browse', 'Browse', Compass)}
          {navItem('report', 'Report', PlusCircle)}
        </nav>
        <button
          onClick={() => onNavigate('report')}
          className="btn-primary sm:hidden"
          aria-label="Report an item"
        >
          <PlusCircle className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

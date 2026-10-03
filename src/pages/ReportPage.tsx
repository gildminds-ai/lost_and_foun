import { useMemo, useState } from 'react';
import { CheckCircle2, ImagePlus, Sparkles, X } from 'lucide-react';
import type { Item, ItemStatus, Category } from '@/types';
import { CATEGORIES } from '@/types';
import { findMatches, type MatchResult } from '@/match';
import { ItemCard } from '@/components/ItemCard';

const STATUS_OPTIONS: { key: ItemStatus; label: string; hint: string }[] = [
  { key: 'lost', label: 'I lost something', hint: "Report an item you've lost" },
  { key: 'found', label: 'I found something', hint: 'Report an item you found' },
];

const PLACEHOLDER_IMG =
  'https://images.pexels.com/photos/265101/pexels-photo-265101.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export function ReportPage({
  items,
  onAdd,
  onBrowse,
  onView,
}: {
  items: Item[];
  onAdd: (item: Omit<Item, 'id'>) => void;
  onBrowse: () => void;
  onView: (id: string) => void;
}) {
  const [status, setStatus] = useState<ItemStatus>('lost');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Electronics');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedItem, setSubmittedItem] = useState<Omit<Item, 'id'> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Please enter the item name';
    if (!description.trim()) e.description = 'Please add a short description';
    if (!location.trim()) e.location = 'Please enter where it was lost/found';
    if (!contactName.trim()) e.contactName = 'Please enter your name';
    if (!contactEmail.trim()) e.contactEmail = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))
      e.contactEmail = 'Please enter a valid email';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;
    const payload: Omit<Item, 'id'> = {
      name: name.trim(),
      status,
      category,
      imageUrl: imageUrl.trim() || PLACEHOLDER_IMG,
      description: description.trim(),
      location: location.trim(),
      date,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
    };
    onAdd(payload);
    setSubmittedItem(payload);
    setSubmitted(true);
  }

  function resetForm() {
    setStatus('lost');
    setName('');
    setCategory('Electronics');
    setImageUrl('');
    setDescription('');
    setLocation('');
    setDate(new Date().toISOString().slice(0, 10));
    setContactName('');
    setContactEmail('');
    setErrors({});
    setSubmitted(false);
    setSubmittedItem(null);
  }

  const matches: MatchResult[] = useMemo(
    () => (submittedItem ? findMatches(submittedItem, items) : []),
    [submittedItem, items]
  );

  if (submitted) {
    const matchLabel =
      submittedItem?.status === 'lost' ? 'found items' : 'lost items';
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="card flex flex-col items-center px-6 py-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Your report is live
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Thanks for helping the campus community. Your item has been added to
            the listings for others to see.
          </p>
          <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <button onClick={() => onBrowse()} className="btn-primary">
              View listings
            </button>
            <button onClick={resetForm} className="btn-secondary">
              Report another item
            </button>
          </div>
        </div>

        {matches.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                  Possible matches
                </h3>
                <p className="text-sm text-slate-500">
                  These {matchLabel} share similar details with what you just
                  reported.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map(({ item, reasons }) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <ItemCard item={item} onView={onView} />
                  <div className="flex flex-wrap gap-1.5">
                    {reasons.map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/20"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Report an Item
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Share the details so the campus community can help reunite it with its
          owner.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 sm:p-6" noValidate>
        {/* Status toggle */}
        <fieldset>
          <legend className="label">Is this lost or found?</legend>
          <div className="grid grid-cols-2 gap-3">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setStatus(opt.key)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  status === opt.key
                    ? opt.key === 'lost'
                      ? 'border-rose-300 bg-rose-50 ring-2 ring-rose-500/20'
                      : 'border-emerald-300 bg-emerald-50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <span
                  className={`block text-sm font-bold ${
                    status === opt.key
                      ? opt.key === 'lost'
                        ? 'text-rose-700'
                        : 'text-emerald-700'
                      : 'text-slate-700'
                  }`}
                >
                  {opt.label}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {opt.hint}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="name">
              Item name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Blue Hydro Flask water bottle"
              className="input"
            />
            {errors.name && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="imageUrl">
              Photo URL
            </label>
            <div className="flex items-stretch gap-2">
              <div className="relative flex-1">
                <ImagePlus className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste an image link (optional)"
                  className="input pl-10"
                />
              </div>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="btn-ghost px-3"
                  aria-label="Clear photo"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Leave blank to use a default placeholder image.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the item — color, distinguishing marks, what was inside, etc."
              className="input resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {errors.description}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Library, 2nd floor study room"
              className="input"
            />
            {errors.location && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="contactName">
              Your name
            </label>
            <input
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g. Jordan Mitchell"
              className="input"
            />
            {errors.contactName && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {errors.contactName}
              </p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="contactEmail">
              Your email
            </label>
            <input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="you@campus.edu"
              className="input"
            />
            {errors.contactEmail && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {errors.contactEmail}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="btn-secondary"
          >
            Clear
          </button>
          <button type="submit" className="btn-primary">
            Submit report
          </button>
        </div>
      </form>
    </div>
  );
}

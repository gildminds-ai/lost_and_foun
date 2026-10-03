import { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Tag,
  Mail,
  User,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import type { Item } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ItemDetailPage({
  item,
  onBack,
}: {
  item: Item;
  onBack: () => void;
}) {
  const [showClaim, setShowClaim] = useState(false);
  const [sent, setSent] = useState(false);

  const claimLabel =
    item.status === 'found' ? 'This might be mine' : 'I found this item';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <button
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </button>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Image */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            <div className="relative aspect-[16/10] bg-slate-100">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-4 top-4">
                <StatusBadge status={item.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {item.name}
            </h1>
            <div className="mt-4 space-y-3">
              <DetailRow icon={<Tag className="h-4 w-4" />} label="Category">
                {item.category}
              </DetailRow>
              <DetailRow icon={<MapPin className="h-4 w-4" />} label="Location">
                {item.location}
              </DetailRow>
              <DetailRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Date"
              >
                {formatDate(item.date)}
              </DetailRow>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Description
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Reported by
              </h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <User className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-700">
                  {item.contactName}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowClaim(true)}
              className={`mt-6 w-full ${
                item.status === 'found'
                  ? 'btn bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]'
                  : 'btn bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98]'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              {claimLabel}
            </button>
          </div>
        </div>
      </div>

      {showClaim && (
        <ClaimModal
          item={item}
          sent={sent}
          onSent={() => setSent(true)}
          onClose={() => {
            setShowClaim(false);
            setSent(false);
          }}
        />
      )}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-700">{children}</p>
      </div>
    </div>
  );
}

function ClaimModal({
  item,
  sent,
  onSent,
  onClose,
}: {
  item: Item;
  sent: boolean;
  onSent: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please enter your name';
    if (!email.trim()) errs.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Please enter a valid email';
    if (!message.trim()) errs.message = 'Please add a short message';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSent();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">
            {item.status === 'found'
              ? 'Claim this found item'
              : 'I found this item'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <ArrowLeft className="h-4 w-4 rotate-45" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h3 className="mt-3 text-lg font-bold text-slate-900">
              Message sent
            </h3>
            <p className="mt-1.5 text-sm text-slate-500">
              {item.contactName} will receive your message and reach out to you
              at the email you provided.
            </p>
            <button onClick={onClose} className="btn-primary mt-6 w-full">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-5 py-5" noValidate>
            <p className="mb-4 text-sm text-slate-500">
              Your message will be shared with{' '}
              <span className="font-semibold text-slate-700">
                {item.contactName}
              </span>{' '}
              ({item.contactEmail}).
            </p>

            <div className="space-y-4">
              <div>
                <label className="label" htmlFor="claim-name">
                  Your name
                </label>
                <input
                  id="claim-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="e.g. Riley Adams"
                />
                {errors.name && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="label" htmlFor="claim-email">
                  Your email
                </label>
                <input
                  id="claim-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@campus.edu"
                />
                {errors.email && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="label" htmlFor="claim-message">
                  Message
                </label>
                <textarea
                  id="claim-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="input resize-none"
                  placeholder="Describe how you can identify the item, and how to coordinate a return..."
                />
                {errors.message && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {errors.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
              <Mail className="h-3.5 w-3.5" />
              This is a prototype — no email is actually sent.
            </div>

            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Send message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

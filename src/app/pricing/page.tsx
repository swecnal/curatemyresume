'use client';

import { useState, useEffect } from 'react';
import PricingCard from '@/components/PricingCard';

type Tier = 'free' | 'job_hunting' | 'beast';

export default function PricingPage() {
  const [currentTier, setCurrentTier] = useState<Tier>('free');
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTier() {
      try {
        const res = await fetch('/api/profile?stats=true');
        if (res.ok) {
          const data = await res.json();
          setCurrentTier(data.tier ?? 'free');
        }
      } catch {
        // Default to free
      } finally {
        setLoading(false);
      }
    }
    fetchTier();
  }, []);

  const handleSelectTier = async (tier: Tier) => {
    if (tier === currentTier) return;

    // Downgrading to free doesn't need Stripe
    if (tier === 'free') {
      return;
    }

    setRedirecting(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create checkout session.');
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-slate-500">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Pricing</h1>
        <p className="mt-2 text-lg text-slate-500">
          Choose the plan that fits your job search pace.
        </p>
        {currentTier !== 'free' && (
          <p className="mt-2 text-sm text-indigo-600">
            You are currently on the{' '}
            <span className="font-semibold capitalize">{currentTier}</span> plan.
          </p>
        )}
      </div>

      {error && (
        <div className="mx-auto mb-8 max-w-md rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {redirecting && (
        <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Redirecting to checkout...
        </div>
      )}

      <PricingCard currentTier={currentTier} onSelectTier={handleSelectTier} />

      {/* Manage Subscription */}
      {currentTier !== 'free' && (
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500">
            Need to manage your subscription?{' '}
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/stripe/portal', { method: 'POST' });
                  if (res.ok) {
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  }
                } catch {
                  // Portal not available yet
                }
              }}
              className="font-medium text-indigo-600 underline transition-colors hover:text-indigo-700"
            >
              Manage Subscription
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

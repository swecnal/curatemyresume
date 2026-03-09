'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { canAccess } from '@/lib/tier-features';
import ApplicationsTable, { type Application } from '@/components/ApplicationsTable';

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tier = session?.user?.tier ?? 'free';
  const hasAccess = canAccess(tier, 'applicationTracking');

  useEffect(() => {
    if (!hasAccess) {
      setLoading(false);
      return;
    }

    async function fetchApplications() {
      try {
        const res = await fetch('/api/applications');
        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications ?? []);
        } else {
          setApplications([]);
        }
      } catch {
        setError('Failed to load applications.');
        setApplications([]);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, [hasAccess]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-slate-500">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <svg
          className="mx-auto h-12 w-12 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
        <h2 className="mt-4 text-xl font-bold text-slate-900">Application Tracking</h2>
        <p className="mt-2 text-sm text-slate-500">
          Track your applications, interviews, and offers with Job Hunting or Beast Mode.
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Upgrade Your Plan
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Applications</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and manage all your job applications in one place.
          </p>
        </div>
        <Link
          href="/curate"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Curate a Role
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <ApplicationsTable applications={applications} />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import UsageMeter from '@/components/UsageMeter';
import { canAccess } from '@/lib/tier-features';

interface UserStats {
  totalCurations: number;
  applied: number;
  interviewing: number;
  offers: number;
  tier: 'free' | 'job_hunting' | 'beast';
  usedThisMonth: number;
  monthlyLimit: number;
}

interface RecentCuration {
  id: string;
  company: string;
  role: string;
  fitScore: number;
  goNoGo: 'go' | 'no-go';
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentCurations, setRecentCurations] = useState<RecentCuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, curationsRes] = await Promise.all([
          fetch('/api/profile?stats=true'),
          fetch('/api/curate?recent=true&limit=5'),
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        } else {
          // Use defaults if API not yet wired
          setStats({
            totalCurations: 0,
            applied: 0,
            interviewing: 0,
            offers: 0,
            tier: 'free',
            usedThisMonth: 0,
            monthlyLimit: 3,
          });
        }

        if (curationsRes.ok) {
          const data = await curationsRes.json();
          setRecentCurations(data.curations ?? []);
        }
      } catch {
        setError('Failed to load dashboard data.');
        setStats({
          totalCurations: 0,
          applied: 0,
          interviewing: 0,
          offers: 0,
          tier: 'free',
          usedThisMonth: 0,
          monthlyLimit: 3,
        });
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  const showAppStats = canAccess(stats?.tier ?? 'free', 'applicationTracking');

  const curationCard = {
    label: 'Total Curations',
    value: stats?.totalCurations ?? 0,
    icon: (
      <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    color: 'bg-indigo-50',
  };

  const appCards = [
    {
      label: 'Applied',
      value: stats?.applied ?? 0,
      icon: (
        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      ),
      color: 'bg-blue-50',
    },
    {
      label: 'Interviewing',
      value: stats?.interviewing ?? 0,
      icon: (
        <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
      color: 'bg-violet-50',
    },
    {
      label: 'Offers',
      value: stats?.offers ?? 0,
      icon: (
        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
      color: 'bg-green-50',
    },
  ];

  const statCards = [curationCard, ...(showAppStats ? appCards : [])];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your job search at a glance.
        </p>
      </div>

      {/* Usage Meter */}
      <div className="mb-8">
        <UsageMeter
          used={stats?.usedThisMonth ?? 0}
          limit={stats?.monthlyLimit ?? 3}
          tier={stats?.tier ?? 'free'}
        />
      </div>

      {/* Stat Cards */}
      <div className={`mb-8 grid gap-4 ${showAppStats ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-1 lg:grid-cols-1 max-w-sm'}`}>
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs text-slate-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Curations */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Curations</h2>
          <Link
            href="/curate"
            className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
          >
            New Curation
          </Link>
        </div>

        {recentCurations.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg className="mx-auto mb-3 h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-sm text-slate-500">No curations yet.</p>
            <Link
              href="/curate"
              className="mt-3 inline-block text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
            >
              Run your first curation
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentCurations.map((curation) => (
              <li key={curation.id}>
                <Link
                  href={`/curate?id=${curation.id}`}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{curation.role}</p>
                    <p className="text-xs text-slate-500">{curation.company}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-semibold ${
                        curation.fitScore >= 7
                          ? 'text-green-600'
                          : curation.fitScore >= 5
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}
                    >
                      {curation.fitScore}/10
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        curation.goNoGo === 'go'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {curation.goNoGo === 'go' ? 'GO' : 'NO-GO'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(curation.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

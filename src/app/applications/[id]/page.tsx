'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Status = 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';

interface ApplicationDetail {
  id: string;
  company: string;
  role: string;
  seniorityLevel: string | null;
  fitScore: number;
  goNoGo: 'go' | 'no-go';
  fitSummary: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryOTE: number | null;
  salaryDesired: number | null;
  salaryNotes: string;
  keyMatches: string[];
  gaps: string[];
  status: Status;
  applied: boolean;
  appliedDate: string | null;
  notes: string;
  tailoredResume: string | null;
  tier: 'free' | 'job_hunting' | 'beast';
  createdAt: string;
}

const statusOptions: { value: Status; label: string }[] = [
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

const statusStyles: Record<Status, string> = {
  saved: 'bg-slate-100 text-slate-700',
  applied: 'bg-blue-100 text-blue-700',
  interviewing: 'bg-indigo-100 text-indigo-700',
  offered: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-yellow-100 text-yellow-700',
};

function formatSalary(value: number | null): string {
  if (value === null) return '--';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function scoreColor(score: number): string {
  if (score >= 7) return 'text-green-600';
  if (score >= 5) return 'text-yellow-500';
  return 'text-red-500';
}

function scoreBarColor(score: number): string {
  if (score >= 7) return 'bg-green-500';
  if (score >= 5) return 'bg-yellow-400';
  return 'bg-red-500';
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tailoring, setTailoring] = useState(false);

  useEffect(() => {
    async function fetchApplication() {
      try {
        const res = await fetch(`/api/applications/${id}`);
        if (!res.ok) {
          throw new Error('Application not found.');
        }
        const data = await res.json();
        setApp(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load application.');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchApplication();
  }, [id]);

  const patchApplication = useCallback(
    async (updates: Partial<ApplicationDetail>) => {
      setSaving(true);
      try {
        const res = await fetch(`/api/applications/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (res.ok) {
          const data = await res.json();
          setApp((prev) => (prev ? { ...prev, ...data } : prev));
        }
      } catch {
        // Silent fail for saves
      } finally {
        setSaving(false);
      }
    },
    [id]
  );

  const handleStatusChange = (newStatus: Status) => {
    if (!app) return;
    setApp({ ...app, status: newStatus });
    patchApplication({ status: newStatus });
  };

  const handleToggleApplied = () => {
    if (!app) return;
    const newApplied = !app.applied;
    const newDate = newApplied ? new Date().toISOString() : null;
    setApp({ ...app, applied: newApplied, appliedDate: newDate });
    patchApplication({ applied: newApplied, appliedDate: newDate } as Partial<ApplicationDetail>);
  };

  const handleNotesBlur = (notes: string) => {
    if (!app || notes === app.notes) return;
    patchApplication({ notes });
  };

  const handleTailor = async () => {
    if (!app) return;
    setTailoring(true);
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setApp((prev) =>
          prev ? { ...prev, tailoredResume: data.tailoredResume ?? null } : prev
        );
      }
    } catch {
      // Silent fail
    } finally {
      setTailoring(false);
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
          <p className="text-sm text-slate-500">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <svg className="mx-auto mb-4 h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <h2 className="text-xl font-bold text-slate-900">Application Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">{error || 'This application does not exist.'}</p>
        <Link
          href="/applications"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/applications"
          className="text-sm text-slate-500 transition-colors hover:text-indigo-600"
        >
          &larr; Back to Applications
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{app.role}</h1>
          <p className="mt-0.5 text-lg text-slate-600">{app.company}</p>
          {app.seniorityLevel && (
            <p className="mt-1 text-sm text-slate-500">Seniority: {app.seniorityLevel}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              app.goNoGo === 'go' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {app.goNoGo === 'go' ? 'GO' : 'NO-GO'}
          </span>
          {saving && (
            <span className="text-xs text-slate-400">Saving...</span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Fit Score */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Fit Score</h2>
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <span className={`text-3xl font-bold ${scoreColor(app.fitScore)}`}>
                {app.fitScore}
              </span>
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-slate-500">Score out of 10</span>
                <span className={`text-sm font-semibold ${scoreColor(app.fitScore)}`}>
                  {app.fitScore}/10
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all ${scoreBarColor(app.fitScore)}`}
                  style={{ width: `${(app.fitScore / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fit Summary */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Fit Summary</h2>
          <p className="text-sm leading-relaxed text-slate-600">{app.fitSummary}</p>
        </div>

        {/* Key Matches & Gaps */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-green-700">Key Matches</h2>
            <ul className="space-y-2">
              {app.keyMatches.map((match, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {match}
                </li>
              ))}
              {app.keyMatches.length === 0 && (
                <li className="text-sm text-slate-400">No key matches identified.</li>
              )}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-red-700">Gaps</h2>
            <ul className="space-y-2">
              {app.gaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {gap}
                </li>
              ))}
              {app.gaps.length === 0 && (
                <li className="text-sm text-slate-400">No gaps identified.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Salary Breakdown</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div>
              <p className="text-xs text-slate-500">Min</p>
              <p className="text-lg font-semibold text-slate-900">{formatSalary(app.salaryMin)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Max</p>
              <p className="text-lg font-semibold text-slate-900">{formatSalary(app.salaryMax)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">OTE</p>
              <p className="text-lg font-semibold text-slate-900">{formatSalary(app.salaryOTE)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Your Target</p>
              <p className="text-lg font-semibold text-indigo-600">{formatSalary(app.salaryDesired)}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-500">Notes</p>
              <p className="text-sm text-slate-600">{app.salaryNotes || '--'}</p>
            </div>
          </div>
        </div>

        {/* Status & Applied */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">Status</h2>
            <select
              value={app.status}
              onChange={(e) => handleStatusChange(e.target.value as Status)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="mt-3">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[app.status]}`}
              >
                {statusOptions.find((o) => o.value === app.status)?.label}
              </span>
            </div>
          </div>

          {/* Applied Toggle */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">Applied</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleApplied}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  app.applied ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    app.applied ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-sm text-slate-600">
                {app.applied ? 'Applied' : 'Not yet applied'}
              </span>
            </div>
            {app.appliedDate && (
              <p className="mt-3 text-xs text-slate-500">
                Applied on{' '}
                {new Date(app.appliedDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Notes</h2>
          <textarea
            defaultValue={app.notes}
            onBlur={(e) => handleNotesBlur(e.target.value)}
            placeholder="Add notes about this application..."
            rows={4}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <p className="mt-1.5 text-xs text-slate-400">Notes save automatically when you click away.</p>
        </div>

        {/* Tailored Resume */}
        {app.tailoredResume && (
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-6">
            <h2 className="mb-3 text-sm font-semibold text-violet-900">Tailored Resume</h2>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-violet-800">
              {app.tailoredResume}
            </div>
          </div>
        )}

        {/* Tailor Resume Button (Beast tier only) */}
        {app.tier === 'beast' && !app.tailoredResume && (
          <button
            onClick={handleTailor}
            disabled={tailoring}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {tailoring ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Tailoring Resume...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
                Tailor Resume for This Role
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

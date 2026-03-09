'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import JDInput from '@/components/JDInput';
import ResultCard, { type CurationResult } from '@/components/ResultCard';
import UsageMeter from '@/components/UsageMeter';

interface UsageData {
  tier: 'free' | 'active' | 'beast';
  usedThisMonth: number;
  monthlyLimit: number;
}

interface CurateResponse {
  result: CurationResult;
  applicationId: string;
}

export default function CuratePage() {
  const [result, setResult] = useState<CurationResult | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResume, setHasResume] = useState<boolean | null>(null);
  const [checkingResume, setCheckingResume] = useState(true);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [markingApplied, setMarkingApplied] = useState(false);
  const [markedApplied, setMarkedApplied] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [tailorResult, setTailorResult] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const [resumeRes, usageRes] = await Promise.all([
          fetch('/api/resume/upload'),
          fetch('/api/profile?stats=true'),
        ]);

        if (resumeRes.ok) {
          const data = await resumeRes.json();
          setHasResume(!!data.hasResume);
        } else {
          setHasResume(true);
        }

        if (usageRes.ok) {
          const data = await usageRes.json();
          setUsage({
            tier: data.tier ?? 'free',
            usedThisMonth: data.usedThisMonth ?? 0,
            monthlyLimit: data.monthlyLimit ?? 3,
          });
        } else {
          setUsage({ tier: 'free', usedThisMonth: 0, monthlyLimit: 3 });
        }
      } catch {
        setHasResume(true);
        setUsage({ tier: 'free', usedThisMonth: 0, monthlyLimit: 3 });
      } finally {
        setCheckingResume(false);
      }
    }
    init();
  }, []);

  const handleSubmit = async (jobDescription: string, url: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setApplicationId(null);
    setMarkedApplied(false);
    setTailorResult(null);

    try {
      const res = await fetch('/api/curate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd_text: jobDescription, job_url: url }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Curation failed. Please try again.');
      }

      const data: CurateResponse = await res.json();
      setResult(data.result);
      setApplicationId(data.applicationId ?? null);

      // Refresh usage after curation
      if (usage) {
        setUsage({ ...usage, usedThisMonth: usage.usedThisMonth + 1 });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkApplied = async () => {
    if (!applicationId) return;
    setMarkingApplied(true);

    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'applied', appliedDate: new Date().toISOString() }),
      });

      if (!res.ok) {
        throw new Error('Failed to mark as applied.');
      }

      setMarkedApplied(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as applied.');
    } finally {
      setMarkingApplied(false);
    }
  };

  const handleTailor = async () => {
    if (!applicationId) return;
    setTailoring(true);

    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Tailoring failed.');
      }

      const data = await res.json();
      setTailorResult(data.tailoredResume ?? 'Resume tailored successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tailoring failed.');
    } finally {
      setTailoring(false);
    }
  };

  if (checkingResume) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (hasResume === false) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <svg className="mx-auto mb-4 h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <h2 className="text-xl font-bold text-slate-900">Upload a Resume First</h2>
        <p className="mt-2 text-sm text-slate-500">
          You need to upload a resume before curating roles. We will compare your background against job descriptions.
        </p>
        <Link
          href="/resume"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Upload Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Curate a Role</h1>
        <p className="mt-1 text-sm text-slate-500">
          Paste a job description and we will analyze how well you fit.
        </p>
      </div>

      {/* Usage Meter */}
      {usage && (
        <div className="mb-8">
          <UsageMeter
            used={usage.usedThisMonth}
            limit={usage.monthlyLimit}
            tier={usage.tier}
          />
        </div>
      )}

      <div className="space-y-8">
        <JDInput onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <>
            <ResultCard result={result} />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {applicationId && !markedApplied && (
                <button
                  onClick={handleMarkApplied}
                  disabled={markingApplied}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {markingApplied ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Marking...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                      Mark as Applied
                    </>
                  )}
                </button>
              )}

              {markedApplied && (
                <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-5 py-2.5 text-sm font-medium text-green-700">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Marked as Applied
                </div>
              )}

              {usage?.tier === 'beast' && applicationId && (
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
                      Tailoring...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                      </svg>
                      Tailor My Resume
                    </>
                  )}
                </button>
              )}

              {applicationId && (
                <Link
                  href={`/applications/${applicationId}`}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  View Full Details
                </Link>
              )}
            </div>

            {/* Tailor Result */}
            {tailorResult && (
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-6">
                <h3 className="mb-2 text-sm font-semibold text-violet-900">Tailored Resume</h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-violet-800">
                  {tailorResult}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

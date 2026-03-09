'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import JDInput from '@/components/JDInput';
import ResumeUpload from '@/components/ResumeUpload';
import ResultCard, { type CurationResult } from '@/components/ResultCard';
import UsageMeter from '@/components/UsageMeter';
import { canAccess } from '@/lib/tier-features';

interface UsageData {
  tier: 'free' | 'job_hunting' | 'beast';
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

  // Inline resume state for non-storage tiers
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [resumeReady, setResumeReady] = useState(false);

  // JD text for tailor requests on non-tracking tiers
  const [lastJdText, setLastJdText] = useState<string>('');

  // Beast-tier features
  const [companyType, setCompanyType] = useState<string>('auto');
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkJDs, setBulkJDs] = useState<string[]>(['']);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Tier-derived flags
  const tier = usage?.tier ?? 'free';
  const hasResumeStorage = canAccess(tier, 'resumeStorage');
  const hasAppTracking = canAccess(tier, 'applicationTracking');

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

  const handleResumeUpload = async (file: File | null, text: string | null) => {
    setResumeReady(false);
    setError(null);
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      else if (text) formData.append('text', text);

      const res = await fetch('/api/resume/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Failed to process resume');
      const data = await res.json();
      setResumeText(data.rawText ?? text);
      setResumeReady(true);
    } catch {
      setError('Failed to process resume.');
    }
  };

  const handleSubmit = async (jobDescription: string, url: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setApplicationId(null);
    setMarkedApplied(false);
    setTailorResult(null);
    setLastJdText(jobDescription);

    try {
      const res = await fetch('/api/curate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jd_text: jobDescription,
          job_url: url,
          ...(hasResumeStorage ? {} : { resume_text: resumeText }),
        }),
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
    setTailoring(true);
    setError(null);

    try {
      const tailorBody = hasAppTracking && applicationId
        ? { application_id: applicationId, ...(canAccess(tier, 'companyToneMatching') && companyType !== 'auto' ? { company_type: companyType } : {}) }
        : { resume_text: resumeText, jd_text: lastJdText, ...(canAccess(tier, 'companyToneMatching') && companyType !== 'auto' ? { company_type: companyType } : {}) };

      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tailorBody),
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

  const handleDownloadPDF = async () => {
    if (!result) return;
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'curation',
          content: result.fitSummary,
          metadata: {
            company: result.company,
            role: result.role,
            fitScore: result.fitScore,
            goNoGo: result.goNoGo,
            fitSummary: result.fitSummary,
            keyMatches: result.keyMatches,
            gaps: result.gaps,
            salaryMin: result.salaryMin,
            salaryMax: result.salaryMax,
            salaryNotes: result.salaryNotes,
          },
        }),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `curation-${result.company}-${result.role}.pdf`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      setError('Failed to generate PDF.');
    }
  };

  const handleDownloadTailoredPDF = async () => {
    if (!tailorResult) return;
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'resume', content: tailorResult }),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'tailored-resume.pdf';
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      setError('Failed to generate PDF.');
    }
  };

  const handleBulkSubmit = async () => {
    const validJDs = bulkJDs.filter((jd) => jd.trim().length > 0);
    if (validJDs.length === 0) return;
    setBulkLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/curate/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jds: validJDs }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Bulk curation failed.');
      }

      // For now, show the first result
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setResult(data.results[0].result);
        setApplicationId(data.results[0].applicationId ?? null);
      }

      if (usage) {
        setUsage({ ...usage, usedThisMonth: usage.usedThisMonth + validJDs.length });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk curation failed.');
    } finally {
      setBulkLoading(false);
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

  // For storage tiers only: redirect to resume page if no resume on file
  if (hasResumeStorage && hasResume === false) {
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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Curate a Role</h1>
          <p className="mt-1 text-sm text-slate-500">
            Paste a job description and we will analyze how well you fit.
          </p>
        </div>

        {/* Bulk Mode Toggle for Beast */}
        {canAccess(tier, 'bulkCuration') && (
          <button
            onClick={() => setBulkMode(!bulkMode)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {bulkMode ? 'Switch to Single Mode' : 'Bulk Mode (up to 5 JDs)'}
          </button>
        )}
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
        {/* Inline Resume Upload for non-storage tiers */}
        {!hasResumeStorage && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Upload Your Resume
            </h3>
            <p className="mb-3 text-xs text-slate-500">
              Your resume is processed on-the-fly for this curation and is not stored.
            </p>
            <ResumeUpload onUpload={handleResumeUpload} />
            {resumeReady && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resume loaded and ready.
              </div>
            )}
          </div>
        )}

        {/* Single Mode */}
        {!bulkMode && (
          <JDInput onSubmit={handleSubmit} loading={loading} />
        )}

        {/* Bulk Mode (Beast only) */}
        {bulkMode && canAccess(tier, 'bulkCuration') && (
          <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Bulk Job Descriptions</h3>
            <p className="mb-4 text-sm text-slate-500">
              Paste up to 5 job descriptions. Each will be curated separately.
            </p>
            <div className="space-y-4">
              {bulkJDs.map((jd, idx) => (
                <div key={idx}>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">JD #{idx + 1}</label>
                    {bulkJDs.length > 1 && (
                      <button
                        onClick={() => setBulkJDs(bulkJDs.filter((_, i) => i !== idx))}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <textarea
                    value={jd}
                    onChange={(e) => {
                      const updated = [...bulkJDs];
                      updated[idx] = e.target.value;
                      setBulkJDs(updated);
                    }}
                    placeholder="Paste job description..."
                    rows={6}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              ))}
              {bulkJDs.length < 5 && (
                <button
                  onClick={() => setBulkJDs([...bulkJDs, ''])}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  + Add another JD
                </button>
              )}
            </div>
            <button
              onClick={handleBulkSubmit}
              disabled={bulkLoading || bulkJDs.every((jd) => !jd.trim())}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bulkLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Curating...
                </>
              ) : (
                `Curate ${bulkJDs.filter((jd) => jd.trim()).length} Role${bulkJDs.filter((jd) => jd.trim()).length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <>
            <ResultCard result={result} />

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Mark as Applied - only for tracking tiers with an applicationId */}
              {hasAppTracking && applicationId && !markedApplied && (
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

              {/* Company Type Selector - Beast only */}
              {canAccess(tier, 'companyToneMatching') && (
                <select
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="auto">Auto-detect tone</option>
                  <option value="startup">Startup</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="agency">Agency</option>
                  <option value="government">Government</option>
                  <option value="nonprofit">Nonprofit</option>
                </select>
              )}

              {/* Tailor button - available to all tiers with basicTailoring */}
              {canAccess(tier, 'basicTailoring') && (
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

              {/* PDF Download - curation result */}
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download PDF
              </button>

              {/* View Full Details - only for tracking tiers with an applicationId */}
              {hasAppTracking && applicationId && (
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
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-violet-900">Tailored Resume</h3>
                  <button
                    onClick={handleDownloadTailoredPDF}
                    className="flex items-center gap-2 rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download PDF
                  </button>
                </div>
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

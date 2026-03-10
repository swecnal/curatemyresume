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

  // Company Review (PhD tier)
  const [companyReview, setCompanyReview] = useState<{
    company_name: string;
    overall_rating: number;
    culture_summary: string;
    compensation_summary: string;
    interview_process: string;
    pros: string[];
    cons: string[];
    glassdoor_sentiment: string;
    levels_fyi_insight: string;
    recommendation: string;
  } | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Beast-tier features
  const [companyType, setCompanyType] = useState<string>('auto');
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkJDs, setBulkJDs] = useState<string[]>(['']);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResults, setBulkResults] = useState<Array<{
    result: CurationResult;
    applicationId: string | null;
    jobUrl?: string;
  }> | null>(null);

  // Tier-derived flags
  const tier = usage?.tier ?? 'free';
  const hasResumeStorage = canAccess(tier, 'resumeStorage');
  const hasAppTracking = canAccess(tier, 'applicationTracking');

  // Teaser JD from /try page
  const [teaserJD, setTeaserJD] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        // Pick up teaser data from sessionStorage (from /try page)
        if (typeof window !== 'undefined') {
          const storedResume = sessionStorage.getItem('rmd_teaser_resume');
          const storedJD = sessionStorage.getItem('rmd_teaser_jd');
          if (storedResume) {
            setResumeText(storedResume);
            setResumeReady(true);
            sessionStorage.removeItem('rmd_teaser_resume');
          }
          if (storedJD) {
            setTeaserJD(storedJD);
            sessionStorage.removeItem('rmd_teaser_jd');
          }
        }

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

  const handleCompanyReview = async () => {
    if (!result) return;
    setReviewLoading(true);
    setCompanyReview(null);
    setError(null);

    try {
      const res = await fetch('/api/company-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: result.company,
          role_title: result.role,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Company review failed.');
      }

      const data = await res.json();
      setCompanyReview(data.review);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Company review failed.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleBulkSubmit = async () => {
    const validJDs = bulkJDs.filter((jd) => jd.trim().length > 0);
    if (validJDs.length === 0) return;
    setBulkLoading(true);
    setError(null);
    setBulkResults(null);
    setResult(null);

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

      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const allResults = data.results
          .filter((r: { result?: CurationResult }) => r.result)
          .map((r: { result: CurationResult; applicationId?: string; jobUrl?: string }) => ({
            result: r.result,
            applicationId: r.applicationId ?? null,
            jobUrl: r.jobUrl,
          }));
        setBulkResults(allResults);
        // Also set the first result for the detailed view
        if (allResults.length > 0) {
          setResult(allResults[0].result);
          setApplicationId(allResults[0].applicationId ?? null);
        }
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
          <h1 className="text-2xl font-bold text-slate-900">Diagnose a Role</h1>
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
                  Diagnosing...
                </>
              ) : (
                `Diagnose ${bulkJDs.filter((jd) => jd.trim()).length} Role${bulkJDs.filter((jd) => jd.trim()).length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Bulk Results Delivery */}
        {bulkResults && bulkResults.length > 1 && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Bulk Diagnosis Results ({bulkResults.length} roles)
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Click a result to view full details below.
              </p>
            </div>
            <ul className="divide-y divide-slate-100">
              {bulkResults.map((br, idx) => (
                <li key={idx} className="flex flex-wrap items-center gap-3 px-6 py-4">
                  <button
                    onClick={() => {
                      setResult(br.result);
                      setApplicationId(br.applicationId ?? null);
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-indigo-600"
                  >
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    Resume.pdf
                  </button>
                  <span className="text-sm text-slate-400">|</span>
                  <span className="text-sm text-slate-600">
                    For <span className="font-medium">{br.result.role}</span> at{' '}
                    <span className="font-medium">{br.result.company}</span>
                  </span>
                  <span className="text-sm text-slate-400">|</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    br.result.fitScore >= 7
                      ? 'bg-green-100 text-green-700'
                      : br.result.fitScore >= 4
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {br.result.fitScore}/10
                  </span>
                  {br.jobUrl && (
                    <>
                      <span className="text-sm text-slate-400">|</span>
                      <a
                        href={br.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Apply Now
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ul>
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

              {/* Company Review - Beast/PhD tier only */}
              {canAccess(tier, 'companyReviews') && (
                <button
                  onClick={handleCompanyReview}
                  disabled={reviewLoading}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reviewLoading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Researching...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                      </svg>
                      Company Review
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

            {/* Company Review */}
            {companyReview && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-emerald-900">
                    {companyReview.company_name} — Company Review
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {companyReview.overall_rating}/5
                    <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Culture */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-700">Culture</h4>
                    <p className="text-sm leading-relaxed text-slate-700">{companyReview.culture_summary}</p>
                  </div>

                  {/* Compensation */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-700">Compensation</h4>
                    <p className="text-sm leading-relaxed text-slate-700">{companyReview.compensation_summary}</p>
                  </div>

                  {/* Interview Process */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-700">Interview Process</h4>
                    <p className="text-sm leading-relaxed text-slate-700">{companyReview.interview_process}</p>
                  </div>

                  {/* Recommendation */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-700">Strategic Advice</h4>
                    <p className="text-sm leading-relaxed text-slate-700">{companyReview.recommendation}</p>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-green-600">Pros</h4>
                    <ul className="space-y-1.5">
                      {companyReview.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-red-500">Cons</h4>
                    <ul className="space-y-1.5">
                      {companyReview.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Glassdoor & Levels.fyi Insights */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">Glassdoor Sentiment</h4>
                    <p className="text-sm text-slate-700">{companyReview.glassdoor_sentiment}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">Levels.fyi Insight</h4>
                    <p className="text-sm text-slate-700">{companyReview.levels_fyi_insight}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

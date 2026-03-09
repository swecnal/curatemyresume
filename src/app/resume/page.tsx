'use client';

import { useState, useEffect } from 'react';
import ResumeUpload from '@/components/ResumeUpload';
import { canAccess } from '@/lib/tier-features';
import Link from 'next/link';

interface ResumeRecord {
  id: string;
  fileName: string;
  createdAt: string;
  isActive: boolean;
}

interface ActiveResume {
  id: string;
  fileName: string;
  profileSummary: string | null;
  createdAt: string;
}

export default function ResumePage() {
  const [activeResume, setActiveResume] = useState<ActiveResume | null>(null);
  const [resumeHistory, setResumeHistory] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [forging, setForging] = useState(false);
  const [forgeResult, setForgeResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tier, setTier] = useState<string>('free');

  const fetchResumes = async () => {
    try {
      const res = await fetch('/api/resume/upload');
      if (res.ok) {
        const data = await res.json();
        setActiveResume(data.activeResume ?? null);
        setResumeHistory(data.history ?? []);
      }
    } catch {
      // API not wired yet, show empty state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
    fetch('/api/profile?stats=true')
      .then((res) => res.json())
      .then((data) => setTier(data.tier ?? 'free'))
      .catch(() => {});
  }, []);

  const handleUpload = async (file: File | null, text: string | null) => {
    setUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else if (text) {
        formData.append('text', text);
      }

      const res = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed. Please try again.');
      }

      setSuccessMessage('Resume uploaded successfully.');
      await fetchResumes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleForge = async () => {
    setForging(true);
    setError(null);
    setForgeResult(null);

    try {
      const res = await fetch('/api/resume/forge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Formatting failed. Please try again.');
      }

      const data = await res.json();
      setForgeResult(data.formattedResume ?? 'Resume formatted successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Formatting failed.');
    } finally {
      setForging(false);
    }
  };

  const handleDownloadResumePDF = async (resumeId: string, fileName: string) => {
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'stored-resume', resumeId }),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${fileName}.pdf`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      setError('Failed to generate PDF.');
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
          <p className="text-sm text-slate-500">Loading resume...</p>
        </div>
      </div>
    );
  }

  // Free tier: simplified message, no storage, no history, no ResumeForge
  if (tier === 'free') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Resume</h1>
          <p className="mt-1 text-sm text-slate-500">
            On the Free plan, your resume is uploaded fresh with each curation. Head to the Curate page to get started.
          </p>
        </div>

        {/* Success / Error Messages */}
        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Upload section for testing/previewing */}
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Test Your Resume</h2>
          <p className="mb-4 text-xs text-slate-500">
            Preview how your resume parses. This upload will not be saved.
          </p>
          {uploading && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Uploading and parsing your resume...
            </div>
          )}
          <ResumeUpload onUpload={handleUpload} />
        </div>

        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-center">
          <p className="text-sm text-indigo-700">
            Want resume storage, ResumeForge formatting, and more?{' '}
            <Link href="/pricing" className="font-semibold underline hover:text-indigo-900">
              Upgrade your plan
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Job Hunting tier: upload + ResumeForge, no storage, no history
  if (tier === 'job_hunting' && !canAccess(tier, 'resumeStorage')) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Resume</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your resume. Upload a new one or format your current resume with ResumeForge.
          </p>
        </div>

        {/* Success / Error Messages */}
        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Resumes are processed on-the-fly. Your resume is not stored.
        </div>

        {/* Active Resume (if one was just uploaded in-session) */}
        {activeResume && (
          <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Current Resume</h2>
                <p className="mt-0.5 text-sm text-slate-500">{activeResume.fileName}</p>
                <p className="text-xs text-slate-400">
                  Uploaded{' '}
                  {new Date(activeResume.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {activeResume.profileSummary && (
              <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Parsed Profile Summary
                </h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  {activeResume.profileSummary}
                </p>
              </div>
            )}

            {/* ResumeForge Button */}
            {canAccess(tier, 'resumeForge') && (
              <button
                onClick={handleForge}
                disabled={forging}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {forging ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Formatting...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                    ResumeForge - Format Resume
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Forge Result */}
        {forgeResult && (
          <div className="mb-8 rounded-xl border border-indigo-200 bg-indigo-50 p-6">
            <h3 className="mb-2 text-sm font-semibold text-indigo-900">Formatted Resume</h3>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-indigo-800">
              {forgeResult}
            </div>
          </div>
        )}

        {/* Upload New Resume */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {activeResume ? 'Upload New Resume' : 'Upload Your Resume'}
          </h2>
          {uploading && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Uploading and parsing your resume...
            </div>
          )}
          <ResumeUpload onUpload={handleUpload} />
        </div>
      </div>
    );
  }

  // Beast tier: full behavior (upload, history, ResumeForge, PDF downloads)
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Resume</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your resume. Upload a new one or format your current resume with ResumeForge.
        </p>
      </div>

      {/* Success / Error Messages */}
      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Active Resume */}
      {activeResume && (
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Active Resume</h2>
              <p className="mt-0.5 text-sm text-slate-500">{activeResume.fileName}</p>
              <p className="text-xs text-slate-400">
                Uploaded{' '}
                {new Date(activeResume.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              Active
            </span>
          </div>

          {activeResume.profileSummary && (
            <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Parsed Profile Summary
              </h3>
              <p className="text-sm leading-relaxed text-slate-700">
                {activeResume.profileSummary}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* ResumeForge Button */}
            {canAccess(tier, 'resumeForge') && (
              <button
                onClick={handleForge}
                disabled={forging}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {forging ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Formatting...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                    ResumeForge - Format Resume
                  </>
                )}
              </button>
            )}

            {/* PDF Download for active resume */}
            {canAccess(tier, 'pdfExport') && (
              <button
                onClick={() => handleDownloadResumePDF(activeResume.id, activeResume.fileName)}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download PDF
              </button>
            )}
          </div>
        </div>
      )}

      {/* Forge Result */}
      {forgeResult && (
        <div className="mb-8 rounded-xl border border-indigo-200 bg-indigo-50 p-6">
          <h3 className="mb-2 text-sm font-semibold text-indigo-900">Formatted Resume</h3>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-indigo-800">
            {forgeResult}
          </div>
        </div>
      )}

      {/* Upload New Resume */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {activeResume ? 'Upload New Resume' : 'Upload Your Resume'}
        </h2>
        {uploading && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Uploading and parsing your resume...
          </div>
        )}
        <ResumeUpload onUpload={handleUpload} />
      </div>

      {/* Resume History (Resume Recall) */}
      {resumeHistory.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Resume Recall</h2>
            <p className="mt-0.5 text-xs text-slate-500">Your stored resume history</p>
          </div>
          <ul className="divide-y divide-slate-100">
            {resumeHistory.map((resume) => (
              <li key={resume.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">{resume.fileName}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(resume.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {resume.isActive && (
                    <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      Active
                    </span>
                  )}
                  {canAccess(tier, 'pdfExport') && (
                    <button
                      onClick={() => handleDownloadResumePDF(resume.id, resume.fileName)}
                      className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      PDF
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

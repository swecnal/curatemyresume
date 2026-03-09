'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function TryPage() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState('');

  const hasResume = resumeText.trim().length > 0 || resumeFile !== null;
  const hasJD = jdText.trim().length > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      // Read file text for storage
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        if (text) setResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleDiagnose = () => {
    // Store in sessionStorage for post-signup pickup
    sessionStorage.setItem('rmd_teaser_resume', resumeText);
    sessionStorage.setItem('rmd_teaser_jd', jdText);
    router.push('/signup');
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <Logo size="lg" linkTo="/" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            See how your resume stacks up
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Upload your resume and paste a job description. We&apos;ll diagnose your fit instantly.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Resume */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Your Resume</h2>

            {/* File Upload */}
            <label className="mb-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 transition-colors hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              {resumeFile ? resumeFile.name : 'Upload PDF, DOCX, or TXT'}
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <div className="mb-3 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">or paste text</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <textarea
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                setResumeFile(null);
              }}
              placeholder="Paste your resume text here..."
              rows={10}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Job Description */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Job Description</h2>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={16}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={handleDiagnose}
            disabled={!hasResume || !hasJD}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Diagnose My Fit
          </button>
          <p className="mt-3 text-sm text-slate-500">
            Free account required to view results. Takes 30 seconds to sign up.
          </p>
        </div>
      </div>
    </div>
  );
}

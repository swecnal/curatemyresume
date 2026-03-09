'use client';

import { useState } from 'react';

interface JDInputProps {
  onSubmit: (jobDescription: string, url: string) => void;
  loading?: boolean;
}

export default function JDInput({ onSubmit, loading = false }: JDInputProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;
    onSubmit(jobDescription.trim(), url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Job Description</h3>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the full job description here..."
        rows={10}
        required
        className="mb-4 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />

      <div className="mb-6">
        <label htmlFor="jd-url" className="mb-1.5 block text-sm font-medium text-slate-700">
          Job Posting URL <span className="text-slate-400">(optional)</span>
        </label>
        <input
          id="jd-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/jobs/..."
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !jobDescription.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Analyzing...
          </>
        ) : (
          'Diagnose This Role'
        )}
      </button>
    </form>
  );
}

'use client';

import { useState } from 'react';

interface BulkJDInputProps {
  onSubmit: (jds: { jd_text: string; job_url?: string }[]) => void;
  loading: boolean;
}

export default function BulkJDInput({ onSubmit, loading }: BulkJDInputProps) {
  const [jds, setJds] = useState<{ text: string; url: string }[]>([
    { text: '', url: '' },
  ]);

  const addJD = () => {
    if (jds.length < 5) {
      setJds([...jds, { text: '', url: '' }]);
    }
  };

  const removeJD = (index: number) => {
    if (jds.length > 1) {
      setJds(jds.filter((_, i) => i !== index));
    }
  };

  const updateJD = (index: number, field: 'text' | 'url', value: string) => {
    const updated = [...jds];
    updated[index] = { ...updated[index], [field]: value };
    setJds(updated);
  };

  const handleSubmit = () => {
    const validJds = jds
      .filter((jd) => jd.text.trim().length > 0)
      .map((jd) => ({
        jd_text: jd.text.trim(),
        ...(jd.url.trim() ? { job_url: jd.url.trim() } : {}),
      }));

    if (validJds.length === 0) return;
    onSubmit(validJds);
  };

  const hasValidJDs = jds.some((jd) => jd.text.trim().length > 0);

  return (
    <div className="space-y-4">
      {jds.map((jd, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">
              JD #{index + 1}
            </span>
            {jds.length > 1 && (
              <button
                onClick={() => removeJD(index)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
          <textarea
            rows={6}
            value={jd.text}
            onChange={(e) => updateJD(index, 'text', e.target.value)}
            placeholder="Paste job description here..."
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <input
            type="url"
            value={jd.url}
            onChange={(e) => updateJD(index, 'url', e.target.value)}
            placeholder="Job URL (optional)"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      ))}

      <div className="flex items-center gap-3">
        {jds.length < 5 && (
          <button
            onClick={addJD}
            className="flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-indigo-400 hover:text-indigo-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add Another JD ({jds.length}/5)
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !hasValidJDs}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Curating {jds.filter((jd) => jd.text.trim()).length} JDs...
            </>
          ) : (
            `Curate ${jds.filter((jd) => jd.text.trim()).length} JD${jds.filter((jd) => jd.text.trim()).length !== 1 ? 's' : ''}`
          )}
        </button>
      </div>
    </div>
  );
}

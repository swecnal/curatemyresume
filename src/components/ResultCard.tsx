'use client';

export interface CurationResult {
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
  company: string;
  role: string;
}

interface ResultCardProps {
  result: CurationResult;
}

function scoreColor(score: number): string {
  if (score >= 7) return 'text-green-600';
  if (score >= 5) return 'text-yellow-500';
  return 'text-red-500';
}

function scoreBg(score: number): string {
  if (score >= 7) return 'bg-green-50 border-green-200';
  if (score >= 5) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
}

function formatSalary(value: number | null): string {
  if (value === null) return '--';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{result.role}</h3>
            <p className="text-sm text-slate-500">{result.company}</p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              result.goNoGo === 'go'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {result.goNoGo === 'go' ? 'GO' : 'NO-GO'}
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Fit Score */}
        <div className="mb-6 flex items-center gap-6">
          <div className={`flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl border ${scoreBg(result.fitScore)}`}>
            <span className={`text-4xl font-bold ${scoreColor(result.fitScore)}`}>
              {result.fitScore}
            </span>
          </div>
          <div className="flex-1">
            <p className="mb-1 text-sm font-medium text-slate-500">Fit Score</p>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  result.fitScore >= 7
                    ? 'bg-green-500'
                    : result.fitScore >= 5
                    ? 'bg-yellow-400'
                    : 'bg-red-500'
                }`}
                style={{ width: `${(result.fitScore / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Fit Summary */}
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-semibold text-slate-700">Fit Summary</h4>
          <p className="text-sm leading-relaxed text-slate-600">{result.fitSummary}</p>
        </div>

        {/* Key Matches & Gaps */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-green-700">Key Matches</h4>
            <ul className="space-y-1">
              {result.keyMatches.map((match, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {match}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-red-700">Gaps</h4>
            <ul className="space-y-1">
              {result.gaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Salary Section */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">Salary Analysis</h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-xs text-slate-500">Min</p>
              <p className="text-sm font-semibold text-slate-900">{formatSalary(result.salaryMin)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Max</p>
              <p className="text-sm font-semibold text-slate-900">{formatSalary(result.salaryMax)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">OTE</p>
              <p className="text-sm font-semibold text-slate-900">{formatSalary(result.salaryOTE)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Your Target</p>
              <p className="text-sm font-semibold text-indigo-600">{formatSalary(result.salaryDesired)}</p>
            </div>
          </div>
          {result.salaryNotes && (
            <p className="mt-3 text-xs leading-relaxed text-slate-500">{result.salaryNotes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

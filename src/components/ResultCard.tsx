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
  marketSalaryMin?: number;
  marketSalaryMax?: number;
  marketSalaryNotes?: string;
  negotiationLeverage?: string[];
  equityBenchmark?: string;
  totalCompEstimate?: string;
  gapDetails?: { skill: string; importance: string; bridgeStrategy: string }[];
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

function formatSalary(value: number | null | undefined): string {
  if (value === null || value === undefined) return '--';
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

        {/* Market Salary Section */}
        {(result.marketSalaryMin || result.marketSalaryMax) && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-3 text-sm font-semibold text-blue-700">Fair Market Salary</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-blue-500">Market Min</p>
                <p className="text-sm font-semibold text-blue-900">{formatSalary(result.marketSalaryMin ?? null)}</p>
              </div>
              <div>
                <p className="text-xs text-blue-500">Market Max</p>
                <p className="text-sm font-semibold text-blue-900">{formatSalary(result.marketSalaryMax ?? null)}</p>
              </div>
            </div>
            {result.marketSalaryNotes && (
              <p className="mt-2 text-xs leading-relaxed text-blue-600">{result.marketSalaryNotes}</p>
            )}
          </div>
        )}

        {/* Negotiation Insights Section */}
        {result.negotiationLeverage && result.negotiationLeverage.length > 0 && (
          <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 p-4">
            <h4 className="mb-2 text-sm font-semibold text-violet-700">Negotiation Insights</h4>
            <ul className="space-y-1">
              {result.negotiationLeverage.map((point, i) => (
                <li key={i} className="text-sm text-violet-600">&bull; {point}</li>
              ))}
            </ul>
            {result.equityBenchmark && <p className="mt-2 text-xs text-violet-500">Equity: {result.equityBenchmark}</p>}
            {result.totalCompEstimate && <p className="text-xs text-violet-500">Est. Total Comp: {result.totalCompEstimate}</p>}
          </div>
        )}

        {/* Detailed Gap Analysis Section */}
        {result.gapDetails && result.gapDetails.length > 0 && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-3 text-sm font-semibold text-amber-700">Skill Gap Details</h4>
            <div className="space-y-3">
              {result.gapDetails.map((gap, i) => (
                <div key={i} className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-amber-900">{gap.skill}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      gap.importance === 'critical' ? 'bg-red-100 text-red-700' :
                      gap.importance === 'important' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>{gap.importance}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-amber-600">{gap.bridgeStrategy}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

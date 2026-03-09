'use client';

type Tier = 'free' | 'job_hunting' | 'beast';

interface PricingCardProps {
  currentTier: Tier;
  onSelectTier: (tier: Tier) => void;
}

interface PlanInfo {
  tier: Tier;
  name: string;
  price: string;
  period: string;
  curations: string;
  features: string[];
  antiFeatures: string[];
  highlighted: boolean;
}

const plans: PlanInfo[] = [
  {
    tier: 'free',
    name: 'Free',
    price: '$0',
    period: '',
    curations: '3 curations/month',
    features: [
      '3 resume-to-JD curations per month',
      'Fit score & go/no-go analysis',
      'Basic resume tailoring per role',
      'Basic gap analysis',
      'PDF resume download',
    ],
    antiFeatures: [
      'No salary research',
      'No application tracking',
      'No resume storage',
      'No ATS formatting',
    ],
    highlighted: false,
  },
  {
    tier: 'job_hunting',
    name: 'Job Hunting',
    price: '$6',
    period: '/month',
    curations: '25 curations/month',
    features: [
      '25 resume-to-JD curations per month',
      'Everything in Free',
      'Resume Rx ATS optimized formatting',
      'Fair market salary research',
      'Detailed skill gap breakdown',
      'Application tracking',
      'Priority analysis queue',
      'Export curations to PDF',
    ],
    antiFeatures: [],
    highlighted: true,
  },
  {
    tier: 'beast',
    name: 'Beast Mode',
    price: '$24',
    period: '/month',
    curations: 'UNLIMITED curations',
    features: [
      'UNLIMITED curations per month',
      'Everything in Job Hunting',
      'Bulk curation mode (5 JDs at once)',
      'Custom resume tailoring per role',
      'Company tone matching',
      'Advanced salary research & negotiation insights',
      'Resume Recall — save & download anytime',
      'Cover letter creation & curation',
      'Priority support',
    ],
    antiFeatures: [],
    highlighted: false,
  },
];

export default function PricingCard({ currentTier, onSelectTier }: PricingCardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => {
        const isCurrent = currentTier === plan.tier;
        return (
          <div
            key={plan.tier}
            className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md ${
              plan.highlighted
                ? 'border-indigo-300 bg-white ring-2 ring-indigo-500'
                : 'border-slate-200 bg-white'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{plan.curations}</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
              {plan.period && (
                <span className="text-sm text-slate-500">{plan.period}</span>
              )}
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <svg
                    className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                      plan.highlighted ? 'text-indigo-500' : 'text-green-500'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Anti-features */}
            {plan.antiFeatures.length > 0 && (
              <ul className="mb-8 space-y-2 border-t border-slate-100 pt-3">
                {plan.antiFeatures.map((af, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {af}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => onSelectTier(plan.tier)}
              disabled={isCurrent}
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                isCurrent
                  ? 'cursor-not-allowed border border-slate-200 bg-slate-50 text-slate-400'
                  : plan.highlighted
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isCurrent ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

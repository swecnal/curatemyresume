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
  cta: string;
  ctaStyle: string;
}

const plans: PlanInfo[] = [
  {
    tier: 'free',
    name: 'Free',
    price: '$0',
    period: '',
    curations: '3 ResumeRx/month',
    features: [
      '3 ResumeRx per month||Curate your resume to each job application',
      'Fit score & go/no-go verdict||Instantly know if a role is worth applying to',
      'Basic gap analysis||See where your resume falls short for each job',
      'Basic tailoring suggestions||Get specific tips to improve your resume\'s fit',
      'PDF export||Download your curated resume for each role',
    ],
    antiFeatures: [
      'No salary research',
      'No application tracking',
      'No resume storage',
      'No ATS formatting',
    ],
    highlighted: false,
    cta: 'Get Started Free',
    ctaStyle: 'border border-slate-300 bg-white text-slate-700 hover:scale-105 hover:border-slate-200 hover:bg-slate-50 hover:shadow-md',
  },
  {
    tier: 'job_hunting',
    name: 'Job Hunting',
    price: '$8',
    period: '/month',
    curations: '25 ResumeRx/month',
    features: [
      '25 ResumeRx per month||Curate your resume to each job application',
      'Everything in Free, plus:',
      'ATS formatting||Make sure your resume is read the RIGHT way',
      'Fair market salary research||Know what the role should pay before you negotiate',
      'Detailed skill gap breakdown||Understand exactly which skills to highlight or develop',
      'Application tracking||See what you applied to and when',
      'Priority analysis queue||Faster AI-powered resume results',
      'PDF export||Download your curated resume for each role',
    ],
    antiFeatures: [],
    highlighted: true,
    cta: 'Find Your New Job',
    ctaStyle: 'bg-indigo-600 text-white hover:scale-105 hover:bg-indigo-500 hover:shadow-md',
  },
  {
    tier: 'beast',
    name: 'PhD Mode',
    price: '$24',
    period: '/month',
    curations: 'Unlimited ResumeRx',
    features: [
      'Unlimited ResumeRx per month||Curate your resume to each job application',
      'Everything in Job Hunting',
      'Our most powerful AI||Explicitly trained to land YOU the interview',
      'Bulk ResumeRx||Save time with multiple curations at once',
      'Custom resume tailoring per role||Each resume rewritten to match the specific job',
      'Company tone matching||Startup? Enterprise? We match what they want',
      'Advanced salary + negotiation insights||Know your leverage and total comp benchmarks',
      'Resume Recall||Saves your curated resumes for future downloading',
      'Optimized cover letters||Tailored cover letters that complement your resume',
      'Company Reviews||Real insights into culture, pay, and interview process',
      'Priority support||Get answers fast',
    ],
    antiFeatures: [],
    highlighted: false,
    cta: 'Graduate to PhD Mode',
    ctaStyle: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:scale-105 hover:from-violet-500 hover:to-indigo-500 hover:shadow-md',
  },
];

export default function PricingCard({ currentTier, onSelectTier }: PricingCardProps) {
  return (
    <div className="grid items-start gap-6 md:grid-cols-3">
      {plans.map((plan) => {
        const isCurrent = currentTier === plan.tier;
        return (
          <div
            key={plan.tier}
            className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:z-10 hover:scale-[1.20] hover:shadow-lg ${
              plan.highlighted
                ? 'border-indigo-300 bg-white ring-2 ring-indigo-500'
                : plan.tier === 'beast'
                ? 'border-violet-200 bg-gradient-to-br from-violet-50/60 to-white'
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

            <ul className="mb-8 space-y-3">
              {plan.features.map((feature, i) => {
                const [mainText, subText] = feature.split('||');
                return (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <svg
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                        plan.highlighted ? 'text-indigo-500' : plan.tier === 'beast' ? 'text-violet-500' : 'text-green-500'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>
                      {mainText}
                      {subText && (
                        <span className="block text-xs text-slate-400">{subText}</span>
                      )}
                    </span>
                  </li>
                );
              })}
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
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isCurrent
                  ? 'cursor-not-allowed border border-slate-200 bg-slate-50 text-slate-400'
                  : plan.ctaStyle
              }`}
            >
              {isCurrent ? 'Current Plan' : plan.cta}
            </button>
          </div>
        );
      })}
    </div>
  );
}

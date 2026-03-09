import Link from 'next/link';
import Logo from '@/components/Logo';

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero — Dark gradient with floating shapes */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        {/* Decorative floating shapes */}
        <div className="pointer-events-none absolute inset-0">
          {/* Stethoscope curve — top right */}
          <svg className="absolute -right-12 -top-8 opacity-[0.07]" width="400" height="400" viewBox="0 0 400 400" fill="none">
            <path d="M50 50 C50 150, 150 200, 200 250 C250 300, 350 300, 350 200" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="350" cy="200" r="30" stroke="#818cf8" strokeWidth="3" />
            <circle cx="350" cy="200" r="15" stroke="#818cf8" strokeWidth="2" />
          </svg>
          {/* Document outline — bottom left */}
          <svg className="absolute -bottom-16 -left-8 opacity-[0.06]" width="300" height="380" viewBox="0 0 300 380" fill="none">
            <rect x="40" y="20" width="200" height="280" rx="12" stroke="#6366f1" strokeWidth="2" />
            <rect x="70" y="60" width="120" height="8" rx="4" fill="#6366f1" opacity="0.3" />
            <rect x="70" y="85" width="100" height="8" rx="4" fill="#6366f1" opacity="0.2" />
            <rect x="70" y="110" width="140" height="8" rx="4" fill="#6366f1" opacity="0.2" />
            <rect x="70" y="135" width="80" height="8" rx="4" fill="#6366f1" opacity="0.15" />
          </svg>
          {/* Dots grid — center */}
          <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]" width="600" height="400" viewBox="0 0 600 400">
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 12 }).map((_, col) => (
                <circle key={`${row}-${col}`} cx={col * 50 + 25} cy={row * 50 + 25} r="2" fill="#818cf8" />
              ))
            )}
          </svg>
          {/* Small stethoscope — left */}
          <svg className="absolute left-16 top-32 opacity-[0.05]" width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="30" cy="20" r="8" stroke="#a5b4fc" strokeWidth="2" />
            <circle cx="70" cy="20" r="8" stroke="#a5b4fc" strokeWidth="2" />
            <path d="M30 28 C30 50, 50 55, 50 70 C50 80, 60 90, 80 85 C95 82, 95 70, 95 60" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" />
            <circle cx="95" cy="55" r="12" stroke="#a5b4fc" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-6 sm:pb-36 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-indigo-500/20 px-4 py-1.5 text-sm font-medium text-indigo-300">
              AI-Powered Resume Diagnostics
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              <span className="block">Stop Guessing.</span>
              <span className="block bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Start Landing.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-indigo-200">
              Upload your resume and any job listing — our ResumeMD utilizes cutting-edge AI
              to diagnose your fit, identifies your gaps, and rewrites your resume &amp; cover
              letter to match each role <em className="italic">perfectly</em>. Fit scores,
              salary insights, and a tailored resume in seconds.
            </p>
            <div className="mt-10">
              <Link
                href="/try"
                className="inline-block rounded-lg bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-50 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                Get Your Free Diagnosis
              </Link>
              <p className="mt-4 text-sm text-indigo-400">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-indigo-300 underline underline-offset-2 hover:text-white">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Everything You Need to Land the Right Role
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From instant fitness checks to ATS-ready formatting, ResumeMD gives you
              the edge in every application.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
            {/* Fitness Check */}
            <Link href="/try" className="group">
              <div className="relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 group-hover:scale-[1.20] group-hover:shadow-lg">
                {/* Large illustration */}
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50">
                  <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
                    {/* Clipboard */}
                    <rect x="10" y="8" width="24" height="32" rx="3" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1.5" />
                    <rect x="16" y="4" width="12" height="6" rx="2" fill="#6366f1" />
                    {/* Magnifying glass */}
                    <circle cx="34" cy="30" r="8" fill="white" stroke="#4f46e5" strokeWidth="2" />
                    <line x1="40" y1="36" x2="44" y2="40" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Checkmarks inside clipboard */}
                    <path d="M15 18l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="23" y="17" width="8" height="2" rx="1" fill="#c7d2fe" />
                    <path d="M15 26l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="23" y="25" width="6" height="2" rx="1" fill="#c7d2fe" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">Fitness Check</h3>
                <p className="flex-1 text-sm leading-relaxed text-slate-600">
                  Instant fit score, go/no-go verdict, and a skill-by-skill breakdown before
                  you waste time applying. Know exactly where you stand.
                </p>
                {/* Hover CTA */}
                <div className="mt-6 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-block rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white">
                    Try for Free
                  </span>
                </div>
              </div>
            </Link>

            {/* ResumeRx */}
            <Link href="/try" className="group">
              <div className="relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 group-hover:scale-[1.20] group-hover:shadow-lg">
                {/* Large illustration */}
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">
                  <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
                    {/* Document */}
                    <rect x="8" y="4" width="24" height="34" rx="3" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x="13" y="10" width="14" height="2" rx="1" fill="#93c5fd" />
                    <rect x="13" y="15" width="10" height="2" rx="1" fill="#93c5fd" opacity="0.7" />
                    <rect x="13" y="20" width="14" height="2" rx="1" fill="#93c5fd" opacity="0.7" />
                    <rect x="13" y="25" width="8" height="2" rx="1" fill="#93c5fd" opacity="0.5" />
                    {/* Rx symbol */}
                    <circle cx="36" cy="32" r="10" fill="#3b82f6" />
                    <text x="36" y="37" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="serif">Rx</text>
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">ResumeRx</h3>
                <p className="flex-1 text-sm leading-relaxed text-slate-600">
                  Your resume, prescribed for every ATS. Auto-formatted, keyword-optimized,
                  and ready to pass any Applicant Tracking System.
                </p>
                {/* Hover CTA */}
                <div className="mt-6 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white">
                    Try for Free
                  </span>
                </div>
              </div>
            </Link>

            {/* Beast Mode */}
            <Link href="/signup" className="group">
              <div className="relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 group-hover:scale-[1.20] group-hover:shadow-lg">
                {/* Large illustration */}
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-50">
                  <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
                    {/* Stacked documents */}
                    <rect x="14" y="10" width="20" height="28" rx="2" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1" opacity="0.6" />
                    <rect x="11" y="7" width="20" height="28" rx="2" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1" opacity="0.8" />
                    <rect x="8" y="4" width="20" height="28" rx="2" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5" />
                    {/* Lightning bolt */}
                    <polygon points="30,2 22,22 30,22 20,44 38,18 28,18" fill="#8b5cf6" />
                    <polygon points="30,2 22,22 30,22 20,44 38,18 28,18" fill="url(#beastGrad)" />
                    <defs>
                      <linearGradient id="beastGrad" x1="20" y1="2" x2="38" y2="44">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  Beast Mode <span className="ml-1">&#9889;</span>
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-slate-600">
                  <strong className="text-slate-900">Unlimited</strong> diagnoses. Bulk-analyze
                  multiple roles at a time. Custom tailoring per position. Optimized cover letters.
                  Salary negotiation intel. Total job hunt domination.
                </p>
                {/* Hover CTA — bolder for Beast Mode */}
                <div className="mt-6 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-block rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm">
                    Unleash Beast Mode
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Downgrade your plan once you&apos;ve landed the role. We&apos;re here for the job hunt, not forever.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <LandingPricingSection />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-gradient-to-br from-indigo-600 to-blue-700 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-white">
            Ready to Diagnose Your Next Opportunity?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Upload your resume. Paste a job description. Get your diagnosis in seconds.
          </p>
          <Link
            href="/try"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-md"
          >
            Get Your Free Diagnosis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Logo size="sm" linkTo={false} />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} ResumeMD. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function LandingPricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '',
      curations: '3 diagnoses/month',
      features: [
        '3 resume-to-JD diagnoses per month',
        'Fit score & go/no-go verdict',
        'Basic gap analysis',
        'Basic tailoring suggestions',
        'PDF export',
      ],
      antiFeatures: [
        'No salary research',
        'No application tracking',
        'No resume storage',
        'No ATS formatting',
      ],
      highlighted: false,
      cta: 'Get Started Free',
      ctaStyle: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
    },
    {
      name: 'Job Hunting',
      price: '$6',
      period: '/month',
      curations: '25 diagnoses/month',
      features: [
        '25 resume-to-JD diagnoses per month',
        'Everything in Free',
        'ResumeRx — ATS formatting',
        'Fair market salary research',
        'Detailed skill gap breakdown',
        'Application tracking',
        'Priority analysis queue',
        'PDF export',
      ],
      highlighted: true,
      cta: 'Find Your New Job',
      ctaStyle: 'bg-indigo-600 text-white hover:bg-indigo-700',
    },
    {
      name: 'Beast Mode ⚡',
      price: '$24',
      period: '/month',
      curations: 'Unlimited diagnoses',
      features: [
        '**Unlimited** diagnoses per month',
        'Everything in Job Hunting',
        'Bulk diagnosis (multiple JDs at a time)',
        'Custom resume tailoring per role',
        'Company tone matching',
        'Advanced salary + negotiation insights',
        'Resume Recall (stored resumes)',
        'Optimized cover letters',
        'Priority support',
      ],
      highlighted: false,
      cta: 'Go Beast Mode ⚡',
      ctaStyle: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700',
    },
  ];

  return (
    <div className="grid items-center gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`group relative flex flex-col rounded-2xl border shadow-sm transition-all duration-300 hover:scale-[1.20] hover:shadow-lg ${
            plan.highlighted
              ? 'scale-105 border-indigo-300 bg-indigo-50 p-8 ring-2 ring-indigo-500'
              : 'border-slate-200 bg-white p-6'
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
            {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
          </div>
          <ul className="mb-8 flex-1 space-y-3">
            {plan.features.map((feature, i) => {
              // Handle **bold** syntax
              const parts = feature.split(/\*\*(.*?)\*\*/);
              return (
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
                  <span>
                    {parts.map((part, j) =>
                      j % 2 === 1 ? (
                        <strong key={j} className="font-bold text-slate-900">{part}</strong>
                      ) : (
                        part
                      )
                    )}
                  </span>
                </li>
              );
            })}
            {plan.antiFeatures?.map((af, i) => (
              <li key={`anti-${i}`} className="flex items-start gap-2 text-sm text-slate-400">
                <svg
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400"
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
          <Link
            href="/signup"
            className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-all ${plan.ctaStyle}`}
          >
            {plan.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}

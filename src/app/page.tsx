import Link from 'next/link';
import PricingCard from '@/components/PricingCard';

function LandingPricing() {
  return <LandingPricingClient />;
}

function LandingPricingClient() {
  'use client';
  return null;
}

const features = [
  {
    title: 'Fit Analysis',
    description:
      'Get an instant fit score comparing your resume against any job description. Know your strengths, gaps, and whether to apply before you invest the time.',
    icon: (
      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
  },
  {
    title: 'ResumeForge',
    description:
      'Automatically reformat your resume into a clean, ATS-optimized template. No more fighting with Word templates or worrying about parsing issues.',
    icon: (
      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: 'Beast Mode',
    description:
      'Unlimited curations for power users. Bulk analyze dozens of roles at once, get custom resume tailoring per position, and dominate your job search.',
    icon: (
      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
              AI-Powered Resume Diagnostics
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Stop Guessing.{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Start Landing.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Know exactly how your resume stacks up against every job description. Get fit
              scores, gap analysis, salary insights, and ATS-ready formatting -- all powered
              by AI that understands what recruiters are looking for.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/signup"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
              >
                Get Started Free
              </Link>
              <Link
                href="/try"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
              >
                Try It Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Everything you need to land the right role
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From instant fit analysis to ATS-ready formatting, Resume MD gives you
              the edge in every application.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Start free, upgrade when you are ready. No hidden fees.
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
          <h2 className="text-3xl font-bold text-white">Ready to diagnose your next opportunity?</h2>
          <p className="mt-4 text-lg text-indigo-100">
            Join thousands of job seekers who use Resume MD to apply smarter, not harder.
          </p>
          <Link
            href="/try"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-md"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
              <span className="text-[9px] font-bold text-white">rMD</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">Resume <span className="text-indigo-600">MD</span></span>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Resume MD. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function LandingPricingSection() {
  return <LandingPricingClientSection />;
}

// We inline a client component for the pricing cards on the landing page
function LandingPricingClientSection() {
  // Since this is a server component page, we render static pricing cards
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '',
      curations: '3 curations/month',
      features: [
        '3 resume-to-JD curations per month',
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
    },
    {
      name: 'Job Hunting',
      price: '$6',
      period: '/month',
      curations: '25 curations/month',
      features: [
        '25 resume-to-JD curations per month',
        'Everything in Free',
        'ResumeForge ATS formatting',
        'Fair market salary research',
        'Detailed skill gap breakdown',
        'Application tracking',
        'Priority analysis queue',
        'PDF export',
      ],
      highlighted: true,
    },
    {
      name: 'Beast Mode',
      price: '$24',
      period: '/month',
      curations: 'Unlimited curations',
      features: [
        'Unlimited curations per month',
        'Everything in Job Hunting',
        'Bulk curation (5 JDs at once)',
        'Custom resume tailoring per role',
        'Company tone matching',
        'Advanced salary + negotiation insights',
        'Resume Recall (stored resumes)',
        'Cover letter creation',
        'Priority support',
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative flex flex-col rounded-2xl border p-6 shadow-sm ${
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
            {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
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
            className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
              plan.highlighted
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Get Started
          </Link>
        </div>
      ))}
    </div>
  );
}

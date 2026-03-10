'use client';

import { useState, useEffect } from 'react';
import PricingCard from '@/components/PricingCard';
import Link from 'next/link';

type Tier = 'free' | 'job_hunting' | 'beast';

const tierBreakdowns = [
  {
    name: 'Free',
    price: '$0',
    color: 'border-slate-200',
    bg: 'bg-white',
    whatYouGet: [
      '3 ResumeRx per month',
      'Instant fit score with go/no-go verdict',
      'Basic gap analysis showing matched vs missing skills',
      'Basic tailoring suggestions per role',
      'PDF download of your curated resume',
    ],
    whoItsFor:
      'Casual job seekers exploring options, or anyone who wants to test ResumeMD before committing. See if your resume actually matches the roles you want — zero risk.',
    whyItMatters:
      'Most people apply blind. Even 3 ResumeRx a month gives you clarity on which roles are worth pursuing and which ones will waste your time.',
  },
  {
    name: 'Job Hunting',
    price: '$8/mo',
    color: 'border-indigo-200',
    bg: 'bg-indigo-50/30',
    whatYouGet: [
      '25 ResumeRx per month — enough for a serious job search',
      'ATS formatting to get past automated screening',
      'Fair market salary research for every role',
      'Detailed skill gap breakdown with actionable insights',
      'Application tracking to manage your pipeline',
      'Priority analysis queue — faster results',
      'Full PDF export of curated resumes',
    ],
    whoItsFor:
      'Active job seekers applying to multiple roles per week. You know what you want — you need every application to count.',
    whyItMatters:
      'Companies use ATS systems that auto-reject up to 75% of applicants before a human ever sees their resume. ATS formatting gets your resume past the bots. Salary research ensures you never lowball yourself.',
  },
  {
    name: 'PhD Mode \ud83c\udf93',
    price: '$24/mo',
    color: 'border-violet-200',
    bg: 'bg-violet-50/20',
    whatYouGet: [
      'Unlimited ResumeRx — no monthly cap',
      'Powered by our most advanced AI model',
      'Bulk analysis: curate multiple JDs at a time',
      'Custom resume tailoring per role with company tone matching',
      'Optimized cover letters generated per application',
      'Advanced salary research with negotiation talking points',
      'Company Reviews — culture, comp, and interview insights',
      'Resume Recall — your resumes stored and downloadable anytime',
      'Priority support',
    ],
    whoItsFor:
      'Serious job hunters who want total coverage. You\'re applying aggressively, targeting multiple companies, and need every edge possible.',
    whyItMatters:
      'PhD Mode uses our most powerful AI — explicitly trained to land you the interview. Every role gets a perfectly tailored resume and cover letter. Bulk analysis means you curate an entire week\'s worth of applications in minutes. Salary negotiation intel alone can pay for months of PhD Mode with a single offer.',
  },
];

export default function PricingPage() {
  const [currentTier, setCurrentTier] = useState<Tier>('free');
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTier() {
      try {
        const res = await fetch('/api/profile?stats=true');
        if (res.ok) {
          const data = await res.json();
          setCurrentTier(data.tier ?? 'free');
        }
      } catch {
        // Default to free
      } finally {
        setLoading(false);
      }
    }
    fetchTier();
  }, []);

  const handleSelectTier = async (tier: Tier) => {
    if (tier === currentTier) return;

    // Downgrading to free doesn't need Stripe
    if (tier === 'free') {
      return;
    }

    setRedirecting(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create checkout session.');
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setRedirecting(false);
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
          <p className="text-sm text-slate-500">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">Simple, Transparent Pricing</h1>
          <p className="mt-3 text-lg text-slate-600">
            Downgrade once you&apos;ve landed the role. We&apos;re here for the job hunt, not forever.
          </p>
          {currentTier !== 'free' && (
            <p className="mt-2 text-sm text-indigo-600">
              You are currently on the{' '}
              <span className="font-semibold capitalize">{currentTier.replace('_', ' ')}</span> plan.
            </p>
          )}
        </div>

        {error && (
          <div className="mx-auto mb-8 max-w-md rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {redirecting && (
          <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Redirecting to checkout...
          </div>
        )}

        <PricingCard currentTier={currentTier} onSelectTier={handleSelectTier} />

        {/* Manage Subscription */}
        {currentTier !== 'free' && (
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              Need to manage your subscription?{' '}
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('/api/stripe/portal', { method: 'POST' });
                    if (res.ok) {
                      const data = await res.json();
                      if (data.url) window.location.href = data.url;
                    }
                  } catch {
                    // Portal not available yet
                  }
                }}
                className="font-medium text-indigo-600 underline transition-colors hover:text-indigo-700"
              >
                Manage Subscription
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      {/* Tier Breakdowns */}
      <section className="bg-gradient-to-b from-slate-50/60 via-white to-white">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-extrabold text-slate-900">
            What Each Plan Gives You
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-base text-slate-500">
            Every tier is built for a different stage of your job search. Here&apos;s the full breakdown.
          </p>

          <div className="space-y-12">
            {tierBreakdowns.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border ${tier.color} ${tier.bg} p-8 sm:p-10`}
              >
                <div className="mb-6 flex flex-wrap items-baseline gap-3">
                  <h3 className="text-2xl font-extrabold text-slate-900">{tier.name}</h3>
                  <span className="text-lg font-semibold text-indigo-600">{tier.price}</span>
                </div>

                {/* What You Get — compact inline list */}
                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
                    What You Get
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tier.whatYouGet.map((item, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                        <svg className="h-3.5 w-3.5 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Who It's For + Why It Matters — side by side */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                      Who It&apos;s For
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-700">{tier.whoItsFor}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                      Why It Matters
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-700">{tier.whyItMatters}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Angled divider: breakdowns → CTA */}
      <div className="relative" style={{ backgroundColor: '#ffffff' }}>
        <svg
          className="block w-full"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: '60px' }}
        >
          <path d="M0 60 L0 20 Q720 -20, 1440 20 L1440 60 Z" fill="#ffffff" />
          <path d="M0 60 L0 40 Q720 0, 1440 40 L1440 60 Z" fill="#4f46e5" />
        </svg>
      </div>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white">
            Start With a Free Diagnosis
          </h2>
          <p className="mt-3 text-base text-indigo-100">
            No credit card required. See how ResumeMD works before you upgrade.
          </p>
          <Link
            href="/try"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-md"
          >
            Get Your Free Diagnosis
          </Link>
        </div>
      </section>
    </div>
  );
}

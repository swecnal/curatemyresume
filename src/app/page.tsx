import Link from 'next/link';
import Logo from '@/components/Logo';
import StatsSection from '@/components/StatsSection';
import HeroAB from '@/components/HeroAB';

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero — A/B tested */}
      <HeroAB />

      {/* Wave divider: hero → stats */}
      <div className="relative -mt-1" style={{ backgroundColor: '#0f172a' }}>
        <svg
          className="block w-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: '80px' }}
        >
          <path
            d="M0 40 C360 80, 720 0, 1080 40 S1440 60, 1440 40 L1440 80 L0 80 Z"
            fill="#f1f5f9"
          />
        </svg>
      </div>

      {/* Stats */}
      <StatsSection />

      {/* Features */}
      <section id="features" className="border-t border-slate-200 bg-gradient-to-br from-slate-50 via-indigo-50/50 to-blue-50/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Everything You Need to<br />Land{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">the Right Role</span>
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
                <div className="animate-float mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50">
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
                <div className="animate-float mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50" style={{ animationDelay: '0.5s' }}>
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

            {/* PhD Mode */}
            <Link href="/signup" className="group">
              <div className="relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 group-hover:scale-[1.20] group-hover:shadow-lg">
                {/* Large illustration */}
                <div className="animate-float mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-50" style={{ animationDelay: '1s' }}>
                  <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
                    {/* Stacked documents */}
                    <rect x="14" y="10" width="20" height="28" rx="2" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1" opacity="0.6" />
                    <rect x="11" y="7" width="20" height="28" rx="2" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1" opacity="0.8" />
                    <rect x="8" y="4" width="20" height="28" rx="2" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5" />
                    {/* Graduation cap */}
                    <polygon points="30,8 20,14 30,20 40,14" fill="#8b5cf6" />
                    <line x1="30" y1="20" x2="30" y2="28" stroke="#8b5cf6" strokeWidth="1.5" />
                    <path d="M23 16 L23 24 Q26.5 27 30 24" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <circle cx="30" cy="28" r="1.5" fill="#8b5cf6" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  PhD Mode <span className="ml-1">&#127891;</span>
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-slate-600">
                  <strong className="text-slate-900">Unlimited</strong> diagnoses. Powered by{' '}
                  <strong className="text-slate-900">ultra-advanced AI</strong> — explicitly
                  engineered to land interviews. Bulk-analyze multiple roles. Custom tailoring.
                  Cover letters. Salary negotiation intel. Total job hunt domination.
                </p>
                {/* Hover CTA — bolder for PhD Mode */}
                <div className="mt-6 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-block rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm">
                    Graduate to PhD Mode
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Soft divider: features → how-it-works */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      {/* How It Works — Process Steps */}
      <section className="bg-gradient-to-b from-indigo-50/60 via-blue-50/40 to-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-2xl font-extrabold text-slate-900">
            Four Steps to Job-winning Resumes.
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { step: '1', title: 'Upload', desc: 'Drop your resume & paste a job listing', color: 'bg-indigo-100 text-indigo-600' },
              { step: '2', title: 'Diagnose', desc: 'AI analyzes fit, gaps & salary data', color: 'bg-blue-100 text-blue-600' },
              { step: '3', title: 'Tailor', desc: 'Get a rewritten resume optimized for the role', color: 'bg-violet-100 text-violet-600' },
              { step: '4', title: 'Apply', desc: 'Submit with confidence & track results', color: 'bg-green-100 text-green-600' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${item.color}`}>
                  {item.step}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave divider: how-it-works → testimonials (light → dark) */}
      <div className="relative" style={{ backgroundColor: '#ffffff' }}>
        <svg
          className="block w-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: '80px' }}
        >
          <path
            d="M0 40 C480 80, 960 0, 1440 40 L1440 80 L0 80 Z"
            fill="#0f172a"
          />
        </svg>
      </div>

      {/* Testimonials — Dark section for visual contrast */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-24">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -right-32 bottom-1/4 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold text-white">
            <em className="italic">Real</em> Results from <em className="italic">Real</em> Job Seekers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-indigo-200">
            Here&apos;s what happens when you stop guessing and start diagnosing.
          </p>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  'I was mass-applying to 50+ roles a week and hearing nothing. ResumeMD diagnosed why — my resume was missing half the keywords these ATS systems scan for.',
                result: 'Landed 3 interviews in my first week',
                suffix: ' after using ResumeRx.',
                initials: 'MR',
                name: 'Marcus R.',
                role: 'Software Engineer — Atlanta, GA',
                color: 'bg-indigo-500/20 text-indigo-300',
              },
              {
                quote:
                  'The salary research alone paid for 6 months of my subscription. I was about to accept $85k when ResumeMD showed me the fair market range was $105-120k.',
                result: 'Negotiated to $112k',
                suffix: '.',
                initials: 'JT',
                name: 'Jasmine T.',
                role: 'Product Manager — Chicago, IL',
                color: 'bg-blue-500/20 text-blue-300',
              },
              {
                quote:
                  'PhD Mode is unreal. I bulk-analyzed 12 job postings on a Sunday night and had tailored resumes for all of them by Monday morning.',
                result: 'Got an offer within 3 weeks',
                suffix: ' of switching to ResumeMD.',
                initials: 'DK',
                name: 'David K.',
                role: 'Data Analyst — Austin, TX',
                color: 'bg-violet-500/20 text-violet-300',
              },
            ].map((t) => (
              <div key={t.initials} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  &ldquo;{t.quote} <strong className="text-white">{t.result}</strong>{t.suffix}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave divider: testimonials → pricing (dark → light) */}
      <div className="relative" style={{ backgroundColor: '#1e1b4b' }}>
        <svg
          className="block w-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: '80px' }}
        >
          <path
            d="M0 40 C360 0, 720 80, 1080 40 S1440 20, 1440 40 L1440 80 L0 80 Z"
            fill="#eef2ff"
          />
        </svg>
      </div>

      {/* Pricing */}
      <section id="pricing" className="bg-gradient-to-br from-indigo-50 via-white to-blue-50/60 py-24">
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

      {/* Gradient divider: pricing → FAQ */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      {/* FAQ */}
      <section className="bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-50 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-12 space-y-4">
            {[
              {
                q: 'How is this different from ChatGPT?',
                a: "ChatGPT is a general-purpose chatbot. ResumeMD is purpose-built for job applications — it scores your resume against specific job descriptions, identifies skill gaps, researches salaries, formats for ATS systems, and tracks your applications. It's not a conversation; it's a diagnostic tool.",
              },
              {
                q: 'Is my resume data stored or shared?',
                a: 'Your resume is processed securely and never shared with third parties. Free tier data is deleted after analysis. Paid plans include Resume Recall for optional storage that you control.',
              },
              {
                q: 'What file formats do you support?',
                a: 'PDF and DOCX uploads are supported. Your tailored resumes are exported as clean, ATS-optimized PDFs.',
              },
              {
                q: 'Can I cancel anytime?',
                a: "Yes. No contracts, no cancellation fees. Downgrade to Free whenever you want — we're built for the job hunt, not forever.",
              },
              {
                q: 'How accurate are the fit scores?',
                a: "Our AI analyzes keyword alignment, required vs. preferred qualifications, years of experience, and skill overlap against the actual job description. It's not perfect, but it's significantly better than guessing — and it gets better with every update.",
              },
            ].map((item, i) => (
              <details key={i} className="group rounded-xl border border-slate-200 bg-white shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-semibold text-slate-900">
                  {item.q}
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <p className="px-6 pb-4 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Angled divider: FAQ → CTA */}
      <div className="relative" style={{ backgroundColor: '#f8fafc' }}>
        <svg
          className="block w-full"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: '60px' }}
        >
          <path d="M0 60 L0 20 Q720 -20, 1440 20 L1440 60 Z" fill="#f8fafc" />
          <path d="M0 60 L0 40 Q720 0, 1440 40 L1440 60 Z" fill="#4f46e5" />
        </svg>
      </div>

      {/* CTA */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            <span className="block">Stop Sending Your Resume</span>
            <span className="block">Into{' '}<span className="bg-gradient-to-r from-red-300 via-orange-300 to-amber-300 bg-clip-text text-transparent">the Void</span>.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-indigo-100">
            Every application without a diagnosis is a roll of the dice. Know your fit, fix your
            gaps, and apply with a resume that actually gets read.
          </p>
          <Link
            href="/try"
            className="mt-10 inline-block rounded-xl bg-white px-10 py-4 text-base font-extrabold text-indigo-700 shadow-lg shadow-black/20 transition-all duration-200 hover:scale-105 hover:bg-indigo-50 hover:shadow-xl hover:shadow-black/30"
          >
            Start Landing Interviews &rarr;
          </Link>
          <p className="mt-4 text-sm text-indigo-300">Free. No credit card required.</p>
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
      name: 'Free \ud83c\udf89',
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
      name: 'Job Hunting \ud83d\udd0d',
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
      highlighted: true,
      cta: 'Find Your New Job',
      ctaStyle: 'bg-indigo-600 text-white hover:scale-105 hover:bg-indigo-500 hover:shadow-md',
    },
    {
      name: 'PhD Mode \ud83c\udf93',
      price: '$24',
      period: '/month',
      curations: 'Unlimited ResumeRx',
      features: [
        '**Unlimited** ResumeRx per month||Curate your resume to each job application',
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
      highlighted: false,
      cta: 'Graduate to PhD Mode',
      ctaStyle: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:scale-105 hover:from-violet-500 hover:to-indigo-500 hover:shadow-md',
    },
  ];

  return (
    <div className="grid items-center gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`group relative flex flex-col rounded-2xl border shadow-sm transition-all duration-300 hover:z-10 hover:scale-[1.20] hover:shadow-lg ${
            plan.highlighted
              ? 'scale-105 border-indigo-300 bg-indigo-50 p-8 ring-2 ring-indigo-500'
              : 'border-slate-200 bg-white p-6'
          }`}
        >
          {plan.highlighted && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="animate-shimmer rounded-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-600 px-3 py-1 text-xs font-semibold text-white">
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
              // Handle ||subtext separator
              const [mainText, subText] = feature.split('||');
              // Handle **bold** syntax
              const parts = mainText.split(/\*\*(.*?)\*\*/);
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
                    <span>
                      {parts.map((part, j) =>
                        j % 2 === 1 ? (
                          <strong key={j} className="font-bold text-slate-900">{part}</strong>
                        ) : (
                          part
                        )
                      )}
                    </span>
                    {subText && (
                      <span className="block text-xs text-slate-400">{subText}</span>
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
            className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-all duration-200 ${plan.ctaStyle}`}
          >
            {plan.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}

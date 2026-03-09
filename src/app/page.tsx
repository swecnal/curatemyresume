import Link from 'next/link';
import Logo from '@/components/Logo';
import StatsSection from '@/components/StatsSection';

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero — Dark gradient with floating shapes */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        {/* Decorative floating shapes — high contrast, recognizable */}
        <div className="pointer-events-none absolute inset-0">
          {/* Stethoscope — top right */}
          <svg className="absolute -right-4 -top-4 opacity-[0.14]" width="360" height="360" viewBox="0 0 360 360" fill="none">
            {/* Earpieces */}
            <circle cx="100" cy="40" r="14" stroke="#a5b4fc" strokeWidth="3" />
            <circle cx="160" cy="40" r="14" stroke="#a5b4fc" strokeWidth="3" />
            {/* Tubing from earpieces down to Y-junction */}
            <path d="M100 54 C100 100, 120 120, 130 140" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
            <path d="M160 54 C160 100, 140 120, 130 140" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
            {/* Single tube down to chest piece */}
            <path d="M130 140 C130 200, 130 240, 200 260 C240 270, 260 250, 260 220" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
            {/* Chest piece (bell) */}
            <circle cx="260" cy="200" r="28" stroke="#818cf8" strokeWidth="3.5" />
            <circle cx="260" cy="200" r="14" fill="#818cf8" opacity="0.2" />
          </svg>

          {/* Resume document — bottom left */}
          <svg className="absolute -bottom-10 -left-4 opacity-[0.13]" width="280" height="340" viewBox="0 0 280 340" fill="none">
            {/* Page with folded corner */}
            <path d="M40 20 H200 L230 50 V300 Q230 310 220 310 H50 Q40 310 40 300 Z" stroke="#a5b4fc" strokeWidth="2.5" fill="none" />
            <path d="M200 20 V50 H230" stroke="#a5b4fc" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
            {/* Photo placeholder */}
            <rect x="60" y="50" width="40" height="48" rx="4" stroke="#818cf8" strokeWidth="2" fill="#818cf8" opacity="0.1" />
            {/* Name line */}
            <rect x="115" y="55" width="90" height="8" rx="4" fill="#a5b4fc" opacity="0.4" />
            {/* Subtitle line */}
            <rect x="115" y="72" width="65" height="6" rx="3" fill="#a5b4fc" opacity="0.25" />
            {/* Section header */}
            <rect x="60" y="120" width="50" height="6" rx="3" fill="#818cf8" opacity="0.35" />
            {/* Text lines */}
            <rect x="60" y="140" width="150" height="5" rx="2.5" fill="#a5b4fc" opacity="0.2" />
            <rect x="60" y="155" width="130" height="5" rx="2.5" fill="#a5b4fc" opacity="0.2" />
            <rect x="60" y="170" width="145" height="5" rx="2.5" fill="#a5b4fc" opacity="0.2" />
            {/* Section header 2 */}
            <rect x="60" y="200" width="60" height="6" rx="3" fill="#818cf8" opacity="0.35" />
            {/* More text lines */}
            <rect x="60" y="220" width="140" height="5" rx="2.5" fill="#a5b4fc" opacity="0.2" />
            <rect x="60" y="235" width="120" height="5" rx="2.5" fill="#a5b4fc" opacity="0.2" />
            <rect x="60" y="250" width="150" height="5" rx="2.5" fill="#a5b4fc" opacity="0.2" />
          </svg>

          {/* Target/bullseye — center right (fit score) */}
          <svg className="absolute right-1/4 top-1/2 -translate-y-1/2 opacity-[0.08]" width="200" height="200" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="#818cf8" strokeWidth="2" />
            <circle cx="100" cy="100" r="55" stroke="#818cf8" strokeWidth="2" />
            <circle cx="100" cy="100" r="30" stroke="#818cf8" strokeWidth="2" />
            <circle cx="100" cy="100" r="10" fill="#818cf8" opacity="0.3" />
          </svg>

          {/* Checkmark badge — top left */}
          <svg className="absolute left-12 top-20 opacity-[0.10]" width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="#a5b4fc" strokeWidth="2.5" />
            <path d="M30 52 L44 66 L72 38" stroke="#a5b4fc" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-6 sm:pb-36 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-indigo-500/20 px-4 py-1.5 text-sm font-medium text-indigo-300">
              AI-Powered Resume Diagnostics
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              <span className="block">Stop Guessing.</span>
              <span className="block bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text pb-2 text-transparent sm:text-7xl" style={{ letterSpacing: '0.01em' }}>
                Start Landing.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold text-white">
              Land your next role with ResumeMD.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-indigo-200">
              Upload your resume and any job listing — our ResumeMD utilizes cutting-edge AI
              to diagnose your fit, identifies your gaps, and rewrites your resume &amp; cover
              letter to match each role <em className="italic">perfectly</em>. Fit scores,
              salary insights, and a tailored resume in seconds.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/try"
                className="inline-block rounded-xl bg-white px-10 py-4 text-base font-extrabold text-indigo-700 shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-105 hover:bg-indigo-50 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                Diagnose Your Resume Free
              </Link>
              <Link
                href="/how-it-works"
                className="inline-block rounded-xl border border-indigo-400/40 px-8 py-4 text-base font-semibold text-indigo-200 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-500/10 hover:text-white"
              >
                Why it Works
              </Link>
            </div>
            <div className="mt-4">
              <p className="text-sm text-indigo-400">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-indigo-300 underline underline-offset-2 hover:text-white">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Results stats row */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-white sm:text-4xl">85%</p>
              <p className="mt-1 text-sm text-indigo-300">Time Saved on Tailoring</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-white sm:text-4xl">3x</p>
              <p className="mt-1 text-sm text-indigo-300">More Interview Callbacks*</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-white sm:text-4xl">&lt;2 min</p>
              <p className="mt-1 text-sm text-indigo-300">Average Diagnosis Time</p>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-xl text-center text-xs text-indigo-400/60">
            *Based on early user data and projected outcomes.
          </p>
        </div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* Features */}
      <section id="features" className="border-t border-slate-200 bg-slate-50 py-24">
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

            {/* PhD Mode */}
            <Link href="/signup" className="group">
              <div className="relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 group-hover:scale-[1.20] group-hover:shadow-lg">
                {/* Large illustration */}
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-50">
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
                  <strong className="text-slate-900">Unlimited</strong> diagnoses. Bulk-analyze
                  multiple roles at a time. Custom tailoring per position. Optimized cover letters.
                  Salary negotiation intel. Total job hunt domination.
                </p>
                {/* Hover CTA — bolder for PhD Mode */}
                <div className="mt-6 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-block rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm">
                    Activate PhD Mode
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works — Process Steps */}
      <section className="border-t border-slate-200 bg-white py-16">
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

      {/* Testimonials */}
      <section className="border-t border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold text-slate-900">
            Real Results from Real Job Seekers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-500">
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
                color: 'bg-indigo-100 text-indigo-600',
              },
              {
                quote:
                  'The salary research alone paid for 6 months of my subscription. I was about to accept $85k when ResumeMD showed me the fair market range was $105-120k.',
                result: 'Negotiated to $112k',
                suffix: '.',
                initials: 'JT',
                name: 'Jasmine T.',
                role: 'Product Manager — Chicago, IL',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                quote:
                  'PhD Mode is unreal. I bulk-analyzed 12 job postings on a Sunday night and had tailored resumes for all of them by Monday morning.',
                result: 'Got an offer within 3 weeks',
                suffix: ' of switching to ResumeMD.',
                initials: 'DK',
                name: 'David K.',
                role: 'Data Analyst — Austin, TX',
                color: 'bg-violet-100 text-violet-600',
              },
            ].map((t) => (
              <div key={t.initials} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  &ldquo;{t.quote} <strong className="text-slate-900">{t.result}</strong>{t.suffix}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
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

      {/* FAQ */}
      <section className="border-t border-slate-200 bg-slate-50 py-24">
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

      {/* CTA */}
      <section className="border-t border-slate-200 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 py-24">
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
      ctaStyle: 'border border-slate-300 bg-white text-slate-700 hover:scale-105 hover:border-slate-200 hover:bg-slate-50 hover:shadow-md',
    },
    {
      name: 'Job Hunting \ud83d\udd0d',
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
      ctaStyle: 'bg-indigo-600 text-white hover:scale-105 hover:bg-indigo-500 hover:shadow-md',
    },
    {
      name: 'PhD Mode \ud83c\udf93',
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
      cta: 'Go PhD Mode \ud83c\udf93',
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
            className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-all duration-200 ${plan.ctaStyle}`}
          >
            {plan.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}

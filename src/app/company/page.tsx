import Link from 'next/link';

export default function CompanyPage() {
  return (
    <div className="bg-white">
      {/* Hero — Dark gradient matching landing page */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-24">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute -right-16 -top-16 opacity-[0.06]" width="320" height="320" viewBox="0 0 320 320" fill="none">
            <path d="M40 40 C40 120, 120 160, 160 200 C200 240, 280 240, 280 160" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="280" cy="160" r="24" stroke="#818cf8" strokeWidth="3" />
          </svg>
          <svg className="absolute -bottom-12 -left-12 opacity-[0.05]" width="240" height="300" viewBox="0 0 240 300" fill="none">
            <rect x="30" y="15" width="160" height="220" rx="10" stroke="#6366f1" strokeWidth="2" />
            <rect x="55" y="50" width="100" height="6" rx="3" fill="#6366f1" opacity="0.25" />
            <rect x="55" y="70" width="80" height="6" rx="3" fill="#6366f1" opacity="0.15" />
            <rect x="55" y="90" width="110" height="6" rx="3" fill="#6366f1" opacity="0.15" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            About ResumeMD
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-200">
            We&apos;re building the smartest way to match talent with opportunity.
          </p>
        </div>
      </section>

      {/* Wave divider: hero → content */}
      <div className="relative -mt-1" style={{ backgroundColor: '#0f172a' }}>
        <svg
          className="block w-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: '80px' }}
        >
          <path
            d="M0 40 C360 80, 1080 0, 1440 40 L1440 80 L0 80 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      {/* Mission */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-4xl font-extrabold text-slate-900">Our Mission</h2>
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white p-8 sm:p-10">
            <div className="space-y-5 text-base leading-relaxed text-slate-600">
              <p>
                Job hunting is broken. You spend hours tailoring resumes, guessing what recruiters
                want, and applying to roles you might not even be qualified for. Worse — most
                companies use Applicant Tracking Systems (ATS) that auto-reject candidates before
                a human ever sees their resume. We built ResumeMD to fix that.
              </p>
              <p>
                ResumeMD uses cutting-edge AI to give you a clear diagnosis of how well your resume
                matches any job description — complete with fit scores, gap analysis, salary research,
                and actionable tailoring that gets your resume past the bots and in front of a real human.
              </p>
              <p>
                Think of us as your career physician: we examine the job, examine your resume, and
                tell you exactly what&apos;s healthy, what needs treatment, and how to land the offer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      {/* Values */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-4xl font-extrabold text-slate-900">What We Believe</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Transparency */}
            <div className="rounded-2xl border border-indigo-200/60 bg-white p-8 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100">
                <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">Transparency</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                You should know exactly where you stand before applying. No vague advice — just
                clear, data-driven insights that show you the full picture.
              </p>
            </div>

            {/* Efficiency */}
            <div className="rounded-2xl border border-indigo-200/60 bg-white p-8 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100">
                <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">Efficiency</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Stop wasting time on roles that aren&apos;t a fit. Apply smarter, not harder, with
                AI-powered targeting that tells you exactly where to focus your energy.
              </p>
            </div>

            {/* Accessibility */}
            <div className="rounded-2xl border border-indigo-200/60 bg-white p-8 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100">
                <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">Accessibility</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Career intelligence shouldn&apos;t cost a fortune. Our free tier gives everyone
                access to fit analysis — because everyone deserves to apply with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      {/* Contact */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Get in Touch</h2>
          <p className="text-base text-slate-600">
            Questions, feedback, or partnership inquiries? We&apos;d love to hear from you.
          </p>
          <p className="mt-4 text-sm font-medium">
            <a
              href="mailto:hello@resumemd.ai"
              className="text-indigo-600 underline underline-offset-2 transition-colors hover:text-indigo-800"
            >
              hello@resumemd.ai
            </a>
          </p>
        </div>
      </section>

      {/* Angled divider: contact → CTA */}
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

      {/* CTA */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Upload your resume and get your first diagnosis for free.
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

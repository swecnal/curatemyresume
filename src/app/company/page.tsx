import Link from 'next/link';

export default function CompanyPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            About Resume MD
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            We&apos;re building the smartest way to match talent with opportunity.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Our Mission</h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            <p>
              Job hunting is broken. You spend hours tailoring resumes, guessing what recruiters
              want, and applying to roles you might not even be qualified for. We built Resume MD
              to fix that.
            </p>
            <p>
              Resume MD uses AI to give you a clear diagnosis of how well your resume matches any
              job description — complete with fit scores, gap analysis, salary research, and
              actionable tailoring suggestions.
            </p>
            <p>
              Think of us as your career physician: we examine the job, examine your resume, and
              tell you exactly what&apos;s healthy, what needs treatment, and how to get the offer.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">What We Believe</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-2 font-bold text-slate-900">Transparency</h3>
              <p className="text-sm text-slate-600">
                You should know exactly where you stand before applying. No vague advice — just
                clear, data-driven insights.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-2 font-bold text-slate-900">Efficiency</h3>
              <p className="text-sm text-slate-600">
                Stop wasting time on roles that aren&apos;t a fit. Apply smarter, not harder, with
                AI-powered targeting.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-2 font-bold text-slate-900">Accessibility</h3>
              <p className="text-sm text-slate-600">
                Career intelligence shouldn&apos;t cost a fortune. Our free tier gives everyone
                access to fit analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Get in Touch</h2>
          <p className="text-base text-slate-600">
            Questions, feedback, or partnership inquiries? We&apos;d love to hear from you.
          </p>
          <p className="mt-4 text-sm font-medium text-indigo-600">
            hello@resumemd.com
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

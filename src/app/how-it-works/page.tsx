import Link from 'next/link';

const steps = [
  {
    number: '01',
    title: 'Upload Your Resume',
    description:
      'Upload a PDF, DOCX, or paste your resume text. Our AI parses your skills, experience, and qualifications instantly.',
  },
  {
    number: '02',
    title: 'Paste a Job Description',
    description:
      'Copy any job posting and paste it in. We analyze every requirement, qualification, and keyword the recruiter is looking for.',
  },
  {
    number: '03',
    title: 'Get Your Diagnosis',
    description:
      'Receive a fit score, go/no-go verdict, skill gap analysis, and salary insights. Know exactly where you stand before applying.',
  },
  {
    number: '04',
    title: 'Tailor & Apply',
    description:
      'Use our AI to tailor your resume for each role. Download a polished PDF and apply with confidence.',
  },
];

const features = [
  {
    title: 'Fit Score & Verdict',
    description: 'Instant 1-10 fit score with a clear go/no-go recommendation.',
  },
  {
    title: 'Gap Analysis',
    description: 'See exactly which skills and qualifications you match and which you are missing.',
  },
  {
    title: 'Salary Research',
    description: 'Fair market salary estimates based on the role, location, and your experience.',
  },
  {
    title: 'Resume Tailoring',
    description: 'AI rewrites your resume to highlight the skills each specific role demands.',
  },
  {
    title: 'ATS Formatting',
    description: 'ResumeForge reformats your resume to pass Applicant Tracking Systems.',
  },
  {
    title: 'PDF Export',
    description: 'Download your diagnosis reports and tailored resumes as clean PDFs.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            How Resume MD Works
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Four simple steps from job posting to tailored application. No guesswork.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, idx) => (
              <div key={step.number} className={`flex items-start gap-8 ${idx % 2 === 1 ? 'md:flex-row-reverse md:text-right' : ''}`}>
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-2xl font-bold text-slate-900">
            What You Get
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="mb-2 text-sm font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">Ready to try it?</h2>
          <p className="mt-3 text-base text-slate-600">
            Upload your resume and a job description. Get your diagnosis in seconds.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/try"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
            >
              Try It Now
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

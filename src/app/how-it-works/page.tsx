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
    title: 'Add a Job Listing',
    description:
      'Paste a job description or link directly to the posting. We analyze every requirement, qualification, and keyword the recruiter is looking for. With PhD Mode, diagnose multiple roles at once.',
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
      'Our AI rewrites your resume for each specific role, formats it for ATS systems, and delivers a polished PDF ready to submit.',
  },
];

const features = [
  {
    title: 'Fit Score & Verdict',
    description: 'Instant 1-10 fit score with a clear go/no-go recommendation so you never waste time on a bad match.',
    icon: 'target',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-600',
  },
  {
    title: 'Skill Gap Analysis',
    description: 'Side-by-side breakdown of matched vs missing skills. See exactly what the role demands and where you stand.',
    icon: 'chart',
    color: 'bg-blue-50 border-blue-200 text-blue-600',
  },
  {
    title: 'Salary Research',
    description: 'Fair market salary estimates based on the role, location, and your experience level. Never lowball yourself.',
    icon: 'dollar',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-600',
  },
  {
    title: 'AI Resume Tailoring',
    description: 'Your resume rewritten to highlight the exact skills each specific role demands. Custom-fit, every time.',
    icon: 'pencil',
    color: 'bg-violet-50 border-violet-200 text-violet-600',
  },
  {
    title: 'ATS Formatting',
    description: 'ResumeRx reformats your resume to pass Applicant Tracking Systems that auto-reject 75% of applicants.',
    icon: 'shield',
    color: 'bg-amber-50 border-amber-200 text-amber-600',
  },
  {
    title: 'PDF Export',
    description: 'Download your diagnosis reports and tailored resumes as clean, professional PDFs ready to submit.',
    icon: 'download',
    color: 'bg-rose-50 border-rose-200 text-rose-600',
  },
  {
    title: 'Application Tracking',
    description: 'Track every role you diagnose and apply to. Never lose track of where you are in your job search pipeline.',
    icon: 'list',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-600',
  },
  {
    title: 'Application Metrics',
    description: 'See your diagnosis history, fit score trends, and application stats at a glance. Data-driven job hunting.',
    icon: 'bar',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-600',
  },
  {
    title: 'Optimized Cover Letters',
    description: 'AI-generated cover letters tailored to each role and company tone. One more edge to stand out from the crowd.',
    icon: 'mail',
    color: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600',
  },
];

function FeatureIcon({ icon, className }: { icon: string; className?: string }) {
  const cls = `h-6 w-6 ${className ?? ''}`;
  switch (icon) {
    case 'target':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'chart':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
    case 'dollar':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'pencil':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      );
    case 'download':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      );
    case 'list':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      );
    case 'bar':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      );
    case 'mail':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      );
    default:
      return null;
  }
}

export default function HowItWorksPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-24">
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute -right-8 top-8 opacity-[0.06]" width="280" height="280" viewBox="0 0 280 280" fill="none">
            <path d="M40 40 C40 100, 100 140, 140 180 C180 220, 240 220, 240 160" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="240" cy="160" r="20" stroke="#818cf8" strokeWidth="3" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            How ResumeMD Works
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-200">
            Four simple steps from job posting to tailored application. No guesswork.
          </p>
        </div>
      </section>

      {/* Overview — Three paragraphs */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-extrabold text-slate-900">
            Why ResumeMD Exists
          </h2>
          <div className="space-y-6">
            <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-white p-6">
              <p className="text-base leading-relaxed text-slate-700">
                Every ResumeMD user gets instant fit scores, go/no-go verdicts, and skill gap
                breakdowns for every role they diagnose. Upload your resume once, paste any job listing,
                and in seconds you know exactly where you stand — which skills match, which are missing,
                and whether the role is worth your time. Download tailored resumes as polished PDFs
                ready to submit.
              </p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/50 to-white p-6">
              <p className="text-base leading-relaxed text-slate-700">
                When you&apos;re actively job hunting, you need more firepower. Get ATS-optimized
                formatting through ResumeRx so your resume actually gets past automated screening systems
                that reject up to 75% of applicants. Add fair market salary research so you never
                undervalue yourself, detailed skill gap analysis with actionable next steps, and full
                application tracking to manage your pipeline.
              </p>
            </div>
            <div className="rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50/50 to-white p-6">
              <p className="text-base leading-relaxed text-slate-700">
                With <strong className="font-bold text-slate-900">PhD Mode</strong>, you get unlimited
                diagnoses, bulk analysis of multiple roles at once, custom resume tailoring per position,
                optimized cover letters, salary negotiation talking points, and stored resume history. It&apos;s
                everything you need to <strong className="font-bold text-slate-900">apply to every role with
                a perfectly tailored resume and actually land the interview</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-t border-slate-200 bg-gradient-to-br from-slate-50 to-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-16 text-center text-3xl font-extrabold text-slate-900">
            Four Steps to Your Next Role
          </h2>
          <div className="space-y-16">
            {steps.map((step, idx) => (
              <div key={step.number} className={`flex items-start gap-8 ${idx % 2 === 1 ? 'md:flex-row-reverse md:text-right' : ''}`}>
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-2xl font-bold text-white shadow-lg shadow-indigo-500/20">
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
      <section className="border-t border-slate-200 py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-extrabold text-slate-900">
            What You Get
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-base text-slate-500">
            Every feature is designed to save you time, increase your interview rate, and take the guesswork out of job applications.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className={`rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md ${
                  idx % 2 === 0
                    ? 'border-slate-200 bg-white'
                    : 'border-slate-100 bg-slate-50/50'
                }`}
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg border ${feature.color}`}>
                  <FeatureIcon icon={feature.icon} />
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-gradient-to-br from-indigo-600 to-blue-700 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Diagnose Your First Role?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Upload your resume and a job listing. Get your diagnosis in seconds — completely free.
          </p>
          <Link
            href="/try"
            className="mt-8 inline-block rounded-lg bg-white px-10 py-4 text-base font-bold text-indigo-700 shadow-lg shadow-indigo-900/20 transition-all duration-200 hover:scale-105 hover:bg-indigo-50 hover:shadow-xl"
          >
            Get Your Free Diagnosis
          </Link>
        </div>
      </section>
    </div>
  );
}

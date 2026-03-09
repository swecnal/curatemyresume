'use client';

import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

const stats: Stat[] = [
  { value: 42, suffix: '+', label: 'Applications per Interview', sublabel: 'Average in 2026' },
  { value: 250, suffix: '+', label: 'Applications per Offer', sublabel: 'Per corporate posting' },
  { value: 11, suffix: '+', label: 'Hours/Week Editing Resumes', sublabel: 'Active job seekers' },
  { value: 45, suffix: '+', label: 'Applications per Week', sublabel: 'To stay competitive' },
  { value: 12, suffix: '%', label: 'Actually Get a Rejection', sublabel: 'The rest? Ghosted.' },
  { value: 86, suffix: '%', label: 'Never Hear Back at All', sublabel: 'Your resume vanished' },
];

function useCountUp(end: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    let rafId: number;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, start]);

  return count;
}

function StatCard({ stat, index, visible }: { stat: Stat; index: number; visible: boolean }) {
  const count = useCountUp(stat.value, 1800 + index * 200, visible);

  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="text-4xl font-extrabold tracking-tight text-indigo-600 sm:text-5xl">
        {count}
        <span className="text-indigo-400">{stat.suffix}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-900">{stat.label}</p>
      <p className="mt-1 text-xs text-slate-500">{stat.sublabel}</p>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-t border-slate-200 bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
            The Job Market Is Brutal. Take Back Control.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            In 2026, the average job seeker submits over 250 applications before landing an offer.
            Hours spent rewriting resumes, tailoring cover letters, and filling out forms &mdash;
            only to never hear back. ResumeMD cuts resume tailoring time by up to 85%, so you
            spend less time applying and more time interviewing.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} visible={visible} />
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
          Sources: LinkedIn Economic Graph 2025, Jobvite Recruiter Nation Survey 2025,
          Bureau of Labor Statistics. ResumeMD time savings based on average user data.
        </p>
      </div>
    </section>
  );
}

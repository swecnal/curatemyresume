'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getOrAssignVariant,
  AB_COOKIE_NAME,
  AB_COOKIE_MAX_AGE,
} from '@/lib/ab-test';
import type { ABVariant } from '@/lib/ab-test';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export default function HeroAB() {
  const [variant, setVariant] = useState<ABVariant>('a');

  useEffect(() => {
    const existing = getCookie(AB_COOKIE_NAME);
    const [v, isNew] = getOrAssignVariant(existing);
    if (isNew) {
      setCookie(AB_COOKIE_NAME, v, AB_COOKIE_MAX_AGE);
    }
    setVariant(v);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Decorative floating shapes */}
      <div className="pointer-events-none absolute inset-0">
        {/* Stethoscope — top right */}
        <svg className="absolute -right-4 -top-4 opacity-[0.14]" width="360" height="360" viewBox="0 0 360 360" fill="none">
          <circle cx="100" cy="40" r="14" stroke="#a5b4fc" strokeWidth="3" />
          <circle cx="160" cy="40" r="14" stroke="#a5b4fc" strokeWidth="3" />
          <path d="M100 54 C100 100, 120 120, 130 140" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
          <path d="M160 54 C160 100, 140 120, 130 140" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
          <path d="M130 140 C130 200, 130 240, 200 260 C240 270, 260 250, 260 220" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
          <circle cx="260" cy="200" r="28" stroke="#818cf8" strokeWidth="3.5" />
          <circle cx="260" cy="200" r="14" fill="#818cf8" opacity="0.2" />
        </svg>

        {/* Resume document — bottom left */}
        <svg className="absolute -bottom-10 -left-4 opacity-[0.13]" width="280" height="340" viewBox="0 0 280 340" fill="none">
          <path d="M40 20 H200 L230 50 V300 Q230 310 220 310 H50 Q40 310 40 300 Z" stroke="#a5b4fc" strokeWidth="2.5" fill="none" />
          <path d="M200 20 V50 H230" stroke="#a5b4fc" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
          <rect x="60" y="50" width="40" height="48" rx="4" stroke="#818cf8" strokeWidth="2" fill="#818cf8" opacity="0.1" />
          <rect x="115" y="55" width="90" height="8" rx="4" fill="#a5b4fc" opacity="0.4" />
          <rect x="115" y="72" width="65" height="6" rx="3" fill="#a5b4fc" opacity="0.25" />
          <rect x="60" y="120" width="50" height="6" rx="3" fill="#818cf8" opacity="0.35" />
          <rect x="60" y="140" width="150" height="5" rx="2.5" fill="#a5b4fc" opacity="0.2" />
          <rect x="60" y="155" width="130" height="5" rx="2.5" fill="#a5b4fc" opacity="0.2" />
          <rect x="60" y="170" width="145" height="5" rx="2.5" fill="#a5b4fc" opacity="0.2" />
          <rect x="60" y="200" width="60" height="6" rx="3" fill="#818cf8" opacity="0.35" />
          <rect x="60" y="220" width="140" height="5" rx="2.5" fill="#a5b4fc" opacity="0.2" />
          <rect x="60" y="235" width="120" height="5" rx="2.5" fill="#a5b4fc" opacity="0.2" />
          <rect x="60" y="250" width="150" height="5" rx="2.5" fill="#a5b4fc" opacity="0.2" />
        </svg>

        {/* Target/bullseye */}
        <svg className="absolute right-1/4 top-1/2 -translate-y-1/2 opacity-[0.08]" width="200" height="200" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="#818cf8" strokeWidth="2" />
          <circle cx="100" cy="100" r="55" stroke="#818cf8" strokeWidth="2" />
          <circle cx="100" cy="100" r="30" stroke="#818cf8" strokeWidth="2" />
          <circle cx="100" cy="100" r="10" fill="#818cf8" opacity="0.3" />
        </svg>

        {/* Checkmark badge */}
        <svg className="absolute left-12 top-20 opacity-[0.10]" width="100" height="100" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="#a5b4fc" strokeWidth="2.5" />
          <path d="M30 52 L44 66 L72 38" stroke="#a5b4fc" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-6 sm:pb-36 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-indigo-500/20 px-4 py-1.5 text-sm font-medium text-indigo-300">
              AI-Powered Resume Diagnostics
            </span>
          </div>

          {variant === 'a' ? (
            <>
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
            </>
          ) : (
            <>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                <span className="block">Your Resume is Sick!</span>
                <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text pb-2 text-transparent sm:text-7xl" style={{ letterSpacing: '0.01em' }}>
                  Diagnose &amp; Fix it with ResumeMD
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold text-white">
                The AI-powered resume doctor that lands interviews.
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-indigo-200">
                Upload your resume and a job listing. ResumeMD runs a full diagnostic —
                fit score, skill gaps, salary research — then prescribes a tailored resume
                and cover letter that gets past ATS bots and into human hands.
              </p>
            </>
          )}

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/try"
              className="inline-block rounded-xl bg-white px-10 py-4 text-base font-extrabold text-indigo-700 shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-105 hover:bg-indigo-50 hover:shadow-xl hover:shadow-indigo-500/30"
            >
              {variant === 'a' ? 'Diagnose Your Resume Free' : 'Get Your Free Prescription'}
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
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Logo from '@/components/Logo';

export default function Nav() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const publicLinks = [
    { href: '/how-it-works', label: 'How & Why It Works' },
  ];

  const authLinks = [
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const rightLinks = [
    { href: '/pricing', label: 'Pricing' },
    { href: '/company', label: 'Company' },
  ];

  const navLinks = session?.user ? [...publicLinks, ...authLinks] : publicLinks;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo size="md" />

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 md:flex">
          {/* Left group */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}

          {/* Diagnose CTA */}
          <Link
            href="/curate"
            className="mx-3 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:scale-110 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            Diagnose
          </Link>

          {/* Right group */}
          {rightLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User / Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-slate-100"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-700">
                    {(session.user.name ?? 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-700">
                  {session.user.name}
                </span>
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/signup"
                className="rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {/* Diagnose CTA */}
            <Link
              href="/curate"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-base font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
            >
              Diagnose
            </Link>

            {/* Nav links */}
            {[...navLinks, ...rightLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 border-t border-slate-200 pt-3">
              {session?.user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-slate-100"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name ?? 'User'}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-700">
                        {(session.user.name ?? 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-700">
                      {session.user.name}
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut();
                    }}
                    className="mt-1 block w-full rounded-md px-3 py-2 text-left text-base font-medium text-slate-500 transition-colors hover:bg-slate-100"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg border border-indigo-600 px-4 py-2 text-center text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

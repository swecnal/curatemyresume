'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OnboardingForm {
  targetRole: string;
  salaryMin: string;
  salaryMax: string;
  linkedinUrl: string;
  yearsExperience: string;
  locationPreference: 'remote' | 'hybrid' | 'on-site' | 'flexible';
  industries: string[];
}

const industryOptions = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Sales',
  'Consulting',
  'Manufacturing',
  'Retail',
  'Government',
  'Nonprofit',
  'Media',
  'Legal',
  'Real Estate',
  'Energy',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<OnboardingForm>({
    targetRole: '',
    salaryMin: '',
    salaryMax: '',
    linkedinUrl: '',
    yearsExperience: '',
    locationPreference: 'remote',
    industries: [],
  });

  const handleIndustryToggle = (industry: string) => {
    setForm((prev) => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter((i) => i !== industry)
        : [...prev.industries, industry],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: form.targetRole,
          salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
          salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
          linkedinUrl: form.linkedinUrl || null,
          yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : null,
          locationPreference: form.locationPreference,
          industries: form.industries,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      router.push('/resume');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Set Up Your Profile</h1>
        <p className="mt-2 text-sm text-slate-500">
          Tell us about your goals so we can deliver better curation results.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Target Role */}
        <div>
          <label htmlFor="targetRole" className="mb-1.5 block text-sm font-medium text-slate-700">
            Target Role
          </label>
          <input
            id="targetRole"
            type="text"
            required
            value={form.targetRole}
            onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
            placeholder="e.g. Senior Product Manager"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Salary Min/Max */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="salaryMin" className="mb-1.5 block text-sm font-medium text-slate-700">
              Minimum Salary
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input
                id="salaryMin"
                type="number"
                min={0}
                step={1000}
                value={form.salaryMin}
                onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                placeholder="80,000"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-7 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div>
            <label htmlFor="salaryMax" className="mb-1.5 block text-sm font-medium text-slate-700">
              Maximum Salary
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input
                id="salaryMax"
                type="number"
                min={0}
                step={1000}
                value={form.salaryMax}
                onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                placeholder="150,000"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-7 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* LinkedIn URL */}
        <div>
          <label htmlFor="linkedinUrl" className="mb-1.5 block text-sm font-medium text-slate-700">
            LinkedIn URL
          </label>
          <input
            id="linkedinUrl"
            type="url"
            value={form.linkedinUrl}
            onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/yourname"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Years of Experience */}
        <div>
          <label htmlFor="yearsExperience" className="mb-1.5 block text-sm font-medium text-slate-700">
            Years of Experience
          </label>
          <select
            id="yearsExperience"
            value={form.yearsExperience}
            onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Select...</option>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((y) => (
              <option key={y} value={y}>
                {y} {y === 1 ? 'year' : 'years'}
              </option>
            ))}
            <option value="31">30+ years</option>
          </select>
        </div>

        {/* Location Preference */}
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-slate-700">Location Preference</legend>
          <div className="flex flex-wrap gap-3">
            {(['remote', 'hybrid', 'on-site', 'flexible'] as const).map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  form.locationPreference === option
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="locationPreference"
                  value={option}
                  checked={form.locationPreference === option}
                  onChange={() => setForm({ ...form, locationPreference: option })}
                  className="sr-only"
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Industry Preferences */}
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-slate-700">
            Industry Preferences <span className="text-slate-400">(select all that apply)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {industryOptions.map((industry) => {
              const selected = form.industries.includes(industry);
              return (
                <label
                  key={industry}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selected
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => handleIndustryToggle(industry)}
                    className="sr-only"
                  />
                  {industry}
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !form.targetRole.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            'Continue to Resume Upload'
          )}
        </button>
      </form>
    </div>
  );
}

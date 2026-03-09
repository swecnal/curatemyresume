'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

type LocationPreference = 'remote' | 'hybrid' | 'on-site' | 'flexible';

interface ProfileData {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  targetRole: string;
  salaryMin: string;
  salaryMax: string;
  linkedinUrl: string;
  yearsExperience: string;
  locationPreference: LocationPreference;
  industries: string[];
  tier: 'free' | 'active' | 'beast';
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

const defaultProfile: ProfileData = {
  name: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  targetRole: '',
  salaryMin: '',
  salaryMax: '',
  linkedinUrl: '',
  yearsExperience: '',
  locationPreference: 'remote',
  industries: [],
  tier: 'free',
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name ?? '',
            firstName: data.firstName ?? '',
            lastName: data.lastName ?? '',
            email: data.email ?? session?.user?.email ?? '',
            phone: data.phone ?? '',
            addressLine1: data.addressLine1 ?? '',
            addressLine2: data.addressLine2 ?? '',
            city: data.city ?? '',
            state: data.state ?? '',
            zip: data.zip ?? '',
            country: data.country ?? '',
            targetRole: data.targetRole ?? '',
            salaryMin: data.salaryMin != null ? String(data.salaryMin) : '',
            salaryMax: data.salaryMax != null ? String(data.salaryMax) : '',
            linkedinUrl: data.linkedinUrl ?? '',
            yearsExperience: data.yearsExperience != null ? String(data.yearsExperience) : '',
            locationPreference: data.locationPreference ?? 'remote',
            industries: data.industries ?? [],
            tier: data.tier ?? 'free',
          });
        } else {
          // Pre-fill from session if API not wired
          setProfile({
            ...defaultProfile,
            name: session?.user?.name ?? '',
            email: session?.user?.email ?? '',
          });
        }
      } catch {
        setProfile({
          ...defaultProfile,
          name: session?.user?.name ?? '',
          email: session?.user?.email ?? '',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [session]);

  const handleIndustryToggle = (industry: string) => {
    setProfile((prev) => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter((i) => i !== industry)
        : [...prev.industries, industry],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          addressLine1: profile.addressLine1,
          addressLine2: profile.addressLine2,
          city: profile.city,
          state: profile.state,
          zip: profile.zip,
          country: profile.country,
          targetRole: profile.targetRole,
          salaryMin: profile.salaryMin ? Number(profile.salaryMin) : null,
          salaryMax: profile.salaryMax ? Number(profile.salaryMax) : null,
          linkedinUrl: profile.linkedinUrl,
          yearsExperience: profile.yearsExperience ? Number(profile.yearsExperience) : null,
          locationPreference: profile.locationPreference,
          industries: profile.industries,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save profile.');
      }

      setSuccessMessage('Profile updated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tierConfig: Record<string, { label: string; classes: string }> = {
    free: { label: 'Free', classes: 'bg-slate-100 text-slate-700' },
    active: { label: 'Active', classes: 'bg-indigo-100 text-indigo-700' },
    beast: { label: 'Beast', classes: 'bg-violet-100 text-violet-700' },
  };

  const currentTierConfig = tierConfig[profile.tier] ?? tierConfig.free;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your account and preferences.</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${currentTierConfig.classes}`}
          >
            {currentTierConfig.label}
          </span>
          <Link
            href="/pricing"
            className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
          >
            {profile.tier === 'free' ? 'Upgrade' : 'Manage Plan'}
          </Link>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        {/* Personal Information */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Personal Information</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                Display Name
              </label>
              <input
                id="name"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                Email is managed by your sign-in provider and cannot be changed here.
              </p>
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Address</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="addressLine1" className="mb-1.5 block text-sm font-medium text-slate-700">
                Address Line 1
              </label>
              <input
                id="addressLine1"
                type="text"
                value={profile.addressLine1}
                onChange={(e) => setProfile({ ...profile, addressLine1: e.target.value })}
                placeholder="123 Main St"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label htmlFor="addressLine2" className="mb-1.5 block text-sm font-medium text-slate-700">
                Address Line 2
              </label>
              <input
                id="addressLine2"
                type="text"
                value={profile.addressLine2}
                onChange={(e) => setProfile({ ...profile, addressLine2: e.target.value })}
                placeholder="Apt 4B"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-slate-700">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label htmlFor="state" className="mb-1.5 block text-sm font-medium text-slate-700">
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label htmlFor="zip" className="mb-1.5 block text-sm font-medium text-slate-700">
                  ZIP Code
                </label>
                <input
                  id="zip"
                  type="text"
                  value={profile.zip}
                  onChange={(e) => setProfile({ ...profile, zip: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
            <div>
              <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-slate-700">
                Country
              </label>
              <input
                id="country"
                type="text"
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                placeholder="United States"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Job Search Preferences */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Job Search Preferences</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="targetRole" className="mb-1.5 block text-sm font-medium text-slate-700">
                Target Role
              </label>
              <input
                id="targetRole"
                type="text"
                value={profile.targetRole}
                onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                placeholder="e.g. Senior Product Manager"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="salaryMin" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Minimum Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    $
                  </span>
                  <input
                    id="salaryMin"
                    type="number"
                    min={0}
                    step={1000}
                    value={profile.salaryMin}
                    onChange={(e) => setProfile({ ...profile, salaryMin: e.target.value })}
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    $
                  </span>
                  <input
                    id="salaryMax"
                    type="number"
                    min={0}
                    step={1000}
                    value={profile.salaryMax}
                    onChange={(e) => setProfile({ ...profile, salaryMax: e.target.value })}
                    placeholder="150,000"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-7 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="linkedinUrl" className="mb-1.5 block text-sm font-medium text-slate-700">
                LinkedIn URL
              </label>
              <input
                id="linkedinUrl"
                type="url"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/yourname"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="yearsExperience"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Years of Experience
              </label>
              <select
                id="yearsExperience"
                value={profile.yearsExperience}
                onChange={(e) => setProfile({ ...profile, yearsExperience: e.target.value })}
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
              <legend className="mb-3 text-sm font-medium text-slate-700">
                Location Preference
              </legend>
              <div className="flex flex-wrap gap-3">
                {(['remote', 'hybrid', 'on-site', 'flexible'] as const).map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                      profile.locationPreference === option
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="locationPreference"
                      value={option}
                      checked={profile.locationPreference === option}
                      onChange={() => setProfile({ ...profile, locationPreference: option })}
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
                Industry Preferences{' '}
                <span className="text-slate-400">(select all that apply)</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {industryOptions.map((industry) => {
                  const selected = profile.industries.includes(industry);
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
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

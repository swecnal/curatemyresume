'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ResumeUpload from '@/components/ResumeUpload';
import TagInput from '@/components/TagInput';

const yoeRanges = ['0-1', '2-4', '5-7', '8-10', '11-15', '16-20', '20+'];

const locationOptions = ['remote', 'hybrid', 'on-site', 'flexible'];

const clearanceOptions = [
  { value: 'none', label: 'None' },
  { value: 'no_preference', label: 'No preference' },
  { value: 'secret', label: 'Secret' },
  { value: 'top_secret', label: 'Top Secret' },
  { value: 'ts_sci', label: 'TS/SCI' },
];

const industryOptions = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Sales',
  'Consulting', 'Manufacturing', 'Retail', 'Government', 'Nonprofit', 'Media',
  'Legal', 'Real Estate', 'Energy',
];

interface ProfileData {
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
  currentRole: string;
  currentCompany: string;
  currentRoleDuration: string;
  currentSalaryBase: string;
  currentSalaryBonus: string;
  currentSalaryStock: string;
  strongSkills: string[];
  developingSkills: string[];
  targetRoles: string[];
  salaryMin: string;
  salaryMax: string;
  linkedinUrl: string;
  yearsExperienceRange: string;
  locationPreferences: string[];
  securityClearance: string;
  industries: string[];
  tier: 'free' | 'job_hunting' | 'beast';
}

const defaultProfile: ProfileData = {
  firstName: '', lastName: '', email: '', phone: '',
  addressLine1: '', addressLine2: '', city: '', state: '', zip: '', country: '',
  currentRole: '', currentCompany: '', currentRoleDuration: '',
  currentSalaryBase: '', currentSalaryBonus: '', currentSalaryStock: '',
  strongSkills: [], developingSkills: [],
  targetRoles: [], salaryMin: '', salaryMax: '', linkedinUrl: '',
  yearsExperienceRange: '', locationPreferences: [], securityClearance: 'none',
  industries: [], tier: 'free',
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeResume, setActiveResume] = useState<{ fileName: string; uploadDate: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumePopulated, setResumePopulated] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, resumeRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/resume/upload'),
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile({
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
            currentRole: data.currentRole ?? '',
            currentCompany: data.currentCompany ?? '',
            currentRoleDuration: data.currentRoleDuration ?? '',
            currentSalaryBase: data.currentSalaryBase != null ? String(data.currentSalaryBase) : '',
            currentSalaryBonus: data.currentSalaryBonus != null ? String(data.currentSalaryBonus) : '',
            currentSalaryStock: data.currentSalaryStock != null ? String(data.currentSalaryStock) : '',
            strongSkills: data.strongSkills ?? [],
            developingSkills: data.developingSkills ?? [],
            targetRoles: data.targetRoles ?? (data.targetRole ? [data.targetRole] : []),
            salaryMin: data.salaryMin != null ? String(data.salaryMin) : '',
            salaryMax: data.salaryMax != null ? String(data.salaryMax) : '',
            linkedinUrl: data.linkedinUrl ?? '',
            yearsExperienceRange: data.yearsExperienceRange ?? '',
            locationPreferences: data.locationPreferences ?? (data.locationPreference ? [data.locationPreference] : []),
            securityClearance: data.securityClearance ?? 'none',
            industries: data.industries ?? [],
            tier: data.tier ?? 'free',
          });
        } else {
          setProfile({ ...defaultProfile, email: session?.user?.email ?? '' });
        }

        if (resumeRes.ok) {
          const resumeData = await resumeRes.json();
          if (resumeData.active) {
            setActiveResume({
              fileName: resumeData.active.file_name ?? resumeData.active.fileName ?? 'Resume',
              uploadDate: resumeData.active.created_at ?? resumeData.active.createdAt ?? '',
            });
          }
        }
      } catch {
        setProfile({ ...defaultProfile, email: session?.user?.email ?? '' });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session]);

  const handleResumeUpload = useCallback(async (file: File | null, text: string | null) => {
    setUploading(true);
    setError(null);
    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        res = await fetch('/api/resume/upload', { method: 'POST', body: formData });
      } else {
        res = await fetch('/api/resume/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: text ?? '' }),
        });
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to upload resume.');
      }

      const data = await res.json();
      setActiveResume({
        fileName: data.file_name ?? file?.name ?? 'Resume',
        uploadDate: new Date().toISOString(),
      });

      // Auto-populate from parsed profile
      const parsed = data.parsed_profile;
      if (parsed) {
        setProfile((prev) => ({
          ...prev,
          city: prev.city || parsed.city || '',
          state: prev.state || parsed.state || '',
          currentRole: parsed.experience?.[0]?.title || prev.currentRole,
          currentCompany: parsed.experience?.[0]?.company || prev.currentCompany,
          currentRoleDuration: parsed.experience?.[0]
            ? `${parsed.experience[0].start_date} - ${parsed.experience[0].end_date}`
            : prev.currentRoleDuration,
          strongSkills: parsed.strong_skills?.length ? parsed.strong_skills : prev.strongSkills,
          developingSkills: parsed.developing_skills?.length ? parsed.developing_skills : prev.developingSkills,
        }));
        setResumePopulated(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  }, []);

  const handleLocationToggle = (loc: string) => {
    setProfile((prev) => ({
      ...prev,
      locationPreferences: prev.locationPreferences.includes(loc)
        ? prev.locationPreferences.filter((l) => l !== loc)
        : [...prev.locationPreferences, loc],
    }));
  };

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
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          addressLine1: profile.addressLine1,
          addressLine2: profile.addressLine2,
          city: profile.city,
          state: profile.state,
          zip: profile.zip,
          country: profile.country,
          currentRole: profile.currentRole,
          currentCompany: profile.currentCompany,
          currentRoleDuration: profile.currentRoleDuration,
          currentSalaryBase: profile.currentSalaryBase ? Number(profile.currentSalaryBase) : null,
          currentSalaryBonus: profile.currentSalaryBonus ? Number(profile.currentSalaryBonus) : null,
          currentSalaryStock: profile.currentSalaryStock ? Number(profile.currentSalaryStock) : null,
          strongSkills: profile.strongSkills,
          developingSkills: profile.developingSkills,
          targetRoles: profile.targetRoles,
          salaryMin: profile.salaryMin ? Number(profile.salaryMin) : null,
          salaryMax: profile.salaryMax ? Number(profile.salaryMax) : null,
          linkedinUrl: profile.linkedinUrl,
          yearsExperienceRange: profile.yearsExperienceRange,
          locationPreferences: profile.locationPreferences,
          securityClearance: profile.securityClearance,
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
    beast: { label: 'PhD', classes: 'bg-violet-100 text-violet-700' },
  };
  const currentTierConfig = tierConfig[profile.tier] ?? tierConfig.free;

  const inputClass = "w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
  const dollarInputClass = "w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-7 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your account, resume, and preferences.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${currentTierConfig.classes}`}>
            {currentTierConfig.label}
          </span>
          <Link href="/pricing" className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700">
            {profile.tier === 'free' ? 'Upgrade' : 'Manage Plan'}
          </Link>
        </div>
      </div>

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

      {/* ─── Section 1: Resume Upload ─── */}
      <div className="mb-8 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 p-8">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Your Resume</h2>
        <p className="mb-4 text-sm text-slate-500">
          Upload your resume to get started. We&apos;ll auto-fill your profile from it.
        </p>
        {activeResume && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-indigo-100 bg-white px-4 py-3">
            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{activeResume.fileName}</p>
              {activeResume.uploadDate && (
                <p className="text-xs text-slate-400">
                  Uploaded {new Date(activeResume.uploadDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">Active</span>
          </div>
        )}
        {resumePopulated && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Resume uploaded — we&apos;ve pre-filled some fields below. Review and save when ready.
          </div>
        )}
        <ResumeUpload onUpload={handleResumeUpload} />
        {uploading && (
          <div className="mt-3 flex items-center gap-2 text-sm text-indigo-600">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Parsing resume...
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        {/* ─── Section 2: Personal Information ─── */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Personal Information</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-slate-700">First Name</label>
                <input id="firstName" type="text" value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-slate-700">Last Name</label>
                <input id="lastName" type="text" value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input id="email" type="email" value={profile.email} readOnly
                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500" />
              <p className="mt-1 text-xs text-slate-400">Email is managed by your sign-in provider.</p>
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
              <input id="phone" type="tel" value={profile.phone} placeholder="(555) 123-4567"
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        {/* ─── Section 3: Current Role ─── */}
        <div>
          <h2 className="mb-1 text-lg font-semibold text-slate-900">Current Role</h2>
          <p className="mb-4 text-xs text-slate-400">Auto-populated from your resume. Edit if needed.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="currentRole" className="mb-1.5 block text-sm font-medium text-slate-700">Title</label>
              <input id="currentRole" type="text" value={profile.currentRole} placeholder="e.g. Senior Engineer"
                onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="currentCompany" className="mb-1.5 block text-sm font-medium text-slate-700">Company</label>
              <input id="currentCompany" type="text" value={profile.currentCompany} placeholder="e.g. Acme Corp"
                onChange={(e) => setProfile({ ...profile, currentCompany: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="currentRoleDuration" className="mb-1.5 block text-sm font-medium text-slate-700">Duration</label>
              <input id="currentRoleDuration" type="text" value={profile.currentRoleDuration} placeholder="e.g. Jan 2022 - Present"
                onChange={(e) => setProfile({ ...profile, currentRoleDuration: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        {/* ─── Section 4: Current Compensation ─── */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Current Compensation</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="currentSalaryBase" className="mb-1.5 block text-sm font-medium text-slate-700">Base Salary</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                <input id="currentSalaryBase" type="number" min={0} step={1000} value={profile.currentSalaryBase}
                  onChange={(e) => setProfile({ ...profile, currentSalaryBase: e.target.value })}
                  placeholder="120,000" className={dollarInputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="currentSalaryBonus" className="mb-1.5 block text-sm font-medium text-slate-700">Bonus / Profit Share</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                <input id="currentSalaryBonus" type="number" min={0} step={1000} value={profile.currentSalaryBonus}
                  onChange={(e) => setProfile({ ...profile, currentSalaryBonus: e.target.value })}
                  placeholder="15,000" className={dollarInputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="currentSalaryStock" className="mb-1.5 block text-sm font-medium text-slate-700">Stock / Equity Value</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                <input id="currentSalaryStock" type="number" min={0} step={1000} value={profile.currentSalaryStock}
                  onChange={(e) => setProfile({ ...profile, currentSalaryStock: e.target.value })}
                  placeholder="25,000" className={dollarInputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Section 5: Address ─── */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Address</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="addressLine1" className="mb-1.5 block text-sm font-medium text-slate-700">Address Line 1</label>
              <input id="addressLine1" type="text" value={profile.addressLine1} placeholder="123 Main St"
                onChange={(e) => setProfile({ ...profile, addressLine1: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="addressLine2" className="mb-1.5 block text-sm font-medium text-slate-700">Address Line 2</label>
              <input id="addressLine2" type="text" value={profile.addressLine2} placeholder="Apt 4B"
                onChange={(e) => setProfile({ ...profile, addressLine2: e.target.value })} className={inputClass} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-slate-700">City</label>
                <input id="city" type="text" value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="state" className="mb-1.5 block text-sm font-medium text-slate-700">State</label>
                <input id="state" type="text" value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="zip" className="mb-1.5 block text-sm font-medium text-slate-700">ZIP Code</label>
                <input id="zip" type="text" value={profile.zip}
                  onChange={(e) => setProfile({ ...profile, zip: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-slate-700">Country</label>
              <input id="country" type="text" value={profile.country} placeholder="United States"
                onChange={(e) => setProfile({ ...profile, country: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        {/* ─── Section 6: Skills ─── */}
        <div>
          <h2 className="mb-1 text-lg font-semibold text-slate-900">Skills</h2>
          <p className="mb-4 text-xs text-slate-400">
            Categorize your skills into two tiers. Strong skills are used for prominent resume placement; developing skills fill in when a JD specifically requires them.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-indigo-700">Strong Skills</label>
              <p className="mb-2 text-xs text-slate-400">Skills you can confidently discuss and defend in an interview.</p>
              <TagInput
                tags={profile.strongSkills}
                onAdd={(tag) => setProfile((p) => ({ ...p, strongSkills: [...p.strongSkills, tag] }))}
                onRemove={(tag) => setProfile((p) => ({ ...p, strongSkills: p.strongSkills.filter((s) => s !== tag) }))}
                placeholder="Add a skill..."
                colorScheme="indigo"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Developing Skills</label>
              <p className="mb-2 text-xs text-slate-400">Skills you have exposure to but aren&apos;t deep in yet.</p>
              <TagInput
                tags={profile.developingSkills}
                onAdd={(tag) => setProfile((p) => ({ ...p, developingSkills: [...p.developingSkills, tag] }))}
                onRemove={(tag) => setProfile((p) => ({ ...p, developingSkills: p.developingSkills.filter((s) => s !== tag) }))}
                placeholder="Add a skill..."
                colorScheme="slate"
              />
            </div>
          </div>
        </div>

        {/* ─── Section 7: Job Search Preferences ─── */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Job Search Preferences</h2>
          <div className="space-y-4">
            {/* Target Roles */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Target Roles
                {profile.tier === 'free' && (
                  <span className="ml-2 text-xs text-slate-400">(1 role on Free tier — <Link href="/pricing" className="text-indigo-600 hover:underline">upgrade for more</Link>)</span>
                )}
              </label>
              <TagInput
                tags={profile.targetRoles}
                onAdd={(tag) => setProfile((p) => ({ ...p, targetRoles: [...p.targetRoles, tag] }))}
                onRemove={(tag) => setProfile((p) => ({ ...p, targetRoles: p.targetRoles.filter((r) => r !== tag) }))}
                placeholder="e.g. Senior Product Manager"
                maxTags={profile.tier === 'free' ? 1 : undefined}
                colorScheme="blue"
              />
            </div>

            {/* Target Salary Range */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="salaryMin" className="mb-1.5 block text-sm font-medium text-slate-700">Target Salary Min</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                  <input id="salaryMin" type="number" min={0} step={1000} value={profile.salaryMin}
                    onChange={(e) => setProfile({ ...profile, salaryMin: e.target.value })}
                    placeholder="80,000" className={dollarInputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="salaryMax" className="mb-1.5 block text-sm font-medium text-slate-700">Target Salary Max</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                  <input id="salaryMax" type="number" min={0} step={1000} value={profile.salaryMax}
                    onChange={(e) => setProfile({ ...profile, salaryMax: e.target.value })}
                    placeholder="150,000" className={dollarInputClass} />
                </div>
              </div>
            </div>

            {/* LinkedIn URL */}
            <div>
              <label htmlFor="linkedinUrl" className="mb-1.5 block text-sm font-medium text-slate-700">LinkedIn URL</label>
              <input id="linkedinUrl" type="url" value={profile.linkedinUrl} placeholder="https://linkedin.com/in/yourname"
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })} className={inputClass} />
            </div>

            {/* Years of Experience */}
            <div>
              <label htmlFor="yearsExperienceRange" className="mb-1.5 block text-sm font-medium text-slate-700">Years of Experience</label>
              <select id="yearsExperienceRange" value={profile.yearsExperienceRange}
                onChange={(e) => setProfile({ ...profile, yearsExperienceRange: e.target.value })}
                className={inputClass}>
                <option value="">Select...</option>
                {yoeRanges.map((range) => (
                  <option key={range} value={range}>{range} years</option>
                ))}
              </select>
            </div>

            {/* Location Preferences */}
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-slate-700">
                Location Preferences <span className="text-slate-400">(select all that apply)</span>
              </legend>
              <div className="flex flex-wrap gap-3">
                {locationOptions.map((option) => {
                  const selected = profile.locationPreferences.includes(option);
                  return (
                    <label key={option}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                        selected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                      }`}>
                      <input type="checkbox" checked={selected} onChange={() => handleLocationToggle(option)} className="sr-only" />
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Security Clearance */}
            <div>
              <label htmlFor="securityClearance" className="mb-1.5 block text-sm font-medium text-slate-700">Security Clearance</label>
              <select id="securityClearance" value={profile.securityClearance}
                onChange={(e) => setProfile({ ...profile, securityClearance: e.target.value })}
                className={inputClass}>
                {clearanceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Industry Preferences */}
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-slate-700">
                Industry Preferences <span className="text-slate-400">(select all that apply)</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {industryOptions.map((industry) => {
                  const selected = profile.industries.includes(industry);
                  return (
                    <label key={industry}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        selected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}>
                      <input type="checkbox" checked={selected} onChange={() => handleIndustryToggle(industry)} className="sr-only" />
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
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
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

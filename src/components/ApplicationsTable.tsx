'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export interface Application {
  id: string;
  company: string;
  role: string;
  score: number;
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
  appliedDate: string;
}

interface ApplicationsTableProps {
  applications: Application[];
}

type SortField = 'company' | 'role' | 'score' | 'status' | 'appliedDate';
type SortDir = 'asc' | 'desc';

const statusConfig: Record<Application['status'], { label: string; classes: string }> = {
  saved: { label: 'Saved', classes: 'bg-slate-100 text-slate-700' },
  applied: { label: 'Applied', classes: 'bg-blue-100 text-blue-700' },
  interviewing: { label: 'Interviewing', classes: 'bg-indigo-100 text-indigo-700' },
  offered: { label: 'Offered', classes: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', classes: 'bg-red-100 text-red-700' },
  withdrawn: { label: 'Withdrawn', classes: 'bg-yellow-100 text-yellow-700' },
};

export default function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>('appliedDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    const copy = [...applications];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'score') {
        cmp = a.score - b.score;
      } else if (sortField === 'appliedDate') {
        cmp = new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
      } else {
        cmp = a[sortField].localeCompare(b[sortField]);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [applications, sortField, sortDir]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="ml-1 inline h-3 w-3 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
      );
    }
    return sortDir === 'asc' ? (
      <svg className="ml-1 inline h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    ) : (
      <svg className="ml-1 inline h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    );
  };

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        <svg className="mb-4 h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p className="text-sm font-medium text-slate-500">No applications yet</p>
        <p className="mt-1 text-xs text-slate-400">Start curating roles to track your applications here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {(
                [
                  ['company', 'Company'],
                  ['role', 'Role'],
                  ['score', 'Score'],
                  ['status', 'Status'],
                  ['appliedDate', 'Applied Date'],
                ] as [SortField, string][]
              ).map(([field, label]) => (
                <th
                  key={field}
                  onClick={() => toggleSort(field)}
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-700"
                >
                  {label}
                  <SortIcon field={field} />
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((app) => (
              <tr
                key={app.id}
                onClick={() => router.push(`/applications/${app.id}`)}
                className="cursor-pointer transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{app.company}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{app.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-sm font-semibold ${
                      app.score >= 7
                        ? 'text-green-600'
                        : app.score >= 5
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }`}
                  >
                    {app.score}/10
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusConfig[app.status].classes
                    }`}
                  >
                    {statusConfig[app.status].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {new Date(app.appliedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/applications/${app.id}`);
                    }}
                    className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-800"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

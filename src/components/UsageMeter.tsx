'use client';

interface UsageMeterProps {
  used: number;
  limit: number;
  tier: 'free' | 'active' | 'beast';
}

const tierConfig: Record<UsageMeterProps['tier'], { label: string; barColor: string; badgeClasses: string }> = {
  free: {
    label: 'Free',
    barColor: 'bg-slate-500',
    badgeClasses: 'bg-slate-100 text-slate-700',
  },
  active: {
    label: 'Active',
    barColor: 'bg-indigo-500',
    badgeClasses: 'bg-indigo-100 text-indigo-700',
  },
  beast: {
    label: 'Beast',
    barColor: 'bg-violet-500',
    badgeClasses: 'bg-violet-100 text-violet-700',
  },
};

export default function UsageMeter({ used, limit, tier }: UsageMeterProps) {
  const config = tierConfig[tier];
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isUnlimited = tier === 'beast';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-slate-900">Monthly Curations</h4>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${config.badgeClasses}`}>
            {config.label}
          </span>
        </div>
        <p className="text-sm text-slate-500">
          {isUnlimited ? (
            <><span className="font-semibold text-slate-900">{used}</span> used</>
          ) : (
            <>
              <span className="font-semibold text-slate-900">{used}</span> of{' '}
              <span className="font-semibold text-slate-900">{limit}</span> used
            </>
          )}
        </p>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${config.barColor}`}
          style={{ width: isUnlimited ? '15%' : `${percentage}%` }}
        />
      </div>
      {!isUnlimited && percentage >= 80 && (
        <p className="mt-2 text-xs text-amber-600">
          You are approaching your monthly limit.{' '}
          <a href="/pricing" className="font-medium underline hover:text-amber-700">
            Upgrade your plan
          </a>
        </p>
      )}
    </div>
  );
}

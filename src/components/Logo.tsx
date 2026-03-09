import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  linkTo?: string | false;
}

export default function Logo({ size = 'md', showText = true, linkTo = '/' }: LogoProps) {
  const sizes = {
    sm: { icon: 'h-7 w-7', text: 'text-xs', font: 'text-sm', steth: 14 },
    md: { icon: 'h-8 w-8', text: 'text-[10px]', font: 'text-lg', steth: 16 },
    lg: { icon: 'h-12 w-12', text: 'text-sm', font: 'text-2xl', steth: 20 },
  };

  const s = sizes[size];

  const content = (
    <div className="flex items-center gap-2">
      {/* Icon: rMD badge with stethoscope accent */}
      <div className="relative">
        <div className={`flex ${s.icon} items-center justify-center rounded-lg bg-indigo-600`}>
          <span className={`${s.text} font-bold leading-none text-white`}>rMD</span>
        </div>
        {/* Stethoscope accent — subtle curved line */}
        <svg
          className="absolute -right-1 -top-1 text-indigo-400"
          width={s.steth}
          height={s.steth}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M10 2c0 3-2 5-2 8a3 3 0 006 0" />
          <circle cx="14" cy="10" r="1.5" fill="currentColor" />
        </svg>
      </div>
      {showText && (
        <span className={`${s.font} font-bold text-slate-900`}>
          Resume <span className="text-indigo-600">MD</span>
        </span>
      )}
    </div>
  );

  if (linkTo === false) return content;

  return (
    <Link href={linkTo} className="flex items-center">
      {content}
    </Link>
  );
}

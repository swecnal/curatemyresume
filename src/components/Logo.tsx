import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  linkTo?: string | false;
  lightText?: boolean;
}

export default function Logo({ size = 'md', showText = true, linkTo = '/', lightText = false }: LogoProps) {
  const sizes = {
    sm: { svg: 28, font: 'text-sm' },
    md: { svg: 32, font: 'text-lg' },
    lg: { svg: 48, font: 'text-2xl' },
  };

  const s = sizes[size];

  const content = (
    <div className="flex items-center gap-2">
      {/* Resume with stethoscope icon */}
      <svg
        width={s.svg}
        height={s.svg}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Document body */}
        <rect x="10" y="6" width="22" height="30" rx="3" fill="#4f46e5" />
        {/* Document lines (resume content) */}
        <rect x="15" y="12" width="12" height="2" rx="1" fill="white" opacity="0.6" />
        <rect x="15" y="17" width="10" height="2" rx="1" fill="white" opacity="0.4" />
        <rect x="15" y="22" width="12" height="2" rx="1" fill="white" opacity="0.4" />
        <rect x="15" y="27" width="8" height="2" rx="1" fill="white" opacity="0.4" />
        {/* "rMD" text on document */}
        <text x="21" y="34" textAnchor="middle" fill="white" fontSize="5" fontWeight="700" fontFamily="system-ui, sans-serif" opacity="0.8">rMD</text>
        {/* Stethoscope earpieces at top of document */}
        <circle cx="14" cy="5" r="2" fill="#818cf8" />
        <circle cx="28" cy="5" r="2" fill="#818cf8" />
        {/* Tubing from earpieces to Y junction */}
        <path d="M14 7 C14 12, 21 14, 21 18" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M28 7 C28 12, 21 14, 21 18" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Tubing curving to diaphragm */}
        <path d="M21 18 C21 24, 21 28, 30 32 C36 34, 40 32, 40 28" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Diaphragm (chest piece) */}
        <circle cx="40" cy="26" r="5" fill="#818cf8" />
        <circle cx="40" cy="26" r="3" fill="#4f46e5" />
        <circle cx="40" cy="26" r="1.5" fill="#818cf8" opacity="0.6" />
      </svg>
      {showText && (
        <span className={`${s.font} font-bold ${lightText ? 'text-white' : 'text-slate-900'}`}>
          Resume <span className={lightText ? 'text-indigo-300' : 'text-indigo-600'}>MD</span>
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

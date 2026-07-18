export default function HeroVisual() {
  return (
    <div className="w-full max-w-[500px]" aria-label="Visual showing 3 employees sharing a commute to the workplace">
      <div className="relative rounded-2xl bg-white border border-neutral-200 shadow-xl p-8 lg:p-10">
        <svg viewBox="0 0 400 240" className="w-full h-auto" fill="none">
          {/* Main shared route line */}
          <path d="M 120 120 L 320 120" stroke="#1a5249" strokeWidth="6" strokeLinecap="round" />
          
          {/* Employee A joining */}
          <path d="M 40 40 C 80 40, 100 80, 120 120" stroke="#36a08d" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
          <circle cx="40" cy="40" r="12" fill="#c9ede5" stroke="#21685c" strokeWidth="2" />
          <text x="40" y="44" textAnchor="middle" fill="#143d38" fontSize="10" fontWeight="bold">A</text>

          {/* Employee B joining */}
          <path d="M 40 120 L 120 120" stroke="#36a08d" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
          <circle cx="40" cy="120" r="12" fill="#c9ede5" stroke="#21685c" strokeWidth="2" />
          <text x="40" y="124" textAnchor="middle" fill="#143d38" fontSize="10" fontWeight="bold">B</text>

          {/* Employee C joining */}
          <path d="M 40 200 C 80 200, 100 160, 120 120" stroke="#36a08d" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
          <circle cx="40" cy="200" r="12" fill="#c9ede5" stroke="#21685c" strokeWidth="2" />
          <text x="40" y="204" textAnchor="middle" fill="#143d38" fontSize="10" fontWeight="bold">C</text>

          {/* Merge Point */}
          <circle cx="120" cy="120" r="6" fill="#1a5249" />
          
          {/* Shared Ride Indicator */}
          <rect x="180" y="104" width="60" height="32" rx="16" fill="#4eeab5" />
          <text x="210" y="124" textAnchor="middle" fill="#0f2e2a" fontSize="12" fontWeight="bold">Shared</text>

          {/* Workplace Destination */}
          <rect x="320" y="90" width="50" height="60" rx="6" fill="#0f2e2a" />
          <text x="345" y="125" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">W</text>
          
          {/* Labels */}
          <text x="40" y="20" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="600">Employees</text>
          <text x="345" y="80" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="600">Workplace</text>
        </svg>
      </div>
    </div>
  );
}

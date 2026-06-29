export default function Spinner({ size = 20, className = '' }) {
  return (
    <svg
      className={`animate-spin text-current ${className}`}
      style={{ width: size, height: size }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}

export function FullPageLoader({ label = 'Loading…' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-bg text-ink2">
      <Spinner size={28} className="text-brand-red" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export default function StatCard({
  label,
  value,
  color = 'text-ink',
  sub,
}) {
  return (
    <div className="card group relative overflow-hidden p-5 transition-colors hover:border-line2/30">
      <div className="absolute left-0 top-5 h-8 w-[3px] rounded-r-full bg-brand-red/70" />

      <div className="pl-2">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink3">
          {label}
        </p>

        <div className="flex items-end justify-between gap-3">
          <p
            className={`font-display text-3xl font-semibold tracking-tight ${color}`}
          >
            {value}
          </p>

          {sub && (
            <p className="max-w-[55%] text-right text-xs leading-5 text-ink3">
              {sub}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
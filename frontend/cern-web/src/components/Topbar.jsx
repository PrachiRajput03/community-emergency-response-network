import { HeartPulse, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { initials } from '../utils/format'

export default function Topbar({ title }) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line/10 bg-bg/90 px-4 py-3 backdrop-blur-lg lg:hidden">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-ink2 transition-colors hover:bg-bg3 hover:text-ink"
        >
          <Menu size={19} strokeWidth={1.8} />
        </button>

        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-brand-red/25 bg-brand-red/10">
          <HeartPulse
            size={19}
            strokeWidth={2}
            className="text-brand-red"
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-ink3">
            CERN
          </p>

          <p className="truncate font-display text-sm font-semibold text-ink">
            {title || 'Emergency Response'}
          </p>
        </div>
      </div>

      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-line/10 bg-bg3 text-xs font-semibold text-ink">
        {initials(user?.name)}
      </div>
    </header>
  )
}
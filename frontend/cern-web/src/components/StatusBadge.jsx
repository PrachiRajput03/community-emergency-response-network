import { CheckCircle2, Clock3, Loader2 } from 'lucide-react'
import { STATUS_META } from '../utils/constants'

const ICONS = {
  OPEN: Clock3,
  IN_PROGRESS: Loader2,
  RESOLVED: CheckCircle2,
}

export default function StatusBadge({ status }) {
  const meta =
    STATUS_META[status] || {
      label: status,
      text: 'text-ink2',
      bg: 'bg-bg3',
    }

  const Icon = ICONS[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line/20 px-3 py-1 text-[11px] font-semibold tracking-wide ${meta.bg} ${meta.text}`}
    >
      {Icon && (
        <Icon
          size={12}
          strokeWidth={2}
          className={
            status === 'IN_PROGRESS'
              ? 'animate-spin'
              : ''
          }
        />
      )}

      {meta.label}
    </span>
  )
}
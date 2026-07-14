import { AlertTriangle } from 'lucide-react'
import { SEVERITY_META } from '../utils/constants'

export default function SeverityBadge({ severity }) {
  const meta =
    SEVERITY_META[severity] || {
      label: severity,
      text: 'text-ink2',
      bg: 'bg-bg3',
    }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-line/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${meta.bg} ${meta.text}`}
    >
      <AlertTriangle
        size={11}
        strokeWidth={2}
      />

      {meta.label}
    </span>
  )
}
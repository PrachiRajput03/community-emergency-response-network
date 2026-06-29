import { STATUS_META } from '../utils/constants'

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, dot: 'bg-ink3', text: 'text-ink2', bg: 'bg-bg4' }
  return (
    <span className={`badge ${meta.bg} ${meta.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}

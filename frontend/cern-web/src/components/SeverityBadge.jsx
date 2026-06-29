import { SEVERITY_META } from '../utils/constants'

export default function SeverityBadge({ severity }) {
  const meta = SEVERITY_META[severity] || { label: severity, text: 'text-ink2', bg: 'bg-bg4' }
  return (
    <span className={`badge ${meta.bg} ${meta.text} uppercase`}>
      {meta.label}
    </span>
  )
}

import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import SeverityBadge from './SeverityBadge'
import { formatTimeAgo } from '../utils/format'
import { EMERGENCY_TYPES } from '../utils/constants'

const typeMeta = (type) =>
  EMERGENCY_TYPES.find((t) => t.value === type) || { icon: '⚠️', label: type || 'Emergency' }

export default function EmergencyCard({ emergency, actions }) {
  const meta = typeMeta(emergency.type || emergency.title)

  return (
    <div className="card p-4 sm:p-5 hover:border-line2 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-bg3 flex items-center justify-center text-xl flex-shrink-0">
          {meta.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link
              to={`/emergencies/${emergency.id}`}
              className="font-semibold text-sm text-ink hover:text-brand-red transition-colors truncate"
            >
              {emergency.title || meta.label}
            </Link>
            <SeverityBadge severity={emergency.severity} />
          </div>

          <p className="text-xs text-ink3 mb-2 truncate">{emergency.location || emergency.address || 'No location provided'}</p>

          {emergency.description && (
            <p className="text-xs text-ink2 mb-3 line-clamp-2">{emergency.description}</p>
          )}

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <StatusBadge status={emergency.status} />
              <span className="text-[11px] text-ink3">{formatTimeAgo(emergency.createdAt || emergency.reportedAt)}</span>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

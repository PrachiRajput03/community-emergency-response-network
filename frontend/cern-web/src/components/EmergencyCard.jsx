import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Ambulance,
  ArrowUpRight,
  Clock3,
  Flame,
  MapPin,
  Shield,
  Siren,
  UsersRound,
} from 'lucide-react'

import StatusBadge from './StatusBadge'
import SeverityBadge from './SeverityBadge'
import { formatTimeAgo } from '../utils/format'

const TYPE_META = {
  MEDICAL: {
    label: 'Medical Emergency',
    icon: Ambulance,
    accent: 'text-brand-blue',
    surface: 'bg-brand-blue/10',
  },

  ROAD_ACCIDENT: {
    label: 'Road Accident',
    icon: Siren,
    accent: 'text-brand-amber',
    surface: 'bg-brand-amber/10',
  },

  ACCIDENT: {
    label: 'Road Accident',
    icon: Siren,
    accent: 'text-brand-amber',
    surface: 'bg-brand-amber/10',
  },

  FIRE: {
    label: 'Fire Emergency',
    icon: Flame,
    accent: 'text-brand-red',
    surface: 'bg-brand-red/10',
  },

  WOMEN_SAFETY: {
    label: 'Women Safety',
    icon: Shield,
    accent: 'text-brand-purple',
    surface: 'bg-brand-purple/10',
  },

  CRIME: {
    label: 'Police Emergency',
    icon: Shield,
    accent: 'text-brand-purple',
    surface: 'bg-brand-purple/10',
  },

  GENERAL_HELP: {
    label: 'Community Assistance',
    icon: UsersRound,
    accent: 'text-brand-green',
    surface: 'bg-brand-green/10',
  },

  NATURAL_DISASTER: {
    label: 'Disaster Response',
    icon: AlertTriangle,
    accent: 'text-brand-orange',
    surface: 'bg-brand-orange/10',
  },

  OTHER: {
    label: 'Emergency',
    icon: AlertTriangle,
    accent: 'text-ink2',
    surface: 'bg-bg3',
  },
}

const getEmergencyType = (emergency) =>
  emergency.category ||
  emergency.type ||
  emergency.title ||
  'OTHER'

export default function EmergencyCard({ emergency, actions }) {
  const emergencyType = getEmergencyType(emergency)
  const meta = TYPE_META[emergencyType] || TYPE_META.OTHER
  const TypeIcon = meta.icon

  return (
    <article className="card group overflow-hidden transition-colors hover:border-line2/30">
      <div className="flex">
        <div
          className={`w-1 flex-shrink-0 ${
            emergency.severity === 'CRITICAL'
              ? 'bg-brand-red'
              : emergency.severity === 'HIGH'
                ? 'bg-brand-amber'
                : emergency.severity === 'MEDIUM'
                  ? 'bg-brand-blue'
                  : 'bg-ink3'
          }`}
        />

        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${meta.surface}`}
            >
              <TypeIcon
                size={18}
                strokeWidth={2}
                className={meta.accent}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink3">
                    {meta.label}
                  </p>

                  <Link
                    to={`/emergencies/${emergency.id}`}
                    className="group/link inline-flex max-w-full items-center gap-1.5 font-display text-sm font-semibold text-ink transition-colors hover:text-brand-red2 sm:text-base"
                  >
                    <span className="truncate">
                      {emergency.title || meta.label}
                    </span>

                    <ArrowUpRight
                      size={13}
                      className="flex-shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100"
                    />
                  </Link>
                </div>

                <SeverityBadge severity={emergency.severity} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink3">
                <div className="flex min-w-0 items-center gap-1.5">
                  <MapPin
                    size={13}
                    strokeWidth={1.8}
                    className="flex-shrink-0"
                  />

                  <span className="truncate">
                    {emergency.location ||
                      emergency.address ||
                      'Location unavailable'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock3 size={13} strokeWidth={1.8} />

                  <span>
                    {formatTimeAgo(
                      emergency.createdAt ||
                        emergency.reportedAt
                    )}
                  </span>
                </div>
              </div>

              {emergency.description && (
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-ink2 sm:text-sm">
                  {emergency.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/10 pt-3">
                <StatusBadge status={emergency.status} />

                {actions && (
                  <div className="flex items-center gap-2">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
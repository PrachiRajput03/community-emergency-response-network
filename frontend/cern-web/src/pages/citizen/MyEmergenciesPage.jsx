import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  FileText,
  Plus,
} from 'lucide-react'

import DashboardLayout from '../../components/DashboardLayout'
import EmergencyCard from '../../components/EmergencyCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import * as emergencyService from '../../services/emergencyService'
import {
  EMERGENCY_STATUS,
  STATUS_META,
} from '../../utils/constants'

const FILTERS = [
  { key: 'ALL', label: 'All Reports' },
  {
    key: EMERGENCY_STATUS.OPEN,
    label: STATUS_META.OPEN.label,
  },
  {
    key: EMERGENCY_STATUS.IN_PROGRESS,
    label: STATUS_META.IN_PROGRESS.label,
  },
  {
    key: EMERGENCY_STATUS.RESOLVED,
    label: STATUS_META.RESOLVED.label,
  },
]

export default function MyEmergenciesPage() {
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    let mounted = true

    setLoading(true)
    setError('')

    emergencyService
      .getMyEmergencies()
      .then((data) => {
        if (!mounted) return

        setEmergencies(
          Array.isArray(data)
            ? data
            : data?.content || []
        )
      })
      .catch((err) => {
        if (!mounted) return

        setError(
          err.response?.data?.message ||
            'Failed to load emergencies.'
        )
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const filteredEmergencies = useMemo(() => {
    const sorted = [...emergencies].sort(
      (first, second) =>
        new Date(second.createdAt || 0) -
        new Date(first.createdAt || 0)
    )

    if (filter === 'ALL') {
      return sorted
    }

    return sorted.filter(
      (emergency) => emergency.status === filter
    )
  }, [emergencies, filter])

  return (
    <DashboardLayout title="My Emergencies">
      {/* Page header */}
      <section className="mb-7 flex flex-col gap-4 border-b border-line/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink3">
            Emergency history
          </p>

          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
            My Reports
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-ink2">
            Review every emergency you have reported and track its current
            response status.
          </p>
        </div>

        <Link
          to="/citizen/create"
          className="btn-primary inline-flex w-fit"
        >
          <Plus size={17} strokeWidth={2} />
          Report New Emergency
        </Link>
      </section>

      {/* Filters */}
      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-ink">
              Filter Reports
            </h3>

            <p className="mt-1 text-xs text-ink3">
              Showing {filteredEmergencies.length} of {emergencies.length}
            </p>
          </div>
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {FILTERS.map((filterOption) => (
            <button
              key={filterOption.key}
              type="button"
              onClick={() => setFilter(filterOption.key)}
              className={`flex-shrink-0 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
                filter === filterOption.key
                  ? 'border-brand-red/30 bg-brand-red/10 text-brand-red2'
                  : 'border-line/10 bg-card text-ink2 hover:border-line2/25 hover:bg-bg3 hover:text-ink'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner
            size={28}
            className="text-brand-red"
          />
        </div>
      ) : filteredEmergencies.length === 0 ? (
        <div className="card px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-bg3">
            <FileText
              size={22}
              strokeWidth={1.8}
              className="text-ink3"
            />
          </div>

          <h3 className="font-display text-base font-semibold text-ink">
            No reports found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink2">
            There are no emergency reports matching the selected status.
          </p>

          {filter !== 'ALL' ? (
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className="btn-secondary mt-6"
            >
              View All Reports
            </button>
          ) : (
            <Link
              to="/citizen/create"
              className="btn-primary mt-6 inline-flex"
            >
              <Plus size={17} strokeWidth={2} />
              Report Your First Emergency
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEmergencies.map((emergency) => (
            <EmergencyCard
              key={emergency.id}
              emergency={emergency}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
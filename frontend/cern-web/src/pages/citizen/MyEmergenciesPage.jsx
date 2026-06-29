import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import EmergencyCard from '../../components/EmergencyCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import * as emergencyService from '../../services/emergencyService'
import { EMERGENCY_STATUS, STATUS_META } from '../../utils/constants'

const FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: EMERGENCY_STATUS.OPEN, label: STATUS_META.OPEN.label },
  { key: EMERGENCY_STATUS.IN_PROGRESS, label: STATUS_META.IN_PROGRESS.label },
  { key: EMERGENCY_STATUS.RESOLVED, label: STATUS_META.RESOLVED.label },
]

export default function MyEmergenciesPage() {
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    emergencyService
      .getMyEmergencies()
      .then((data) => mounted && setEmergencies(Array.isArray(data) ? data : data?.content || []))
      .catch((err) => mounted && setError(err.response?.data?.message || 'Failed to load emergencies.'))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    const sorted = [...emergencies].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    if (filter === 'ALL') return sorted
    return sorted.filter((e) => e.status === filter)
  }, [emergencies, filter])

  return (
    <DashboardLayout title="My Emergencies">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-ink2 lg:hidden">All emergencies you've reported</p>
        <Link to="/citizen/create" className="btn-primary hidden sm:inline-flex ml-auto">
          <span>🆘</span> Report New
        </Link>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 -mx-1 px-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === f.key
                ? 'bg-brand-red border-brand-red text-white'
                : 'bg-card border-line text-ink2 hover:border-line2'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <div className="mb-5"><ErrorAlert message={error} /></div>}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={28} className="text-brand-red" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <span className="text-3xl block mb-3">📭</span>
          <p className="text-sm text-ink2">No emergencies found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => (
            <EmergencyCard key={e.id} emergency={e} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

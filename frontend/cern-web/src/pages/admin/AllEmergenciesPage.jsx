import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import EmergencyCard from '../../components/EmergencyCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import * as emergencyService from '../../services/emergencyService'
import { EMERGENCY_STATUS, SEVERITY, STATUS_META, SEVERITY_META } from '../../utils/constants'

const STATUS_FILTERS = [
  { key: 'ALL', label: 'All Status' },
  { key: EMERGENCY_STATUS.OPEN, label: STATUS_META.OPEN.label },
  { key: EMERGENCY_STATUS.IN_PROGRESS, label: STATUS_META.IN_PROGRESS.label },
  { key: EMERGENCY_STATUS.RESOLVED, label: STATUS_META.RESOLVED.label },
]

const SEVERITY_FILTERS = [
  { key: 'ALL', label: 'All Severity' },
  { key: SEVERITY.CRITICAL, label: SEVERITY_META.CRITICAL.label },
  { key: SEVERITY.HIGH, label: SEVERITY_META.HIGH.label },
  { key: SEVERITY.MEDIUM, label: SEVERITY_META.MEDIUM.label },
  { key: SEVERITY.LOW, label: SEVERITY_META.LOW.label },
]

export default function AllEmergenciesPage() {
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [severityFilter, setSeverityFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    emergencyService
      .getAllEmergencies()
      .then((data) => mounted && setEmergencies(Array.isArray(data) ? data : data?.content || []))
      .catch((err) => mounted && setError(err.response?.data?.message || 'Failed to load emergencies.'))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    let result = [...emergencies].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    if (statusFilter !== 'ALL') result = result.filter((e) => e.status === statusFilter)
    if (severityFilter !== 'ALL') result = result.filter((e) => e.severity === severityFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          e.address?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.type?.toLowerCase().includes(q)
      )
    }
    return result
  }, [emergencies, statusFilter, severityFilter, search])

  return (
    <DashboardLayout title="All Emergencies">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by address, type, or description..."
          className="input-field"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === f.key
                  ? 'bg-brand-red border-brand-red text-white'
                  : 'bg-card border-line text-ink2 hover:border-line2'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {SEVERITY_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setSeverityFilter(f.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                severityFilter === f.key
                  ? 'bg-bg4 border-line2 text-ink'
                  : 'bg-card border-line text-ink2 hover:border-line2'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink3 mb-4">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>

      {error && <div className="mb-5"><ErrorAlert message={error} /></div>}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={28} className="text-brand-red" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <span className="text-3xl block mb-3">🔍</span>
          <p className="text-sm text-ink2">No emergencies match your filters.</p>
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

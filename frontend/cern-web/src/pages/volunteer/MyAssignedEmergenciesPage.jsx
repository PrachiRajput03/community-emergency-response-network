import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import EmergencyCard from '../../components/EmergencyCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import * as emergencyService from '../../services/emergencyService'
import { EMERGENCY_STATUS, STATUS_META } from '../../utils/constants'

const FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: EMERGENCY_STATUS.IN_PROGRESS, label: STATUS_META.IN_PROGRESS.label },
  { key: EMERGENCY_STATUS.RESOLVED, label: STATUS_META.RESOLVED.label },
]

export default function MyAssignedEmergenciesPage() {
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [resolvingId, setResolvingId] = useState(null)

  const loadData = () => {
    setLoading(true)
    emergencyService
      .getMyAssignedEmergencies()
      .then((data) => setEmergencies(Array.isArray(data) ? data : data?.content || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load assigned emergencies.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const handleResolve = async (id) => {
    setResolvingId(id)
    try {
      await emergencyService.resolveEmergency(id)
      loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve emergency.')
    } finally {
      setResolvingId(null)
    }
  }

  const filtered = useMemo(() => {
    const sorted = [...emergencies].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    if (filter === 'ALL') return sorted
    return sorted.filter((e) => e.status === filter)
  }, [emergencies, filter])

  return (
    <DashboardLayout title="My Assigned Emergencies">
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
          <p className="text-sm text-ink2">No assigned emergencies found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => (
            <EmergencyCard
              key={e.id}
              emergency={e}
              actions={
                e.status === EMERGENCY_STATUS.IN_PROGRESS ? (
                  <button
                    onClick={() => handleResolve(e.id)}
                    disabled={resolvingId === e.id}
                    className="px-3 py-1.5 rounded-lg bg-brand-blue text-white text-xs font-semibold hover:bg-[#2d6fe0] transition-colors disabled:opacity-50"
                  >
                    {resolvingId === e.id ? <Spinner size={12} /> : '✓ Mark Resolved'}
                  </button>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import EmergencyCard from '../../components/EmergencyCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import { useAuth } from '../../context/AuthContext'
import * as emergencyService from '../../services/emergencyService'
import { EMERGENCY_STATUS } from '../../utils/constants'

export default function CitizenDashboard() {
  const { user } = useAuth()
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    emergencyService
      .getMyEmergencies()
      .then((data) => {
        if (mounted) setEmergencies(Array.isArray(data) ? data : data?.content || [])
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Failed to load your emergencies.')
      })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  const open = emergencies.filter((e) => e.status === EMERGENCY_STATUS.OPEN)
  const inProgress = emergencies.filter((e) => e.status === EMERGENCY_STATUS.IN_PROGRESS)
  const resolved = emergencies.filter((e) => e.status === EMERGENCY_STATUS.RESOLVED)
  const recent = [...emergencies]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5)

  return (
    <DashboardLayout title="Dashboard">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-ink2">Welcome back,</p>
          <p className="font-display text-xl font-bold text-ink">{user?.name || 'Citizen'}</p>
        </div>
        <Link to="/citizen/create" className="btn-primary hidden sm:inline-flex">
          <span>🆘</span> Report Emergency
        </Link>
      </div>

      {/* SOS quick action — mobile */}
      <Link
        to="/citizen/create"
        className="sm:hidden flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-brand-red text-white font-bold shadow-glow mb-6"
      >
        🆘 Report Emergency
      </Link>

      {error && <div className="mb-6"><ErrorAlert message={error} /></div>}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="🚨" label="Open" value={loading ? '—' : open.length} color="text-brand-amber" />
        <StatCard icon="⏳" label="In Progress" value={loading ? '—' : inProgress.length} color="text-brand-blue" />
        <StatCard icon="✅" label="Resolved" value={loading ? '—' : resolved.length} color="text-brand-green" />
      </div>

      {/* Recent emergencies */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-ink">Recent Reports</h2>
        <Link to="/citizen/my-emergencies" className="text-xs font-medium text-brand-red2 hover:underline">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={28} className="text-brand-red" /></div>
      ) : recent.length === 0 ? (
        <div className="card p-10 text-center">
          <span className="text-3xl block mb-3">📭</span>
          <p className="text-sm text-ink2 mb-4">You haven't reported any emergencies yet.</p>
          <Link to="/citizen/create" className="btn-primary inline-flex">Report Your First Emergency</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map((e) => (
            <EmergencyCard key={e.id} emergency={e} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

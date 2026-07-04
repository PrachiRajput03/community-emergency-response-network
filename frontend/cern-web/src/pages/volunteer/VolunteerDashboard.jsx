import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import EmergencyCard from '../../components/EmergencyCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import { useAuth } from '../../context/AuthContext'
import * as emergencyService from '../../services/emergencyService'
import {
  connectEmergencySocket,
  disconnectEmergencySocket,
} from '../../services/websocketService'
import { EMERGENCY_STATUS } from '../../utils/constants'

export default function VolunteerDashboard() {
  const { user } = useAuth()
  const [openEmergencies, setOpenEmergencies] = useState([])
  const [assigned, setAssigned] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [acceptingId, setAcceptingId] = useState(null)
  const [notification, setNotification] = useState('')

  const loadData = () => {
    setLoading(true)
    setError('')

    Promise.all([
      emergencyService.getEmergenciesByStatus(EMERGENCY_STATUS.OPEN),
      emergencyService.getMyAssignedEmergencies(),
    ])
      .then(([openData, assignedData]) => {
        setOpenEmergencies(Array.isArray(openData) ? openData : openData?.content || [])
        setAssigned(Array.isArray(assignedData) ? assignedData : assignedData?.content || [])
      })
      .catch((err) =>
        setError(err.response?.data?.message || 'Failed to load emergency data.')
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()

    connectEmergencySocket((newEmergency) => {
      setNotification(
        `🚨 New Emergency Reported: ${newEmergency.title || 'Emergency'}`
      )

      setOpenEmergencies((prev) => {
        const alreadyExists = prev.some((e) => e.id === newEmergency.id)
        if (alreadyExists) return prev
        return [newEmergency, ...prev]
      })
    })

    return () => {
      disconnectEmergencySocket()
    }
  }, [])

  const handleAccept = async (id) => {
    setAcceptingId(id)

    try {
      await emergencyService.acceptEmergency(id)
      loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept emergency.')
    } finally {
      setAcceptingId(null)
    }
  }

  const activeAssigned = assigned.filter(
    (e) => e.status === EMERGENCY_STATUS.IN_PROGRESS
  )

  const resolvedCount = assigned.filter(
    (e) => e.status === EMERGENCY_STATUS.RESOLVED
  ).length

  return (
    <DashboardLayout title="Dashboard">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-ink2">Welcome back,</p>
          <p className="font-display text-xl font-bold text-ink">
            {user?.name || 'Volunteer'}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-green/15 border border-brand-green/30 text-brand-green text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          ONLINE
        </div>
      </div>

      {notification && (
        <div className="mb-6 rounded-xl border border-brand-red/40 bg-brand-red/10 px-4 py-3 text-sm text-brand-red2 flex items-center justify-between">
          <span>{notification}</span>
          <button
            onClick={() => setNotification('')}
            className="text-xs text-ink3 hover:text-ink"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon="🚨"
          label="Open Requests"
          value={loading ? '—' : openEmergencies.length}
          color="text-brand-amber"
        />
        <StatCard
          icon="🦺"
          label="Active Missions"
          value={loading ? '—' : activeAssigned.length}
          color="text-brand-blue"
        />
        <StatCard
          icon="✅"
          label="Resolved"
          value={loading ? '—' : resolvedCount}
          color="text-brand-green"
        />
      </div>

      {activeAssigned.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Your Active Missions</h2>
            <Link
              to="/volunteer/assigned"
              className="text-xs font-medium text-brand-red2 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {activeAssigned.map((e) => (
              <EmergencyCard key={e.id} emergency={e} />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-ink">Incoming Requests</h2>
        <span className="text-xs text-ink3">
          {openEmergencies.length} nearby
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} className="text-brand-red" />
        </div>
      ) : openEmergencies.length === 0 ? (
        <div className="card p-10 text-center">
          <span className="text-3xl block mb-3">🎉</span>
          <p className="text-sm text-ink2">
            No open emergencies right now. Stand by.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {openEmergencies.map((e) => (
            <EmergencyCard
              key={e.id}
              emergency={e}
              actions={
                <button
                  onClick={() => handleAccept(e.id)}
                  disabled={acceptingId === e.id}
                  className="px-3 py-1.5 rounded-lg bg-brand-green text-black text-xs font-semibold hover:bg-[#1dd05f] transition-colors disabled:opacity-50"
                >
                  {acceptingId === e.id ? <Spinner size={12} /> : '✓ Accept'}
                </button>
              }
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
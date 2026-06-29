import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import StatusBadge from '../components/StatusBadge'
import SeverityBadge from '../components/SeverityBadge'
import ErrorAlert from '../components/ErrorAlert'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import * as emergencyService from '../services/emergencyService'
import { EMERGENCY_TYPES, EMERGENCY_STATUS, ROLES } from '../utils/constants'
import { formatDateTime, formatTimeAgo } from '../utils/format'

const typeMeta = (type) =>
  EMERGENCY_TYPES.find((t) => t.value === type) || { icon: '⚠️', label: type || 'Emergency' }

export default function EmergencyDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()

  const [emergency, setEmergency] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const loadEmergency = () => {
    setLoading(true)
    emergencyService
      .getEmergencyById(id)
      .then(setEmergency)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load emergency details.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadEmergency() }, [id])

  const handleAccept = async () => {
    setActionLoading(true)
    try {
      await emergencyService.acceptEmergency(id)
      loadEmergency()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept emergency.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleResolve = async () => {
    setActionLoading(true)
    try {
      await emergencyService.resolveEmergency(id)
      loadEmergency()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve emergency.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Emergency Details">
        <div className="flex justify-center py-20"><Spinner size={28} className="text-brand-red" /></div>
      </DashboardLayout>
    )
  }

  if (error && !emergency) {
    return (
      <DashboardLayout title="Emergency Details">
        <ErrorAlert message={error} />
        <button onClick={() => navigate(-1)} className="btn-secondary mt-4">← Go Back</button>
      </DashboardLayout>
    )
  }

  if (!emergency) return null

  const meta = typeMeta(emergency.type || emergency.title)

  return (
    <DashboardLayout title="Emergency Details">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 px-0">← Back</button>

      {error && <div className="mb-5"><ErrorAlert message={error} onClose={() => setError('')} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-bg3 flex items-center justify-center text-3xl flex-shrink-0">
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-xl text-ink mb-1">
  {emergency.title || meta.label}
</h2>
                <p className="text-xs text-ink3">Emergency ID #{emergency.id}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <StatusBadge status={emergency.status} />
              <SeverityBadge severity={emergency.severity} />
              <span className="text-xs text-ink3">Reported {formatTimeAgo(emergency.createdAt)}</span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="label-text">Description</p>
                <p className="text-sm text-ink2 leading-relaxed">
                  {emergency.description || 'No description provided.'}
                </p>
              </div>

              <div>
                  <p className="label-text">Location</p>
                  <p className="text-sm text-ink2">
                    {emergency.location || emergency.address || 'No location provided.'}
                  </p>
              </div>

              {(emergency.latitude && emergency.longitude) && (
                <div>
                  <p className="label-text">Coordinates</p>
                  <p className="text-sm text-ink2 font-display">
                    {emergency.latitude}, {emergency.longitude}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Role-based actions */}
          {role === ROLES.VOLUNTEER && (
            <div className="card p-6">
              <h3 className="font-semibold text-sm text-ink mb-4">Volunteer Actions</h3>
              <div className="flex flex-wrap gap-3">
                {emergency.status === EMERGENCY_STATUS.OPEN && (
                  <button onClick={handleAccept} disabled={actionLoading} className="btn-primary">
                    {actionLoading ? <Spinner size={16} /> : '✓ Accept Emergency'}
                  </button>
                )}
                {emergency.status === EMERGENCY_STATUS.IN_PROGRESS && (
                  <button
                    onClick={handleResolve}
                    disabled={actionLoading}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-green text-black font-semibold text-sm hover:bg-[#1dd05f] transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {actionLoading ? <Spinner size={16} /> : '✓ Mark as Resolved'}
                  </button>
                )}
                {emergency.status === EMERGENCY_STATUS.RESOLVED && (
                  <p className="text-sm text-brand-green">✓ This emergency has been resolved.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-amber mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-ink">Reported</p>
                  <p className="text-[11px] text-ink3">{formatDateTime(emergency.createdAt)}</p>
                </div>
              </div>
              {emergency.acceptedAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-ink">Accepted by volunteer</p>
                    <p className="text-[11px] text-ink3">{formatDateTime(emergency.acceptedAt)}</p>
                  </div>
                </div>
              )}
              {emergency.resolvedAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-green mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-ink">Resolved</p>
                    <p className="text-[11px] text-ink3">{formatDateTime(emergency.resolvedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(emergency.reportedBy || emergency.citizen) && (
            <div className="card p-5">
              <h3 className="font-semibold text-sm text-ink mb-3">Reported By</h3>
              <p className="text-sm text-ink2">
                {emergency.reportedBy?.name || emergency.citizen?.name || 'Citizen'}
              </p>
              {(emergency.reportedBy?.phone || emergency.citizen?.phone) && (
                <p className="text-xs text-ink3 mt-1">
                  {emergency.reportedBy?.phone || emergency.citizen?.phone}
                </p>
              )}
            </div>
          )}

          {(emergency.assignedVolunteer || emergency.volunteer) && (
            <div className="card p-5">
              <h3 className="font-semibold text-sm text-ink mb-3">Assigned Volunteer</h3>
              <p className="text-sm text-ink2">
                {emergency.assignedVolunteer?.name || emergency.volunteer?.name}
              </p>
              {(emergency.assignedVolunteer?.phone || emergency.volunteer?.phone) && (
                <p className="text-xs text-ink3 mt-1">
                  {emergency.assignedVolunteer?.phone || emergency.volunteer?.phone}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

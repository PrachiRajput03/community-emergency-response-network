import {
  connectEmergencySocket,
  disconnectEmergencySocket,
} from '../../services/websocketService'
import {
  exportEmergenciesToCSV,
  exportEmergenciesToPDF,
} from '../../utils/exportEmergencyReports'
import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import EmergencyCard from '../../components/EmergencyCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import StatCard from '../../components/StatCard'
import * as emergencyService from '../../services/emergencyService'
import { EMERGENCY_STATUS } from '../../utils/constants'
import EmergencyMap from '../../components/EmergencyMap'

const CONFIG = {
  medical: {
    title: 'Medical Responder Dashboard',
    icon: '🚑',
    label: 'Medical Cases',
    fetcher: emergencyService.getMedicalEmergencies,
  },
  fire: {
    title: 'Fire Responder Dashboard',
    icon: '🚒',
    label: 'Fire Incidents',
    fetcher: emergencyService.getFireEmergencies,
  },
  police: {
    title: 'Police Responder Dashboard',
    icon: '👮',
    label: 'Police Cases',
    fetcher: emergencyService.getPoliceEmergencies,
  },
}

export default function ResponderDashboard({ type }) {
  const config = CONFIG[type]
  const reportTitle = `${config?.title || 'Responder'} Emergency Report`
  const [emergencies, setEmergencies] = useState([])
  const [activeMissions, setActiveMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [acceptingId, setAcceptingId] = useState(null)

  const loadData = () => {
  setLoading(true)
  setError('')

  Promise.all([
    config.fetcher(),
    emergencyService.getMyActiveMissions(),
  ])
    .then(([emergencyData, activeData]) => {
      setEmergencies(Array.isArray(emergencyData) ? emergencyData : emergencyData?.content || [])
      setActiveMissions(Array.isArray(activeData) ? activeData : activeData?.content || [])
    })
    .catch((err) => {
      setError(err.response?.data?.message || 'Failed to load responder emergencies.')
    })
    .finally(() => setLoading(false))
}

  useEffect(() => {
    loadData()
  }, [type])

  useEffect(() => {
  connectEmergencySocket(type, () => {
    loadData()
  })

  return () => {
    disconnectEmergencySocket()
  }
}, [type])

  const openEmergencies = useMemo(
    () => emergencies.filter((e) => e.status === EMERGENCY_STATUS.OPEN),
    [emergencies]
  )

  const activeEmergencies = activeMissions

  const resolvedEmergencies = useMemo(
    () => emergencies.filter((e) => e.status === EMERGENCY_STATUS.RESOLVED),
    [emergencies]
  )

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

  if (!config) {
    return (
      <DashboardLayout title="Responder Dashboard">
        <ErrorAlert message="Invalid responder dashboard type." />
      </DashboardLayout>
    )
  }
  

  return (
    <DashboardLayout title={config.title}>
      
      <div className="flex items-center justify-between gap-4 mb-6">

  <div className="flex items-center gap-3">
    <div className="w-12 h-12 rounded-xl bg-bg3 flex items-center justify-center text-2xl">
      {config.icon}
    </div>

    <div>
      <h2 className="font-display text-xl font-bold text-ink">
        {config.title}
      </h2>

      <p className="text-sm text-ink2">
        View and respond to {config.label.toLowerCase()}.
      </p>
    </div>
  </div>

  <div className="flex gap-2">

    <button
      onClick={() =>
        exportEmergenciesToCSV(
          emergencies,
          `${config.title} Report`
        )
      }
      disabled={emergencies.length === 0}
      className="px-3 py-2 rounded-lg bg-brand-green text-black text-xs font-semibold hover:opacity-90 disabled:opacity-40"
    >
      📥 CSV
    </button>

    <button
      onClick={() =>
        exportEmergenciesToPDF(
          emergencies,
          `${config.title} Report`
        )
      }
      disabled={emergencies.length === 0}
      className="px-3 py-2 rounded-lg bg-brand-red text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40"
    >
      📄 PDF
    </button>

  </div>

</div>
      

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}
      

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon="🚨"
          label="Open"
          value={loading ? '—' : openEmergencies.length}
          color="text-brand-amber"
        />
        <StatCard
          icon="⏳"
          label="In Progress"
          value={loading ? '—' : activeEmergencies.length}
          color="text-brand-blue"
        />
        <StatCard
          icon="✅"
          label="Resolved"
          value={loading ? '—' : resolvedEmergencies.length}
          color="text-brand-green"
        />
      </div>

      <div className="mb-8">
      <h3 className="font-semibold text-ink mb-4">Live Emergency Map</h3>
      <EmergencyMap emergencies={[...openEmergencies, ...activeEmergencies]} />
      </div>

      <h3 className="font-semibold text-ink mb-4">Incoming Requests</h3>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} className="text-brand-red" />
        </div>
      ) : openEmergencies.length === 0 ? (
        <div className="card p-10 text-center">
          <span className="text-3xl block mb-3">🎉</span>
          <p className="text-sm text-ink2">
            No open requests right now.
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

      {activeEmergencies.length > 0 && (
  <div className="mt-8">
    <h3 className="font-semibold text-ink mb-4">Active Missions</h3>

    <div className="space-y-3">
      {activeEmergencies.map((e) => (
        <EmergencyCard
          key={e.id}
          emergency={e}
          actions={
            <button
              onClick={() => emergencyService.resolveEmergency(e.id).then(loadData)}
              className="px-3 py-1.5 rounded-lg bg-brand-green text-black text-xs font-semibold hover:bg-[#1dd05f] transition-colors"
            >
              ✓ Resolve
            </button>
          }
        />
      ))}
    </div>
  </div>
)}
    </DashboardLayout>
  )
}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import * as emergencyService from '../../services/emergencyService'
import { EMERGENCY_TYPES, SEVERITY } from '../../utils/constants'

const SEVERITY_OPTIONS = [
  { value: SEVERITY.LOW, label: 'Low', color: 'border-ink3 text-ink2' },
  { value: SEVERITY.MEDIUM, label: 'Medium', color: 'border-brand-blue text-brand-blue' },
  { value: SEVERITY.HIGH, label: 'High', color: 'border-brand-amber text-brand-amber' },
  { value: SEVERITY.CRITICAL, label: 'Critical', color: 'border-brand-red text-brand-red2' },
]

export default function CreateEmergencyPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    type: '',
    severity: SEVERITY.MEDIUM,
    description: '',
    address: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [locating, setLocating] = useState(false)
  const [coords, setCoords] = useState(null)

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const selectType = (type) =>
    setForm((f) => ({ ...f, type }))

  const selectSeverity = (severity) =>
    setForm((f) => ({ ...f, severity }))

  const useMyLocation = () => {
    if (!navigator.geolocation) return

    setLocating(true)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.type) {
      setError('Please select an emergency type.')
      return
    }

    setLoading(true)

    try {
      await emergencyService.createEmergency({
        ...form,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      })

      navigate('/citizen/my-emergencies', { replace: true })
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to report emergency. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Report Emergency">
      <div className="max-w-2xl mx-auto">
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-red/15 flex items-center justify-center text-2xl flex-shrink-0">
              🆘
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-ink">
                What's the emergency?
              </h2>
              <p className="text-xs text-ink2">
                Fill in the details below — help is on the way fast.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <ErrorAlert
                message={error}
                onClose={() => setError('')}
              />
            )}

            <div>
              <label className="label-text">Emergency Type</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
                {EMERGENCY_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => selectType(t.value)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border-2 transition-all ${
                      form.type === t.value
                        ? 'border-brand-red bg-card2'
                        : 'border-line bg-bg3 hover:border-line2'
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-[10px] font-medium text-ink2 text-center leading-tight">
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label-text">Severity Level</label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {SEVERITY_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => selectSeverity(s.value)}
                    className={`px-2 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                      s.color
                    } ${
                      form.severity === s.value
                        ? 'bg-card2'
                        : 'bg-bg3 border-line hover:border-line2'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label-text">Description</label>
              <textarea
                required
                rows={4}
                className="input-field resize-none"
                placeholder="Describe what's happening — be as specific as possible..."
                value={form.description}
                onChange={update('description')}
              />
            </div>

            <div>
              <label className="label-text">Address / Location</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Connaught Place Inner Circle, New Delhi"
                value={form.address}
                onChange={update('address')}
              />

              <button
                type="button"
                onClick={useMyLocation}
                disabled={locating}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-brand-blue hover:underline disabled:opacity-50"
              >
                {locating ? <Spinner size={12} /> : '📍'}
                {coords ? 'Location captured' : 'Use my current location'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12"
            >
              {loading ? <Spinner size={18} /> : 'Send Emergency Alert'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
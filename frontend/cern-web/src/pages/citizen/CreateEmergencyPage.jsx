import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Ambulance,
  CarFront,
  CloudLightning,
  Flame,
  HandHelping,
  HeartPulse,
  MapPin,
  ShieldAlert,
  Siren,
} from 'lucide-react'

import DashboardLayout from '../../components/DashboardLayout'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import * as emergencyService from '../../services/emergencyService'
import { SEVERITY } from '../../utils/constants'

const SEVERITY_OPTIONS = [
  {
    value: SEVERITY.LOW,
    label: 'Low',
    color: 'border-ink3 text-ink2',
  },
  {
    value: SEVERITY.MEDIUM,
    label: 'Medium',
    color: 'border-brand-blue text-brand-blue',
  },
  {
    value: SEVERITY.HIGH,
    label: 'High',
    color: 'border-brand-amber text-brand-amber',
  },
  {
    value: SEVERITY.CRITICAL,
    label: 'Critical',
    color: 'border-brand-red text-brand-red2',
  },
]

const EMERGENCY_TYPE_META = {
  MEDICAL: {
    label: 'Medical Emergency',
    icon: Ambulance,
    color: 'text-brand-blue',
    surface: 'bg-brand-blue/10',
  },

  ACCIDENT: {
    label: 'Accident',
    icon: CarFront,
    color: 'text-brand-amber',
    surface: 'bg-brand-amber/10',
  },

  FIRE: {
    label: 'Fire',
    icon: Flame,
    color: 'text-brand-red',
    surface: 'bg-brand-red/10',
  },

  WOMEN_SAFETY: {
    label: 'Women Safety',
    icon: ShieldAlert,
    color: 'text-brand-purple',
    surface: 'bg-brand-purple/10',
  },

  BLOOD: {
    label: 'Blood Requirement',
    icon: HeartPulse,
    color: 'text-brand-red2',
    surface: 'bg-brand-red/10',
  },

  OTHER: {
    label: 'Other',
    icon: AlertTriangle,
    color: 'text-ink2',
    surface: 'bg-bg3',
  },
}

const CATEGORY_OPTIONS = [
  {
    value: 'MEDICAL',
    label: 'Medical',
    icon: Ambulance,
    color: 'text-brand-blue',
    surface: 'bg-brand-blue/10',
  },

  {
    value: 'ROAD_ACCIDENT',
    label: 'Road Accident',
    icon: CarFront,
    color: 'text-brand-amber',
    surface: 'bg-brand-amber/10',
  },

  {
    value: 'FIRE',
    label: 'Fire',
    icon: Flame,
    color: 'text-brand-red',
    surface: 'bg-brand-red/10',
  },

  {
    value: 'WOMEN_SAFETY',
    label: 'Women Safety',
    icon: ShieldAlert,
    color: 'text-brand-purple',
    surface: 'bg-brand-purple/10',
  },

  {
    value: 'CRIME',
    label: 'Crime',
    icon: Siren,
    color: 'text-brand-red2',
    surface: 'bg-brand-red/10',
  },

  {
    value: 'GENERAL_HELP',
    label: 'General Help',
    icon: HandHelping,
    color: 'text-brand-green',
    surface: 'bg-brand-green/10',
  },

  {
    value: 'NATURAL_DISASTER',
    label: 'Natural Disaster',
    icon: CloudLightning,
    color: 'text-brand-orange',
    surface: 'bg-brand-orange/10',
  },
]

export default function CreateEmergencyPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    type: '',
    category: '',
    severity: SEVERITY.MEDIUM,
    title: '',
    description: '',
    location: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [locating, setLocating] = useState(false)
  const [coords, setCoords] = useState(null)

  const update = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]: event.target.value,
    }))
  }

  const selectType = (type) => {
    setForm((current) => ({
      ...current,
      type,
    }))
  }

  const selectSeverity = (severity) => {
    setForm((current) => ({
      ...current,
      severity,
    }))
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setLocating(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })

        setLocating(false)
      },
      () => {
        setError(
          'Unable to access your location. Please enter the location manually.'
        )
        setLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
      }
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.type) {
      setError('Please select an emergency type.')
      return
    }

    if (!form.category) {
      setError('Please select an emergency category.')
      return
    }

    if (!form.title.trim()) {
      setError('Please enter an emergency title.')
      return
    }

    if (!form.location.trim()) {
      setError('Please enter the emergency location.')
      return
    }

    setLoading(true)

    try {
      await emergencyService.createEmergency({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      })

      navigate('/citizen/my-emergencies', {
        replace: true,
      })
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
      <div className="mx-auto max-w-2xl">
        <div className="card p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-brand-red/25 bg-brand-red/10">
              <Siren
                size={21}
                strokeWidth={2}
                className="text-brand-red"
              />
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                What is the emergency?
              </h2>

              <p className="text-xs text-ink2">
                Provide accurate details so the correct response unit can act.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {error && (
              <ErrorAlert
                message={error}
                onClose={() => setError('')}
              />
            )}

            {/* Emergency type */}
            <div>
              <label className="label-text">
                Emergency Type
              </label>

              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Object.entries(EMERGENCY_TYPE_META).map(
                  ([value, meta]) => {
                    const Icon = meta.icon
                    const selected = form.type === value

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => selectType(value)}
                        className={`flex flex-col items-center gap-2 rounded-lg border px-2 py-3 transition-all ${
                          selected
                            ? 'border-brand-red bg-brand-red/10 ring-2 ring-brand-red/15'
                            : 'border-line/10 bg-bg3 hover:border-line2/25 hover:bg-bg4'
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.surface}`}
                        >
                          <Icon
                            size={20}
                            strokeWidth={2}
                            className={meta.color}
                          />
                        </div>

                        <span
                          className={`text-center text-[11px] font-medium leading-tight ${
                            selected
                              ? 'text-ink'
                              : 'text-ink2'
                          }`}
                        >
                          {meta.label}
                        </span>
                      </button>
                    )
                  }
                )}
              </div>
            </div>

            {/* Emergency category */}
            <div>
              <label className="label-text">
                Emergency Category
              </label>

              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {CATEGORY_OPTIONS.map((category) => {
                  const Icon = category.icon
                  const selected =
                    form.category === category.value

                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          category: category.value,
                        }))
                      }
                      className={`flex flex-col items-center gap-2 rounded-lg border px-3 py-3.5 transition-all ${
                        selected
                          ? 'border-brand-red bg-brand-red/10 ring-2 ring-brand-red/15'
                          : 'border-line/10 bg-bg3 hover:border-line2/25 hover:bg-bg4'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${category.surface}`}
                      >
                        <Icon
                          size={20}
                          strokeWidth={2}
                          className={category.color}
                        />
                      </div>

                      <span
                        className={`text-center text-[11px] font-medium leading-tight ${
                          selected
                            ? 'text-ink'
                            : 'text-ink2'
                        }`}
                      >
                        {category.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="label-text">
                Severity Level
              </label>

              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SEVERITY_OPTIONS.map((severity) => (
                  <button
                    key={severity.value}
                    type="button"
                    onClick={() =>
                      selectSeverity(severity.value)
                    }
                    className={`rounded-lg border px-2 py-2.5 text-xs font-semibold transition-all ${
                      form.severity === severity.value
                        ? `${severity.color} bg-card2 ring-2 ring-current/10`
                        : 'border-line/10 bg-bg3 text-ink2 hover:border-line2/25'
                    }`}
                  >
                    {severity.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="label-text">
                Emergency Title
              </label>

              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Woman being followed near bus stop"
                value={form.title}
                onChange={update('title')}
              />
            </div>

            {/* Description */}
            <div>
              <label className="label-text">
                Description
              </label>

              <textarea
                required
                rows={4}
                className="input-field resize-none"
                placeholder="Describe what is happening as clearly as possible."
                value={form.description}
                onChange={update('description')}
              />
            </div>

            {/* Location */}
            <div>
              <label className="label-text">
                Address / Location
              </label>

              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Connaught Place Inner Circle, New Delhi"
                value={form.location}
                onChange={update('location')}
              />

              <button
                type="button"
                onClick={useMyLocation}
                disabled={locating}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-brand-blue transition-colors hover:text-ink disabled:opacity-50"
              >
                {locating ? (
                  <Spinner size={12} />
                ) : (
                  <MapPin
                    size={14}
                    strokeWidth={1.9}
                  />
                )}

                {coords
                  ? 'Location coordinates captured'
                  : 'Use my current location'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary h-12 w-full"
            >
              {loading ? (
                <Spinner size={18} />
              ) : (
                <>
                  <Siren size={17} strokeWidth={2} />
                  Send Emergency Alert
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
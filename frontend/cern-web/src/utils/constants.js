// Backend enum values — must match Spring Boot exactly
export const ROLES = {
  CITIZEN: 'CITIZEN',
  VOLUNTEER: 'VOLUNTEER',

  MEDICAL_RESPONDER: 'MEDICAL_RESPONDER',
  FIRE_RESPONDER: 'FIRE_RESPONDER',
  POLICE_RESPONDER: 'POLICE_RESPONDER',

  ADMIN: 'ADMIN',
}

export const EMERGENCY_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
}

export const SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
}

export const STATUS_META = {
  OPEN: { label: 'Open', dot: 'bg-brand-amber', text: 'text-brand-amber', bg: 'bg-brand-amber/15' },
  IN_PROGRESS: { label: 'In Progress', dot: 'bg-brand-blue', text: 'text-brand-blue', bg: 'bg-brand-blue/15' },
  RESOLVED: { label: 'Resolved', dot: 'bg-brand-green', text: 'text-brand-green', bg: 'bg-brand-green/15' },
}

export const SEVERITY_META = {
  LOW: { label: 'Low', text: 'text-ink2', bg: 'bg-bg4', bar: 'bg-ink3', percent: '20%' },
  MEDIUM: { label: 'Medium', text: 'text-brand-blue', bg: 'bg-brand-blue/15', bar: 'bg-brand-blue', percent: '45%' },
  HIGH: { label: 'High', text: 'text-brand-amber', bg: 'bg-brand-amber/15', bar: 'bg-brand-amber', percent: '70%' },
  CRITICAL: { label: 'Critical', text: 'text-brand-red2', bg: 'bg-brand-red/15', bar: 'bg-brand-red', percent: '95%' },
}

export const EMERGENCY_TYPES = [
  { value: 'MEDICAL', label: 'Medical Emergency', icon: '🏥' },
  { value: 'ACCIDENT', label: 'Accident', icon: '🚗' },
  { value: 'FIRE', label: 'Fire', icon: '🔥' },
  { value: 'WOMEN_SAFETY', label: 'Women Safety', icon: '🆘' },
  { value: 'BLOOD', label: 'Blood Requirement', icon: '🩸' },
  { value: 'OTHER', label: 'Other', icon: '⚠️' },
]

export const TOKEN_KEY = 'cern_token'
export const ROLE_KEY = 'cern_role'
export const USER_KEY = 'cern_user'

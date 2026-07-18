import { ArrowLeft, HeartPulse, Home, ShieldX } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/constants'

const HOME_BY_ROLE = {
  [ROLES.CITIZEN]: '/citizen/dashboard',
  [ROLES.VOLUNTEER]: '/volunteer/dashboard',
  [ROLES.MEDICAL_RESPONDER]: '/medical/dashboard',
  [ROLES.FIRE_RESPONDER]: '/fire/dashboard',
  [ROLES.POLICE_RESPONDER]: '/police/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
}

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuth()

  const homePath = isAuthenticated
    ? HOME_BY_ROLE[role] || '/'
    : '/login'

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 text-ink">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto mb-8 flex w-fit items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-brand-red/25 bg-brand-red/10">
            <HeartPulse
              size={21}
              strokeWidth={2}
              className="text-brand-red"
            />
          </div>

          <div className="text-left">
            <p className="font-display text-sm font-semibold tracking-[0.14em]">
              CERN
            </p>

            <p className="text-[10px] uppercase tracking-[0.12em] text-ink3">
              Emergency Response
            </p>
          </div>
        </div>

        <div className="card px-6 py-12 sm:px-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-red/10">
            <ShieldX
              size={27}
              strokeWidth={1.8}
              className="text-brand-red2"
            />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-red2">
            Access restricted
          </p>

          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
            You cannot access this page
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink2">
            Your account is authenticated, but your current role does not have
            permission to open this section.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={homePath}
              className="btn-primary"
            >
              <Home size={16} strokeWidth={1.9} />
              Return to Dashboard
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              <ArrowLeft size={16} strokeWidth={1.9} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
import { useAuth } from '../context/AuthContext'
import { initials } from '../utils/format'

export default function Topbar({ title }) {
  const { user, role } = useAuth()

  return (
    <header className="lg:hidden sticky top-0 z-20 bg-bg/90 backdrop-blur border-b border-line px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-red to-brand-orange flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">✦</span>
        </div>
        <p className="font-display font-bold text-sm">{title || 'CERN'}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-[11px] font-bold text-white">
        {initials(user?.name)}
      </div>
    </header>
  )
}

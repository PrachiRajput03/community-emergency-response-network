export default function StatCard({ icon, label, value, color = 'text-ink', sub }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-ink3 mb-1">{label}</p>
          <p className={`text-3xl font-display font-bold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-ink3 mt-1">{sub}</p>}
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  )
}

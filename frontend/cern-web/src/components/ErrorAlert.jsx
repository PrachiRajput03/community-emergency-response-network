export default function ErrorAlert({ message, onClose }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-brand-red/10 border border-brand-red/30 text-brand-red2 text-sm">
      <span className="text-base leading-none mt-0.5">⚠️</span>
      <p className="flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-brand-red2/70 hover:text-brand-red2 text-lg leading-none">
          ×
        </button>
      )}
    </div>
  )
}

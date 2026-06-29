import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 text-center">
      <span className="text-5xl mb-4">🧭</span>
      <h1 className="font-display text-2xl font-bold text-ink mb-2">Page Not Found</h1>
      <p className="text-sm text-ink2 max-w-sm mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  )
}

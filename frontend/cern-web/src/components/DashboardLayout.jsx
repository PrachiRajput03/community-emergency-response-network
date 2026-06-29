import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import Topbar from './Topbar'

export default function DashboardLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          {title && (
            <h1 className="hidden lg:block font-display text-2xl font-bold text-ink mb-6">{title}</h1>
          )}
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}

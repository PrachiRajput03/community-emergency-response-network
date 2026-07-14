import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import Topbar from './Topbar'

export default function DashboardLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar title={title} />

          <main className="flex-1">
            <div className="mx-auto w-full max-w-[1440px] px-4 py-5 pb-24 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:pb-10 xl:px-10">
              {title && (
                <div className="mb-6 hidden lg:block">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink3">
                    CERN Operations
                  </p>

                  <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
                    {title}
                  </h1>
                </div>
              )}

              {children}
            </div>
          </main>
        </div>

        <MobileNav />
      </div>
    </div>
  )
}
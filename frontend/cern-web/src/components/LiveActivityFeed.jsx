import { useMemo } from 'react'

export default function LiveActivityFeed({ activities = [] }) {

  const sortedActivities = useMemo(
    () =>
      [...activities].sort(
        (a, b) =>
          new Date(b.time) - new Date(a.time)
      ),
    [activities]
  )

  return (
    <div className="card p-5">

      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-ink">
          🔔 Live Activity
        </h3>

        <span className="text-xs text-ink3">
          {sortedActivities.length} events
        </span>
      </div>

      {sortedActivities.length === 0 ? (
        <p className="text-sm text-ink3">
          Waiting for live updates...
        </p>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto">
          {sortedActivities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-xl bg-bg3 p-3"
            >
              <div className="flex items-center gap-2">

                <span className="text-xl">
                  {activity.icon}
                </span>

                <div>

                  <p className="text-sm font-medium text-ink">
                    {activity.message}
                  </p>

                  <p className="text-xs text-ink3 mt-1">
                    {new Date(activity.time).toLocaleTimeString()}
                  </p>

                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
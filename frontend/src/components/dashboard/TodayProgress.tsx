import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'

const topics = [
  { name: 'Algorithms', current: 8, total: 10, color: 'primary' as const },
  { name: 'Data Structures', current: 5, total: 8, color: 'green' as const },
  { name: 'System Design', current: 2, total: 6, color: 'blue' as const },
  { name: 'Databases', current: 3, total: 5, color: 'gold' as const },
]

export function TodayProgress() {
  const totalCompleted = topics.reduce((s, t) => s + t.current, 0)
  const totalAll = topics.reduce((s, t) => s + t.total, 0)

  return (
    <Card glow>
      <h3 className="text-sm font-semibold text-white mb-1">Today's Progress</h3>
      <p className="text-xs text-text-tertiary mb-4">
        {totalCompleted}/{totalAll} tasks completed
      </p>

      <ProgressBar value={totalCompleted} max={totalAll} color="primary" size="lg" className="mb-6" />

      <div className="space-y-3">
        {topics.map((topic) => (
          <div key={topic.name}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-text-secondary">{topic.name}</span>
              <span className="text-text-tertiary">
                {topic.current}/{topic.total}
              </span>
            </div>
            <ProgressBar value={topic.current} max={topic.total} color={topic.color} size="sm" />
          </div>
        ))}
      </div>
    </Card>
  )
}

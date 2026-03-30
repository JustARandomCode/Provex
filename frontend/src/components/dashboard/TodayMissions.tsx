import { Card } from '../ui/Card'
import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

const missions = [
  { id: '1', title: 'Solve 1 Easy Problem', completed: true, points: 10 },
  { id: '2', title: 'Complete a Study Lesson', completed: true, points: 15 },
  { id: '3', title: 'Score 80%+ on a Quiz', completed: false, points: 20 },
  { id: '4', title: 'Solve 1 Medium Problem', completed: false, points: 25 },
  { id: '5', title: 'Maintain Your Streak', completed: true, points: 10 },
]

export function TodayMissions() {
  const completed = missions.filter((m) => m.completed).length

  return (
    <Card glow>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Today's Missions</h3>
        <span className="text-xs text-text-tertiary">
          {completed}/{missions.length} done
        </span>
      </div>

      <div className="space-y-2.5">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
              mission.completed ? 'bg-primary/5' : 'bg-white/[0.02]'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                mission.completed
                  ? 'bg-primary border-primary'
                  : 'border-border-subtle'
              )}
            >
              {mission.completed && <Check className="w-3 h-3 text-white" />}
            </div>

            <span
              className={cn(
                'text-sm flex-1',
                mission.completed
                  ? 'text-text-secondary line-through'
                  : 'text-white'
              )}
            >
              {mission.title}
            </span>

            <span className="text-xs font-medium text-accent-gold">
              +{mission.points} PTS
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

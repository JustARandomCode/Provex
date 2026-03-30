import { Star } from 'lucide-react'
import { cn } from '../../lib/cn'

const achievements = [
  { id: '1', title: 'First Steps', stars: 1 as const, unlocked: true },
  { id: '2', title: 'Problem Solver', stars: 2 as const, unlocked: true },
  { id: '3', title: 'Code Master', stars: 3 as const, unlocked: true },
  { id: '4', title: 'Speed Demon', stars: 1 as const, unlocked: false },
  { id: '5', title: 'Streak King', stars: 2 as const, unlocked: false },
]

export function AchievementBadges() {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      {achievements.map((badge) => (
        <div
          key={badge.id}
          className={cn(
            'flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border min-w-[90px] transition-all',
            badge.unlocked
              ? 'bg-surface border-accent-gold/20'
              : 'bg-surface/50 border-border-subtle opacity-50'
          )}
        >
          <div className="flex gap-0.5">
            {Array.from({ length: badge.stars }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-4 h-4',
                  badge.unlocked ? 'text-accent-gold fill-accent-gold' : 'text-text-tertiary'
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-text-secondary whitespace-nowrap">{badge.title}</span>
        </div>
      ))}
    </div>
  )
}

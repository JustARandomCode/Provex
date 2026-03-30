import { Card } from '../ui/Card'
import { cn } from '../../lib/cn'

const leaderboard = [
  { rank: 1, name: 'Sarah Chen', points: 12450, streak: 45 },
  { rank: 2, name: 'Alex Mercer', points: 11200, streak: 38 },
  { rank: 3, name: 'Priya Patel', points: 10800, streak: 42 },
  { rank: 4, name: 'Marcus Johnson', points: 9500, streak: 30 },
  { rank: 5, name: 'You', points: 8750, streak: 23 },
  { rank: 6, name: 'Emma Wilson', points: 8200, streak: 20 },
  { rank: 7, name: 'James Kim', points: 7800, streak: 18 },
]

const rankEmoji = (rank: number) => {
  if (rank === 1) return '\u{1F680}'
  if (rank === 2) return '\u{1F680}'
  if (rank === 3) return '\u{1F680}'
  return ''
}

export function Leaderboard() {
  return (
    <Card glow>
      <h3 className="text-sm font-semibold text-white mb-4">Leaderboard</h3>

      <div className="space-y-2">
        {leaderboard.map((entry) => {
          const isYou = entry.name === 'You'
          return (
            <div
              key={entry.rank}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg',
                isYou ? 'bg-primary/10 border border-primary/20' : 'bg-white/[0.02]'
              )}
            >
              <span
                className={cn(
                  'w-6 text-center text-sm font-bold',
                  entry.rank <= 3 ? 'text-accent-gold' : 'text-text-tertiary'
                )}
              >
                {entry.rank}
              </span>

              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                  isYou
                    ? 'bg-primary text-white'
                    : 'bg-elevated text-text-secondary'
                )}
              >
                {entry.name[0]}
              </div>

              <span className={cn('flex-1 text-sm', isYou ? 'text-white font-semibold' : 'text-text-secondary')}>
                {entry.name} {rankEmoji(entry.rank)}
              </span>

              <div className="text-right">
                <div className="text-sm font-semibold text-white">{entry.points.toLocaleString()}</div>
                <div className="text-[10px] text-text-tertiary">{entry.streak}d streak</div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

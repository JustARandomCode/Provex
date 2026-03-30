import { Card } from '../ui/Card'
import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

const activeDays = new Set([1, 2, 3, 5, 6, 7, 9, 10, 12, 13, 14, 16, 17, 19, 20, 21, 23, 24, 25, 26, 28, 29, 30])
const today = 30
const daysInMonth = 31

export function MonthlyProgress() {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const startDay = 0

  const days: (number | null)[] = []
  for (let i = 0; i < startDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  return (
    <Card glow>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Monthly Progress</h3>
        <span className="text-xs text-text-tertiary">March 2026</span>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-[10px] text-text-tertiary font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />
          }
          const isActive = activeDays.has(day)
          const isToday = day === today

          return (
            <div
              key={day}
              className={cn(
                'aspect-square rounded-md flex items-center justify-center text-xs relative',
                isActive
                  ? 'bg-accent-green/10 text-accent-green'
                  : 'bg-white/[0.02] text-text-tertiary',
                isToday && 'ring-1 ring-primary'
              )}
            >
              {isActive ? (
                <Check className="w-3 h-3" />
              ) : day <= today ? (
                <span className="text-[10px]">{day}</span>
              ) : (
                <span className="text-[10px] opacity-30">{day}</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-text-tertiary">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-accent-green/10" />
          Active
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-white/[0.02] border border-border-subtle" />
          Missed
        </div>
        <span className="ml-auto font-medium text-accent-green">
          {activeDays.size} day streak
        </span>
      </div>
    </Card>
  )
}

import { useState } from 'react'
import { Button } from '../ui/Button'
import { Lightbulb, Lock, Unlock, Flame } from 'lucide-react'
import { cn } from '../../lib/cn'

const hints = [
  {
    level: 1,
    cost: 1,
    content: 'Think about sorting the intervals first. What property should you sort by?',
    unlocked: true,
  },
  {
    level: 2,
    cost: 2,
    content: 'After sorting, compare the end of the last merged interval with the start of the current interval.',
    unlocked: false,
  },
  {
    level: 3,
    cost: 3,
    content: 'If current[0] <= merged[-1][1], update merged[-1][1] = max(merged[-1][1], current[1]). Otherwise, append current.',
    unlocked: false,
  },
]

export function HintsPanel() {
  const [unlockedHints, setUnlockedHints] = useState<Set<number>>(new Set([1]))

  const toggleUnlock = (level: number) => {
    setUnlockedHints((prev) => new Set([...prev, level]))
  }

  return (
    <div className="w-full h-full flex flex-col bg-surface border-l border-border-subtle">
      <div className="p-4 border-b border-border-subtle">
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="w-4 h-4 text-accent-gold" />
          <h3 className="text-sm font-semibold text-white">Hints & Help</h3>
        </div>
        <p className="text-xs text-text-tertiary">
          Use hint credits to unlock progressive hints
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {hints.map((hint) => {
          const isUnlocked = unlockedHints.has(hint.level)
          return (
            <div
              key={hint.level}
              className={cn(
                'rounded-lg border p-3',
                isUnlocked
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-white/[0.02] border-border-subtle'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isUnlocked ? (
                    <Unlock className="w-3.5 h-3.5 text-primary-light" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-text-tertiary" />
                  )}
                  <span className="text-xs font-semibold text-white">
                    Hint {hint.level}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-accent-gold">
                  <Flame className="w-3 h-3" />
                  {hint.cost}
                </div>
              </div>

              {isUnlocked ? (
                <p className="text-xs text-text-secondary leading-relaxed">
                  {hint.content}
                </p>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-1 text-xs"
                  onClick={() => toggleUnlock(hint.level)}
                >
                  <Lock className="w-3 h-3" />
                  Unlock for {hint.cost} credit{hint.cost > 1 ? 's' : ''}
                </Button>
              )}
            </div>
          )
        })}
      </div>

      <div className="p-4 border-t border-border-subtle">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Credits remaining</span>
          <div className="flex items-center gap-1 font-semibold text-accent-gold">
            <Flame className="w-3.5 h-3.5" />
            12
          </div>
        </div>
      </div>
    </div>
  )
}

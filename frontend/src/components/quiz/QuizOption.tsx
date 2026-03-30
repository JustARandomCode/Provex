import { cn } from '../../lib/cn'
import { Check, X } from 'lucide-react'

type OptionState = 'default' | 'selected' | 'correct' | 'wrong'

interface QuizOptionProps {
  index: number
  text: string
  state: OptionState
  onClick?: () => void
  disabled?: boolean
}

const stateStyles: Record<OptionState, string> = {
  default: 'bg-surface border-border-subtle hover:border-primary/30 hover:bg-primary/[0.03] cursor-pointer',
  selected: 'bg-primary/10 border-primary/40 cursor-pointer',
  correct: 'bg-accent-green/10 border-accent-green/40',
  wrong: 'bg-danger/10 border-danger/40',
}

const labels = ['A', 'B', 'C', 'D']

export function QuizOption({ index, text, state, onClick, disabled }: QuizOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all text-left',
        stateStyles[state],
        disabled && state === 'default' && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
          state === 'correct'
            ? 'bg-accent-green text-white'
            : state === 'wrong'
            ? 'bg-danger text-white'
            : state === 'selected'
            ? 'bg-primary text-white'
            : 'bg-elevated text-text-tertiary'
        )}
      >
        {state === 'correct' ? (
          <Check className="w-4 h-4" />
        ) : state === 'wrong' ? (
          <X className="w-4 h-4" />
        ) : (
          labels[index]
        )}
      </span>

      <span
        className={cn(
          'text-sm flex-1',
          state === 'correct'
            ? 'text-accent-green font-medium'
            : state === 'wrong'
            ? 'text-danger'
            : state === 'selected'
            ? 'text-white font-medium'
            : 'text-text-secondary'
        )}
      >
        {text}
      </span>
    </button>
  )
}

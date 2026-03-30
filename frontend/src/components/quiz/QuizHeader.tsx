import { Clock, HelpCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

interface QuizHeaderProps {
  currentQuestion: number
  totalQuestions: number
  timeRemaining: string
  answers: ('correct' | 'wrong' | 'unanswered')[]
}

export function QuizHeader({ currentQuestion, totalQuestions, timeRemaining, answers }: QuizHeaderProps) {
  return (
    <div className="bg-surface border-b border-border-subtle px-6 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary-light" />
            <span className="text-sm font-semibold text-white">
              Q{currentQuestion}/{totalQuestions}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{timeRemaining}</span>
          </div>
        </div>

        <div className="flex gap-1">
          {answers.map((answer, idx) => (
            <div
              key={idx}
              className={cn(
                'h-2 rounded-full flex-1 transition-colors',
                answer === 'correct'
                  ? 'bg-accent-green'
                  : answer === 'wrong'
                  ? 'bg-danger'
                  : idx < currentQuestion - 1
                  ? 'bg-text-tertiary'
                  : idx === currentQuestion - 1
                  ? 'bg-primary'
                  : 'bg-white/5'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

import { Trophy, RotateCcw, BookOpen, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

interface QuizResultProps {
  score: number
  total: number
  timeTaken: string
  pointsEarned: number
}

export function QuizResult({ score, total, timeTaken, pointsEarned }: QuizResultProps) {
  const percent = Math.round((score / total) * 100)
  const passed = percent >= 70

  return (
    <div className="max-w-md mx-auto text-center py-12 px-6">
      <div
        className={cn(
          'w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center',
          passed
            ? 'bg-accent-green/10 border-2 border-accent-green/30'
            : 'bg-accent-gold/10 border-2 border-accent-gold/30'
        )}
      >
        <Trophy
          className={cn(
            'w-10 h-10',
            passed ? 'text-accent-green' : 'text-accent-gold'
          )}
        />
      </div>

      <h2 className="text-2xl font-bold text-white mb-1">
        {passed ? 'Great Job!' : 'Review the Lesson'}
      </h2>
      <p className="text-4xl font-bold mb-2">
        <span className={passed ? 'text-accent-green' : 'text-accent-gold'}>{percent}%</span>
      </p>
      <p className="text-sm text-text-secondary mb-8">
        You got {score} out of {total} questions correct in {timeTaken}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-surface rounded-xl border border-border-subtle p-3">
          <div className="text-lg font-bold text-white">{score}/{total}</div>
          <div className="text-[10px] text-text-tertiary">Correct</div>
        </div>
        <div className="bg-surface rounded-xl border border-border-subtle p-3">
          <div className="text-lg font-bold text-white">{timeTaken}</div>
          <div className="text-[10px] text-text-tertiary">Time</div>
        </div>
        <div className="bg-surface rounded-xl border border-border-subtle p-3">
          <div className="text-lg font-bold text-accent-gold">+{pointsEarned}</div>
          <div className="text-[10px] text-text-tertiary">Points</div>
        </div>
      </div>

      <div className="space-y-3">
        <Button variant="primary" fullWidth size="lg">
          <Sparkles className="w-4 h-4" />
          New Topic
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth>
            <RotateCcw className="w-4 h-4" />
            Retry Quiz
          </Button>
          <Button variant="ghost" fullWidth>
            <BookOpen className="w-4 h-4" />
            Review Lesson
          </Button>
        </div>
      </div>
    </div>
  )
}

import { Flame, Lightbulb, X } from 'lucide-react'
import { Button } from '../ui/Button'

interface HintUnlockModalProps {
  hintLevel: number
  cost: number
  creditsRemaining: number
  onUnlock: () => void
  onClose: () => void
}

export function HintUnlockModal({
  hintLevel,
  cost,
  creditsRemaining,
  onUnlock,
  onClose,
}: HintUnlockModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface border border-border-subtle rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-primary/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-tertiary hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="w-7 h-7 text-accent-gold" />
        </div>

        <h3 className="text-lg font-bold text-white text-center mb-1">
          Unlock Hint {hintLevel}
        </h3>
        <p className="text-sm text-text-secondary text-center mb-6">
          This will use some of your hint credits. Are you sure?
        </p>

        <div className="bg-elevated rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs text-text-tertiary block">Cost</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Flame className="w-4 h-4 text-accent-gold" />
              <span className="text-lg font-bold text-white">{cost}</span>
              <span className="text-xs text-text-tertiary">credit{cost > 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-text-tertiary block">Remaining</span>
            <span className="text-lg font-bold text-accent-gold">{creditsRemaining}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" size="md" fullWidth onClick={onClose}>
            Keep Thinking
          </Button>
          <Button variant="primary" size="md" fullWidth onClick={onUnlock}>
            <Lightbulb className="w-4 h-4" />
            Unlock
          </Button>
        </div>
      </div>
    </div>
  )
}

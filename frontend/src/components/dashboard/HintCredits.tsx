import { Card } from '../ui/Card'
import { Flame, TrendingUp } from 'lucide-react'

export function HintCredits() {
  return (
    <Card glow>
      <h3 className="text-sm font-semibold text-white mb-4">Hint Credits</h3>

      <div className="flex items-center justify-center gap-8">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full border-2 border-accent-gold/30 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="rgba(245, 158, 11, 0.1)"
                strokeWidth="4"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="4"
                strokeDasharray={`${(12 / 20) * 226} 226`}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center">
              <Flame className="w-4 h-4 text-accent-gold mx-auto mb-0.5" />
              <span className="text-lg font-bold text-white">12</span>
            </div>
          </div>
          <span className="text-xs text-text-secondary mt-2">Current</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="rgba(124, 58, 237, 0.1)"
                strokeWidth="4"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="4"
                strokeDasharray={`${(8 / 20) * 226} 226`}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center">
              <TrendingUp className="w-4 h-4 text-primary-light mx-auto mb-0.5" />
              <span className="text-lg font-bold text-white">8</span>
            </div>
          </div>
          <span className="text-xs text-text-secondary mt-2">Used</span>
        </div>
      </div>
    </Card>
  )
}

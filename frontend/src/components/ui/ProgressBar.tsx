import { cn } from '../../lib/cn'

interface ProgressBarProps {
  value: number
  max?: number
  color?: 'primary' | 'green' | 'gold' | 'blue' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const colorStyles: Record<string, string> = {
  primary: 'bg-gradient-to-r from-primary to-primary-light',
  green: 'bg-accent-green',
  gold: 'bg-accent-gold',
  blue: 'bg-accent-blue',
  danger: 'bg-danger',
}

const sizeStyles: Record<string, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-secondary mb-1">
          <span>Progress</span>
          <span>{Math.round(percent)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-white/5 rounded-full overflow-hidden', sizeStyles[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colorStyles[color])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

import { cn } from '../../lib/cn'

type BadgeVariant = 'default' | 'easy' | 'medium' | 'hard' | 'success' | 'warning' | 'info' | 'purple' | 'points'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/5 text-text-secondary border-border-subtle',
  easy: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  medium: 'bg-accent-gold/10 text-accent-gold border-accent-gold/20',
  hard: 'bg-danger/10 text-danger border-danger/20',
  success: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  warning: 'bg-accent-gold/10 text-accent-gold border-accent-gold/20',
  info: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  purple: 'bg-primary/10 text-primary-light border-primary/20',
  points: 'bg-accent-gold/10 text-accent-gold border-accent-gold/20',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

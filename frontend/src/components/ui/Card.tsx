import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  hoverable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = false, hoverable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-surface rounded-xl border border-border-subtle p-6',
          glow && 'border-border-glow shadow-[0_0_15px_rgba(124,58,237,0.1)]',
          hoverable &&
            'transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_25px_rgba(124,58,237,0.15)] hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

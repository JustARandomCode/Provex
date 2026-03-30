import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/cn'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'green' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary to-[#C084FC] text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-[0.98]',
  outline:
    'border border-primary/40 text-primary-light hover:bg-primary/10 hover:border-primary/60 active:scale-[0.98]',
  ghost:
    'text-text-secondary hover:text-white hover:bg-white/5 active:scale-[0.98]',
  green:
    'bg-accent-green text-white hover:bg-accent-green/90 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-[0.98]',
  danger:
    'bg-danger text-white hover:bg-danger/90 active:scale-[0.98]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-8 py-3.5 text-base rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer select-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

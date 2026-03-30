import { cn } from '../../lib/cn'

interface GlowOrbsProps {
  className?: string
  variant?: 'auth' | 'hero' | 'subtle'
}

export function GlowOrbs({ className, variant = 'auth' }: GlowOrbsProps) {
  return (
    <div className={cn('pointer-events-none fixed inset-0 overflow-hidden', className)} aria-hidden="true">
      {variant === 'auth' && (
        <>
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent-blue/8 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px]" />
        </>
      )}
      {variant === 'hero' && (
        <>
          <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-accent-green/5 blur-[100px]" />
        </>
      )}
      {variant === 'subtle' && (
        <>
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-accent-blue/5 blur-[60px]" />
        </>
      )}
    </div>
  )
}

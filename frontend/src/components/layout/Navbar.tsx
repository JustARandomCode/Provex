import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Flame } from 'lucide-react'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/study' },
  { label: 'Challenges', path: '/coding' },
  { label: 'Status', path: '/dashboard' },
  { label: 'About us', path: '/about' },
  { label: 'Profile', path: '/dashboard' },
]

export function Navbar() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 bg-base/80 backdrop-blur-xl border-b border-border-subtle">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm">
            P
          </div>
          <span className="text-lg font-bold text-white">
            PRO<span className="text-primary-light">VEX</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path + link.label}
              to={link.path}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
                isActive(link.path)
                  ? 'bg-accent-green text-white border-accent-green/30'
                  : 'text-text-secondary border-transparent hover:text-white hover:border-primary/30 hover:bg-primary/5'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border-subtle">
            <Flame className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-semibold text-white">12</span>
          </div>
        </div>
      </div>

      <div className="relative h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent">
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary/40" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary/40" />
      </div>
    </header>
  )
}

import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <span className="text-lg font-bold text-white">
                PRO<span className="text-primary-light">VEX</span>
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Code Harder, Study Smarter, Grow Faster. The all-in-one platform for developers who want to level up.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              {[
                { label: 'Coding Arena', path: '/coding' },
                { label: 'Study Platform', path: '/study' },
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'About Us', path: '/about' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-text-secondary hover:text-primary-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {['Documentation', 'API Reference', 'Community', 'Blog'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-text-secondary hover:text-primary-light transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <Mail className="w-4 h-4 text-primary-light" />
                hello@provex.dev
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <Phone className="w-4 h-4 text-primary-light" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-primary-light" />
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">
            &copy; 2026 PROVEX. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <span key={item} className="text-xs text-text-tertiary hover:text-text-secondary cursor-pointer transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

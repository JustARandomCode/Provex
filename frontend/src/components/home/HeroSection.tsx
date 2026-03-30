import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function HeroSection() {
  return (
    <section className="relative py-24 px-6 text-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          Now in Beta &mdash; Join 5,000+ developers
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          <span className="text-accent-green">Code</span> Harder,{' '}
          <br className="hidden md:block" />
          Study{' '}
          <span className="text-accent-green">Smarter</span>,{' '}
          <br className="hidden md:block" />
          Grow{' '}
          <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Faster
          </span>
        </h1>

        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          Master algorithms, ace your interviews, and deeply understand any topic with AI-powered
          lessons, interactive coding challenges, and smart study tools.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/signup">
            <Button size="lg">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-8 mt-16">
          {[
            { value: '500+', label: 'Coding Problems' },
            { value: '50+', label: 'Study Topics' },
            { value: '10K+', label: 'Active Users' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-text-tertiary mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

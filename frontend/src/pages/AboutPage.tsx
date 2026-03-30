import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { GlowOrbs } from '../components/ui/GlowOrbs'
import { Heart, Users, Lightbulb, Globe } from 'lucide-react'

const team = [
  { name: 'Sarah Chen', role: 'CEO & Co-founder', avatar: 'SC' },
  { name: 'Marcus Johnson', role: 'CTO & Co-founder', avatar: 'MJ' },
  { name: 'Priya Patel', role: 'Head of AI', avatar: 'PP' },
  { name: 'Alex Rivera', role: 'Lead Engineer', avatar: 'AR' },
]

const values = [
  {
    icon: Heart,
    title: 'Passion for Learning',
    description: 'We believe everyone deserves access to quality tech education, regardless of background.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Learning is better together. We build tools that foster collaboration and shared growth.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We leverage AI and modern technology to create learning experiences that were never possible before.',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description: 'Our platform is designed to be accessible to learners everywhere, in every timezone.',
  },
]

export function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-base relative">
      <GlowOrbs variant="hero" />
      <Navbar />
      <main className="flex-1 relative z-10">
        <section className="py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-medium mb-6">
              About PROVEX
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              We're on a Mission to{' '}
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Democratize
              </span>{' '}
              Tech Education
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              PROVEX was born from a simple idea: learning to code should be engaging, personalized,
              and accessible to everyone. We combine the power of AI with proven learning science
              to create an experience that helps you actually retain what you learn.
            </p>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '10K+', label: 'Active Learners' },
              { value: '500+', label: 'Problems' },
              { value: '50+', label: 'Topics' },
              { value: '95%', label: 'Satisfaction Rate' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-surface border border-border-subtle rounded-xl p-5 text-center"
              >
                <div className="text-2xl font-bold text-primary-light mb-1">{stat.value}</div>
                <div className="text-xs text-text-tertiary">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-10">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="flex gap-4 bg-surface/50 border border-border-subtle rounded-xl p-5"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-5 h-5 text-primary-light" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">{value.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-10">Meet the Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                    {member.avatar}
                  </div>
                  <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                  <p className="text-xs text-text-tertiary mt-0.5">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

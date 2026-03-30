import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { HeroSection } from '../components/home/HeroSection'
import { PlatformCards } from '../components/home/PlatformCards'
import { GlowOrbs } from '../components/ui/GlowOrbs'

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-base relative">
      <GlowOrbs variant="hero" />
      <Navbar />
      <main className="flex-1 relative z-10">
        <HeroSection />
        <PlatformCards />

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-3">
              Why <span className="text-primary-light">PROVEX</span>?
            </h2>
            <p className="text-text-secondary mb-12 max-w-xl mx-auto">
              Built by developers, for developers. Every feature is designed to help you grow faster.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '\u{1F9E0}',
                  title: 'AI-Powered Learning',
                  description:
                    'Generate custom lessons from any topic or upload your own materials. Our AI creates structured, deep-dive content.',
                },
                {
                  icon: '\u{1F4A1}',
                  title: 'Smart Hint System',
                  description:
                    'Stuck on a problem? Use hint credits for progressive hints that guide you to the solution without giving it away.',
                },
                {
                  icon: '\u{1F3C6}',
                  title: 'Gamified Progress',
                  description:
                    'Earn points, maintain streaks, unlock achievements, and compete on leaderboards. Learning should be fun.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-surface/50 border border-border-subtle rounded-xl p-6 hover:border-primary/20 transition-colors"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Ready to Level Up?
            </h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Join thousands of developers who are sharpening their skills with PROVEX.
              Start for free, grow forever.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-[#C084FC] text-white font-semibold hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
            >
              Get Started Free
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

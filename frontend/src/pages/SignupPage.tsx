import { SignupForm } from '../components/auth/SignupForm'
import { GlowOrbs } from '../components/ui/GlowOrbs'

export function SignupPage() {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-base">
      <GlowOrbs variant="auth" />

      <div className="flex flex-1 items-center justify-center relative z-10 py-8">
        <div className="w-full max-w-4xl mx-auto px-6">
          <div className="bg-surface/60 backdrop-blur-xl border border-border-subtle rounded-2xl p-8 md:p-12 shadow-2xl shadow-primary/5">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <SignupForm />

              <div className="hidden md:flex flex-col items-center justify-center">
                <div className="w-full max-w-[280px] aspect-[3/4] rounded-2xl bg-gradient-to-br from-primary/10 to-accent-green/10 border border-border-subtle flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="text-6xl mb-4">{'\u{1F468}\u{200D}\u{1F680}'}</div>
                    <p className="text-sm text-text-secondary font-medium">
                      Join the crew
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">
                      5,000+ developers already on board
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full bg-elevated border border-border-subtle flex items-center justify-center text-[10px] font-bold text-text-secondary -ml-1 first:ml-0"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                      <span className="text-[10px] text-text-tertiary ml-1">+4,995</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

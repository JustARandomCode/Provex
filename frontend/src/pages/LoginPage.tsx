import { LoginForm } from '../components/auth/LoginForm'
import { GlowOrbs } from '../components/ui/GlowOrbs'

export function LoginPage() {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-base">
      <GlowOrbs variant="auth" />

      <div className="flex flex-1 items-center justify-center relative z-10">
        <div className="w-full max-w-4xl mx-auto px-6">
          <div className="bg-surface/60 backdrop-blur-xl border border-border-subtle rounded-2xl p-8 md:p-12 shadow-2xl shadow-primary/5">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <LoginForm />

              <div className="hidden md:flex flex-col items-center justify-center">
                <div className="w-full max-w-[280px] aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-accent-blue/10 border border-border-subtle flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{'\u{1F680}'}</div>
                    <p className="text-sm text-text-secondary font-medium">
                      Ready for launch?
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">
                      Your coding journey awaits
                    </p>
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

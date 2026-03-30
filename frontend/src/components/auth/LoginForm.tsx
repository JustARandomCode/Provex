import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Mail, Lock, Rocket } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-4xl font-bold italic font-display mb-2">
          Hello Co<span className="text-primary-light">ders</span>
        </h1>
        <p className="text-text-secondary text-sm">
          Welcome back! Sign in to continue your journey.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
        className="space-y-4"
      >
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border-subtle bg-surface text-primary accent-primary"
            />
            <span className="text-text-secondary">Remember me</span>
          </label>
          <span className="text-primary-light hover:underline cursor-pointer">
            Forgot password?
          </span>
        </div>

        <Button type="submit" fullWidth size="lg" className="mt-6">
          <Rocket className="w-4 h-4" />
          Send it to the moon
        </Button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-xs text-text-tertiary">or continue with</span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      <div className="flex gap-3">
        {[
          { label: 'Google', icon: 'G' },
          { label: 'Apple', icon: '' },
        ].map((provider) => (
          <button
            key={provider.label}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-border-subtle rounded-lg text-sm text-text-secondary hover:text-white hover:border-primary/30 transition-all"
          >
            <span className="font-bold text-base">{provider.icon}</span>
            {provider.label}
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-text-secondary mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary-light hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}

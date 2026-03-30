import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Mail, Lock, User, Phone, Rocket } from 'lucide-react'

export function SignupForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-4xl font-bold italic font-display mb-2">
          Join <span className="text-primary-light">PROVEX</span>
        </h1>
        <p className="text-text-secondary text-sm">
          Create your account and start your coding journey today.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="John"
            value={form.firstName}
            onChange={update('firstName')}
            icon={<User className="w-4 h-4" />}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            value={form.lastName}
            onChange={update('lastName')}
            icon={<User className="w-4 h-4" />}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={update('email')}
          icon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={form.phone}
          onChange={update('phone')}
          icon={<Phone className="w-4 h-4" />}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min 8 characters"
          value={form.password}
          onChange={update('password')}
          icon={<Lock className="w-4 h-4" />}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={update('confirmPassword')}
          icon={<Lock className="w-4 h-4" />}
        />

        <Button type="submit" fullWidth size="lg" className="mt-4">
          <Rocket className="w-4 h-4" />
          Launch My Account
        </Button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-xs text-text-tertiary">or sign up with</span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      <div className="flex gap-3">
        {[
          { label: 'Google', icon: 'G' },
          { label: 'Apple', icon: '' },
          { label: 'Email Link', icon: '@' },
        ].map((provider) => (
          <button
            key={provider.label}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-surface border border-border-subtle rounded-lg text-sm text-text-secondary hover:text-white hover:border-primary/30 transition-all"
          >
            <span className="font-bold text-base">{provider.icon}</span>
            <span className="hidden sm:inline">{provider.label}</span>
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-text-secondary mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-light hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}

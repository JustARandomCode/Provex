import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AchievementBadges } from '../components/dashboard/AchievementBadges'
import { TodayProgress } from '../components/dashboard/TodayProgress'
import { HintCredits } from '../components/dashboard/HintCredits'
import { TodayMissions } from '../components/dashboard/TodayMissions'
import { MonthlyProgress } from '../components/dashboard/MonthlyProgress'
import { Leaderboard } from '../components/dashboard/Leaderboard'
import { GlowOrbs } from '../components/ui/GlowOrbs'
import { Zap } from 'lucide-react'

export function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-base relative">
      <GlowOrbs variant="subtle" />
      <Navbar />
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">
              Hello, <span className="text-primary-light">Alex</span>{' '}
              <span className="inline-block animate-bounce">{'\u{1F44B}'}</span>
            </h1>
            <p className="text-text-secondary text-sm">
              Welcome back! You're on a <span className="text-accent-green font-semibold">23 day</span> streak. Keep it going!
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-accent-gold" />
              <h2 className="text-sm font-semibold text-white">Achievements</h2>
            </div>
            <AchievementBadges />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <TodayProgress />
            <HintCredits />
            <TodayMissions />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <MonthlyProgress />
            <Leaderboard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

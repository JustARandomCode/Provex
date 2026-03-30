import { Navbar } from '../components/layout/Navbar'
import { LessonSidebar } from '../components/study/LessonSidebar'
import { LessonContent } from '../components/study/LessonContent'
import { QASection } from '../components/study/QASection'
import { Button } from '../components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function LessonPage() {
  const navigate = useNavigate()

  return (
    <div className="h-screen flex flex-col bg-base">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 flex-shrink-0 overflow-hidden">
          <LessonSidebar />
        </div>

        <div className="flex-1 overflow-y-auto">
          <LessonContent />
          <QASection />

          <div className="max-w-3xl mx-auto px-6 pb-10">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Ready to test your knowledge?</h3>
              <p className="text-sm text-text-secondary mb-4">
                Take a quiz to reinforce what you've learned and earn points.
              </p>
              <Button onClick={() => navigate('/study/quiz')}>
                Take the Quiz
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { PromptInput } from '../components/study/PromptInput'
import { FileUpload } from '../components/study/FileUpload'
import { TopicGrid } from '../components/study/TopicGrid'
import { GlowOrbs } from '../components/ui/GlowOrbs'
import { Button } from '../components/ui/Button'
import { Sparkles, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function StudyPlatformPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-base relative">
      <GlowOrbs variant="hero" />
      <Navbar />
      <main className="flex-1 relative z-10">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              AI Powered
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Learn Anything.{' '}
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Deeply.
              </span>
            </h1>
            <p className="text-text-secondary max-w-xl mx-auto">
              Enter a topic or upload your study materials. Our AI will generate structured lessons,
              quizzes, and flashcards tailored to your needs.
            </p>
          </div>

          <div className="mb-6">
            <PromptInput />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-xs text-text-tertiary">or upload files</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          <div className="mb-8">
            <FileUpload />
          </div>

          <div className="text-center mb-12">
            <Button
              size="lg"
              onClick={() => navigate('/study/lesson')}
            >
              <BookOpen className="w-4 h-4" />
              Generate My Lesson
            </Button>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Popular Topics</h2>
            <p className="text-sm text-text-secondary mb-6">
              Or start with one of these curated topics
            </p>
            <TopicGrid />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

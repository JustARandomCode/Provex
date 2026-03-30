import { Code2, BookOpen, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

const platforms = [
  {
    title: 'Coding Platform',
    description:
      'Sharpen your skills with 500+ problems across algorithms, data structures, and system design. Real-time code execution, hints, and detailed solutions.',
    icon: Code2,
    link: '/coding',
    tags: ['Algorithms', 'Data Structures', 'Python', 'JavaScript', 'C++'],
    gradient: 'from-primary to-primary-light',
    cta: 'Enter Arena',
  },
  {
    title: 'Study Material Platform',
    description:
      'AI-powered lessons on any topic. Upload documents, generate structured courses, take quizzes, and track your understanding with smart analytics.',
    icon: BookOpen,
    link: '/study',
    tags: ['AI Lessons', 'Quizzes', 'PDF Upload', 'Custom Topics', 'Progress Tracking'],
    gradient: 'from-accent-green to-emerald-400',
    cta: 'Start Learning',
  },
]

export function PlatformCards() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">
          Choose Your <span className="text-primary-light">Path</span>
        </h2>
        <p className="text-text-secondary text-center mb-12 max-w-xl mx-auto">
          Two powerful platforms, one seamless experience. Whether you want to code or study, we've got you covered.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {platforms.map((platform) => (
            <Card key={platform.title} glow hoverable className="flex flex-col">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center mb-4`}
              >
                <platform.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{platform.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
                {platform.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {platform.tags.map((tag) => (
                  <Badge key={tag} variant="purple">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Link
                to={platform.link}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-light hover:text-white transition-colors group"
              >
                {platform.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

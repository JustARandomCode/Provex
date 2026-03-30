import { cn } from '../../lib/cn'
import { Check, BookOpen } from 'lucide-react'

const sections = [
  { id: '1', title: 'Introduction', completed: true },
  { id: '2', title: 'Core Concepts', completed: true },
  { id: '3', title: 'How It Works', completed: true },
  { id: '4', title: 'Implementation', completed: false, active: true },
  { id: '5', title: 'Examples', completed: false },
  { id: '6', title: 'Common Pitfalls', completed: false },
  { id: '7', title: 'Summary', completed: false },
  { id: '8', title: 'Quiz', completed: false },
]

export function LessonSidebar() {
  const completedCount = sections.filter((s) => s.completed).length

  return (
    <div className="w-full h-full flex flex-col bg-surface border-r border-border-subtle">
      <div className="p-4 border-b border-border-subtle">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-primary-light" />
          <h3 className="text-sm font-semibold text-white">Lesson Sections</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-green rounded-full transition-all"
              style={{ width: `${(completedCount / sections.length) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-text-tertiary">
            {completedCount}/{sections.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {sections.map((section, idx) => (
          <button
            key={section.id}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
              section.active
                ? 'bg-primary/5 border-l-2 border-l-primary'
                : 'border-l-2 border-l-transparent hover:bg-white/[0.02]'
            )}
          >
            {section.completed ? (
              <div className="w-5 h-5 rounded-full bg-accent-green/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-accent-green" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border border-border-subtle flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] text-text-tertiary">{idx + 1}</span>
              </div>
            )}

            <span
              className={cn(
                'text-sm',
                section.active
                  ? 'text-white font-medium'
                  : section.completed
                  ? 'text-text-secondary'
                  : 'text-text-tertiary'
              )}
            >
              {section.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

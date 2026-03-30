import { ProgressBar } from '../ui/ProgressBar'
import { cn } from '../../lib/cn'

const activeCourses = [
  { name: 'Python Basics', progress: 75, icon: '\u{1F40D}' },
  { name: 'JavaScript Mastery', progress: 40, icon: '\u{1F4DC}' },
  { name: 'C++ Algorithms', progress: 20, icon: '\u{2699}\u{FE0F}' },
]

export function ActiveCourseBar() {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2">
      {activeCourses.map((course, i) => (
        <div
          key={course.name}
          className={cn(
            'flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-surface min-w-[220px] shrink-0',
            i === 0
              ? 'border-primary/30 shadow-[0_0_10px_rgba(124,58,237,0.1)]'
              : 'border-border-subtle'
          )}
        >
          <span className="text-xl">{course.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">{course.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <ProgressBar value={course.progress} size="sm" color="primary" className="flex-1" />
              <span className="text-[10px] text-text-tertiary shrink-0">{course.progress}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

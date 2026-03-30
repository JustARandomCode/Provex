import { useState } from 'react'
import { cn } from '../../lib/cn'
import { Badge } from '../ui/Badge'
import { Check, Circle, Minus } from 'lucide-react'

type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard'

const problems = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy' as const, status: 'solved' as const, points: 10 },
  { id: 2, title: 'Reverse Linked List', difficulty: 'Easy' as const, status: 'solved' as const, points: 10 },
  { id: 3, title: 'Valid Parentheses', difficulty: 'Easy' as const, status: 'solved' as const, points: 10 },
  { id: 4, title: 'Merge Intervals', difficulty: 'Medium' as const, status: 'attempted' as const, points: 20 },
  { id: 5, title: 'LRU Cache', difficulty: 'Medium' as const, status: 'unsolved' as const, points: 20 },
  { id: 6, title: 'Binary Tree Zigzag', difficulty: 'Medium' as const, status: 'unsolved' as const, points: 20 },
  { id: 7, title: 'Median of Two Sorted Arrays', difficulty: 'Hard' as const, status: 'unsolved' as const, points: 30 },
  { id: 8, title: 'Regular Expression Matching', difficulty: 'Hard' as const, status: 'unsolved' as const, points: 30 },
]

const statusIcon = {
  solved: <Check className="w-3.5 h-3.5 text-accent-green" />,
  attempted: <Minus className="w-3.5 h-3.5 text-accent-gold" />,
  unsolved: <Circle className="w-3.5 h-3.5 text-text-tertiary" />,
}

export function ProblemSidebar() {
  const [filter, setFilter] = useState<Difficulty>('All')
  const [selectedId, setSelectedId] = useState(4)

  const filtered = filter === 'All' ? problems : problems.filter((p) => p.difficulty === filter)

  return (
    <div className="w-full h-full flex flex-col bg-surface border-r border-border-subtle">
      <div className="p-4 border-b border-border-subtle">
        <h3 className="text-sm font-semibold text-white mb-3">Problems</h3>

        <div className="flex gap-1">
          {(['All', 'Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                filter === d
                  ? d === 'Easy'
                    ? 'bg-accent-green/10 text-accent-green'
                    : d === 'Medium'
                    ? 'bg-accent-gold/10 text-accent-gold'
                    : d === 'Hard'
                    ? 'bg-danger/10 text-danger'
                    : 'bg-primary/10 text-primary-light'
                  : 'text-text-tertiary hover:text-text-secondary'
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map((problem) => (
          <button
            key={problem.id}
            onClick={() => setSelectedId(problem.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-2',
              selectedId === problem.id
                ? 'bg-primary/5 border-l-primary'
                : 'border-l-transparent hover:bg-white/[0.02]'
            )}
          >
            {statusIcon[problem.status]}
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{problem.title}</div>
            </div>
            <Badge
              variant={
                problem.difficulty === 'Easy'
                  ? 'easy'
                  : problem.difficulty === 'Medium'
                  ? 'medium'
                  : 'hard'
              }
            >
              {problem.difficulty}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  )
}

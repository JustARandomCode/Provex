import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'

interface CourseCardProps {
  id: string
  title: string
  description: string
  language: string
  icon: string
  totalProblems: number
  completedProblems: number
  tags: string[]
}

export function CourseCard({
  title,
  description,
  language,
  icon,
  totalProblems,
  completedProblems,
  tags,
}: CourseCardProps) {
  const percent = Math.round((completedProblems / totalProblems) * 100)

  return (
    <Link to="/coding/editor">
      <Card hoverable glow className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl">
            {icon}
          </div>
          <Badge variant="purple">{language}</Badge>
        </div>

        <h3 className="text-base font-bold text-white mb-1">{title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed mb-4 flex-1">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="default" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-text-secondary">
              {completedProblems}/{totalProblems} problems
            </span>
            <span className="font-medium text-primary-light">{percent}%</span>
          </div>
          <ProgressBar value={completedProblems} max={totalProblems} color="primary" size="sm" />
        </div>
      </Card>
    </Link>
  )
}

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  avatar_url?: string
  hint_credits: number
  hint_credits_used: number
  total_points: number
  streak_days: number
  created_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  language: string
  icon: string
  total_problems: number
  completed_problems: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  tags: string[]
}

export interface Problem {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  status: 'solved' | 'attempted' | 'unsolved'
  points: number
  course_id: string
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  starter_code: string
}

export interface Submission {
  id: string
  problem_id: string
  code: string
  language: string
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit' | 'Runtime Error' | 'Pending'
  runtime_ms?: number
  memory_mb?: number
  passed_tests: number
  total_tests: number
  created_at: string
}

export interface Hint {
  id: string
  level: number
  cost: number
  content: string
  unlocked: boolean
}

export interface StudyTopic {
  id: string
  title: string
  icon: string
  description: string
  lesson_count: number
}

export interface Lesson {
  id: string
  topic_id: string
  title: string
  sections: LessonSection[]
  quiz_id?: string
}

export interface LessonSection {
  id: string
  title: string
  content: string
  type: 'text' | 'code' | 'quiz' | 'summary'
  completed: boolean
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_index: number
  explanation: string
  hint?: string
  hint_cost: number
}

export interface QuizResult {
  total_questions: number
  correct_answers: number
  score_percent: number
  time_taken_seconds: number
  points_earned: number
}

export interface LeaderboardEntry {
  rank: number
  user: {
    id: string
    name: string
    avatar_url?: string
  }
  points: number
  streak: number
}

export interface Mission {
  id: string
  title: string
  completed: boolean
  points: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  stars: 1 | 2 | 3
  unlocked: boolean
  icon: string
}

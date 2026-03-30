import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ActiveCourseBar } from '../components/coding/ActiveCourseBar'
import { CourseCard } from '../components/coding/CourseCard'
import { GlowOrbs } from '../components/ui/GlowOrbs'
import { Swords } from 'lucide-react'

const courses = [
  {
    id: '1',
    title: 'Python Fundamentals',
    description: 'Master the basics of Python programming — variables, loops, functions, and OOP concepts.',
    language: 'Python',
    icon: '\u{1F40D}',
    totalProblems: 40,
    completedProblems: 30,
    tags: ['Beginner', 'Variables', 'Loops', 'Functions'],
  },
  {
    id: '2',
    title: 'JavaScript Mastery',
    description: 'Deep dive into modern JavaScript — closures, promises, async/await, and ES6+ features.',
    language: 'JavaScript',
    icon: '\u{1F4DC}',
    totalProblems: 35,
    completedProblems: 14,
    tags: ['Intermediate', 'Closures', 'Async', 'ES6+'],
  },
  {
    id: '3',
    title: 'C++ Algorithms',
    description: 'Solve classic algorithm problems in C++ — sorting, searching, dynamic programming, and graphs.',
    language: 'C++',
    icon: '\u{2699}\u{FE0F}',
    totalProblems: 50,
    completedProblems: 10,
    tags: ['Advanced', 'Sorting', 'DP', 'Graphs'],
  },
  {
    id: '4',
    title: 'Data Structures Deep Dive',
    description: 'Implement and understand core data structures — linked lists, trees, heaps, and hash maps.',
    language: 'Python',
    icon: '\u{1F333}',
    totalProblems: 30,
    completedProblems: 5,
    tags: ['Intermediate', 'Trees', 'Heaps', 'Hash Maps'],
  },
]

export function CodingArenaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-base relative">
      <GlowOrbs variant="subtle" />
      <Navbar />
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Swords className="w-6 h-6 text-primary-light" />
            <h1 className="text-2xl font-bold text-white">Choose Your Battleground</h1>
          </div>
          <p className="text-sm text-text-secondary mb-8">
            Select a course and start solving problems. Track your progress and earn points.
          </p>

          <div className="mb-8">
            <h2 className="text-sm font-semibold text-text-secondary mb-3">Active Courses</h2>
            <ActiveCourseBar />
          </div>

          <div className="mb-4">
            <h2 className="text-sm font-semibold text-text-secondary mb-3">All Courses</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

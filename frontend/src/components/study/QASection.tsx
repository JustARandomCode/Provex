import { useState } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

const qaItems = [
  {
    question: 'What happens when two keys hash to the same index?',
    answer:
      'This is called a collision. There are several strategies to handle collisions: chaining (using linked lists at each bucket), open addressing (probing for the next empty slot), or double hashing. Python dictionaries use open addressing with a probing scheme.',
  },
  {
    question: 'When should I use a hash map vs a balanced BST?',
    answer:
      'Use a hash map when you need O(1) average-case lookups and don\'t need ordered data. Use a BST (like TreeMap in Java) when you need ordered keys, range queries, or guaranteed O(log n) worst-case performance.',
  },
  {
    question: 'How does resizing work in a hash map?',
    answer:
      'When the load factor exceeds a threshold (typically 0.75), the hash map doubles its capacity and rehashes all existing entries into the new, larger array. This operation is O(n) but happens infrequently enough that amortized insertion is still O(1).',
  },
]

export function QASection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="max-w-3xl mx-auto px-6 pb-8">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-primary-light" />
        <h2 className="text-lg font-semibold text-white">Questions and Answers</h2>
      </div>

      <div className="space-y-2">
        {qaItems.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border-subtle overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between px-4 py-3 bg-surface hover:bg-elevated transition-colors text-left"
            >
              <span className="text-sm font-medium text-white pr-4">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-text-tertiary flex-shrink-0 transition-transform',
                  openIndex === idx && 'rotate-180'
                )}
              />
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                openIndex === idx ? 'max-h-[300px]' : 'max-h-0'
              )}
            >
              <div className="px-4 py-3 text-sm text-text-secondary leading-relaxed border-t border-border-subtle">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

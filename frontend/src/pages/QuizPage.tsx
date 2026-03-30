import { useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { QuizHeader } from '../components/quiz/QuizHeader'
import { QuizOption } from '../components/quiz/QuizOption'
import { HintUnlockModal } from '../components/quiz/HintUnlockModal'
import { QuizResult } from '../components/quiz/QuizResult'
import { Button } from '../components/ui/Button'
import { Lightbulb, ArrowRight } from 'lucide-react'

const questions = [
  {
    question: 'What is the average time complexity of a hash map lookup?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
    correctIndex: 2,
  },
  {
    question: 'What causes a hash collision?',
    options: [
      'When a key is null',
      'When two keys hash to the same index',
      'When the hash map is empty',
      'When the load factor is 0',
    ],
    correctIndex: 1,
  },
  {
    question: 'What is the typical load factor threshold for resizing?',
    options: ['0.25', '0.50', '0.75', '1.00'],
    correctIndex: 2,
  },
  {
    question: 'Which of these cannot be used as a hash map key in Python?',
    options: ['String', 'Integer', 'Tuple', 'List'],
    correctIndex: 3,
  },
  {
    question: 'What is the worst-case time complexity of hash map operations?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    correctIndex: 2,
  },
]

type AnswerState = 'correct' | 'wrong' | 'unanswered'

export function QuizPage() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [answers, setAnswers] = useState<AnswerState[]>(
    Array(questions.length).fill('unanswered')
  )
  const [showHintModal, setShowHintModal] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = questions[currentQ]

  const handleSelect = (idx: number) => {
    if (isSubmitted) return
    setSelectedOption(idx)
  }

  const handleSubmit = () => {
    if (selectedOption === null) return

    const isCorrect = selectedOption === currentQuestion.correctIndex
    const newAnswers = [...answers]
    newAnswers[currentQ] = isCorrect ? 'correct' : 'wrong'
    setAnswers(newAnswers)
    setIsSubmitted(true)
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1)
      setSelectedOption(null)
      setIsSubmitted(false)
    } else {
      setShowResults(true)
    }
  }

  const getOptionState = (idx: number) => {
    if (!isSubmitted) {
      return selectedOption === idx ? 'selected' as const : 'default' as const
    }
    if (idx === currentQuestion.correctIndex) return 'correct' as const
    if (idx === selectedOption) return 'wrong' as const
    return 'default' as const
  }

  if (showResults) {
    const correctCount = answers.filter((a) => a === 'correct').length
    return (
      <div className="min-h-screen bg-base">
        <Navbar />
        <QuizResult
          score={correctCount}
          total={questions.length}
          timeTaken="2:34"
          pointsEarned={correctCount * 10}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base flex flex-col">
      <Navbar />
      <QuizHeader
        currentQuestion={currentQ + 1}
        totalQuestions={questions.length}
        timeRemaining="4:26"
        answers={answers}
      />

      <div className="flex-1 flex items-start justify-center pt-12 pb-8 px-6">
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-8">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, idx) => (
              <QuizOption
                key={idx}
                index={idx}
                text={option}
                state={getOptionState(idx)}
                onClick={() => handleSelect(idx)}
                disabled={isSubmitted}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHintModal(true)}
              className="text-accent-gold"
            >
              <Lightbulb className="w-4 h-4" />
              Use Hint
            </Button>

            {!isSubmitted ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedOption === null}
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {currentQ < questions.length - 1 ? 'Next Question' : 'See Results'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {isSubmitted && (
            <div className="mt-6 p-4 rounded-xl border border-border-subtle bg-surface">
              <p className="text-sm text-text-secondary leading-relaxed">
                {answers[currentQ] === 'correct' ? (
                  <span className="text-accent-green font-medium">Correct! </span>
                ) : (
                  <span className="text-danger font-medium">Incorrect. </span>
                )}
                The answer is "{currentQuestion.options[currentQuestion.correctIndex]}".
                Hash maps achieve O(1) average time through their hashing mechanism.
              </p>
            </div>
          )}
        </div>
      </div>

      {showHintModal && (
        <HintUnlockModal
          hintLevel={1}
          cost={1}
          creditsRemaining={12}
          onUnlock={() => setShowHintModal(false)}
          onClose={() => setShowHintModal(false)}
        />
      )}
    </div>
  )
}

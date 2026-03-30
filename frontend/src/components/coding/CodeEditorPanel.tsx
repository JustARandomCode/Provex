import { useState } from 'react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { RotateCcw, Play, Send } from 'lucide-react'

const starterCode = `def merge_intervals(intervals):
    """
    Given an array of intervals where intervals[i] = [start_i, end_i],
    merge all overlapping intervals and return an array of the
    non-overlapping intervals that cover all the intervals in the input.

    Example:
        Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
        Output: [[1,6],[8,10],[15,18]]
    """
    if not intervals:
        return []

    # Sort intervals by start time
    intervals.sort(key=lambda x: x[0])

    merged = [intervals[0]]

    for current in intervals[1:]:
        # Your code here
        pass

    return merged`

export function CodeEditorPanel() {
  const [code, setCode] = useState(starterCode)
  const [language] = useState('Python')

  return (
    <div className="flex flex-col h-full bg-base">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-surface">
        <div className="flex items-center gap-3">
          <Badge variant="purple">{language}</Badge>
          <span className="text-sm text-white font-medium">Merge Intervals</span>
          <Badge variant="medium">Medium</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="points">+20 PTS</Badge>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-border-subtle bg-surface/50 text-sm">
        <p className="text-text-secondary leading-relaxed">
          Given an array of intervals where <code className="text-primary-light bg-primary/10 px-1.5 py-0.5 rounded text-xs">intervals[i] = [start_i, end_i]</code>,
          merge all overlapping intervals and return an array of the non-overlapping intervals.
        </p>
        <div className="mt-3 p-3 rounded-lg bg-elevated border border-border-subtle">
          <div className="text-xs text-text-tertiary mb-1">Example:</div>
          <div className="text-xs font-mono text-accent-green">
            Input: [[1,3],[2,6],[8,10],[15,18]]
          </div>
          <div className="text-xs font-mono text-accent-blue">
            Output: [[1,6],[8,10],[15,18]]
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-surface/50 border-r border-border-subtle flex flex-col items-end pr-2 pt-4 text-xs text-text-tertiary font-mono select-none overflow-hidden">
          {code.split('\n').map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full bg-transparent text-sm font-mono text-white pl-14 pr-4 pt-4 resize-none focus:outline-none leading-6"
          spellCheck={false}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle bg-surface">
        <Button variant="ghost" size="sm" className="text-text-secondary">
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Play className="w-3.5 h-3.5" />
            Run
          </Button>
          <Button size="sm" variant="green">
            <Send className="w-3.5 h-3.5" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Sparkles } from 'lucide-react'

interface PromptInputProps {
  onSubmit?: (text: string) => void
}

export function PromptInput({ onSubmit }: PromptInputProps) {
  const [text, setText] = useState('')

  return (
    <div className="relative">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What do you want to learn? e.g., 'Explain how neural networks work' or 'Teach me about distributed systems'"
        className="w-full h-32 bg-surface border border-border-subtle rounded-xl px-5 py-4 text-sm text-white placeholder:text-text-tertiary resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <span className="text-xs text-text-tertiary">{text.length}/500</span>
        <button
          onClick={() => onSubmit?.(text)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-[#C084FC] text-white text-xs font-semibold hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Generate
        </button>
      </div>
    </div>
  )
}

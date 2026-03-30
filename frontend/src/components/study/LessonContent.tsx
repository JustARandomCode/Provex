import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react'
import { cn } from '../../lib/cn'

export function LessonContent() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      <h1 className="text-2xl font-bold text-white mb-2">
        Understanding Hash Maps
      </h1>
      <p className="text-sm text-text-secondary mb-8">
        A comprehensive guide to hash map data structures, their implementation, and practical applications.
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-primary/10 text-primary-light text-xs flex items-center justify-center font-bold">
            1
          </span>
          Introduction
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          A hash map (also called a hash table) is a data structure that implements an associative array,
          a structure that can map keys to values. It uses a hash function to compute an index into an array
          of buckets or slots, from which the desired value can be found.
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          Hash maps provide <strong className="text-white">O(1) average time complexity</strong> for
          insertions, deletions, and lookups, making them one of the most widely used data structures
          in software engineering.
        </p>
      </section>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8">
        <h3 className="text-sm font-semibold text-primary-light mb-2">Key Concepts</h3>
        <ul className="space-y-1.5 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-primary-light mt-0.5">*</span>
            <span><strong className="text-white">Hash Function:</strong> Converts a key into an array index</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-light mt-0.5">*</span>
            <span><strong className="text-white">Collision:</strong> When two keys hash to the same index</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-light mt-0.5">*</span>
            <span><strong className="text-white">Load Factor:</strong> Ratio of entries to bucket count</span>
          </li>
        </ul>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-primary/10 text-primary-light text-xs flex items-center justify-center font-bold">
            2
          </span>
          Implementation
        </h2>
        <CodeBlock
          language="python"
          code={`class HashMap:
    def __init__(self, capacity=16):
        self.capacity = capacity
        self.size = 0
        self.buckets = [[] for _ in range(capacity)]

    def _hash(self, key):
        return hash(key) % self.capacity

    def put(self, key, value):
        index = self._hash(key)
        bucket = self.buckets[index]

        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return

        bucket.append((key, value))
        self.size += 1

    def get(self, key, default=None):
        index = self._hash(key)
        bucket = self.buckets[index]

        for k, v in bucket:
            if k == key:
                return v
        return default`}
        />
      </section>

      <CollapsibleSection title="Common Pitfalls">
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-danger">1.</span>
            <span><strong className="text-white">Using mutable keys:</strong> Lists and dicts cannot be used as hash map keys because they are mutable.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-danger">2.</span>
            <span><strong className="text-white">Ignoring load factor:</strong> A high load factor leads to more collisions and degraded performance.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-danger">3.</span>
            <span><strong className="text-white">Poor hash functions:</strong> A bad hash function causes clustering, reducing O(1) to O(n).</span>
          </li>
        </ul>
      </CollapsibleSection>

      <div className="mt-8 bg-accent-green/5 border border-accent-green/20 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-accent-green mb-2">Summary</h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          Hash maps are fundamental data structures that provide near-constant time operations.
          Understanding how they work under the hood &mdash; including hash functions, collision
          resolution, and resizing &mdash; is essential for writing efficient code and acing
          technical interviews.
        </p>
      </div>
    </div>
  )
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-border-subtle overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-elevated border-b border-border-subtle">
        <span className="text-xs text-text-tertiary font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-text-tertiary hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-accent-green" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto bg-base">
        <code className="text-xs font-mono text-text-secondary leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  )
}

function CollapsibleSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-border-subtle overflow-hidden mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface hover:bg-elevated transition-colors"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        {open ? (
          <ChevronDown className="w-4 h-4 text-text-tertiary" />
        ) : (
          <ChevronRight className="w-4 h-4 text-text-tertiary" />
        )}
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          open ? 'max-h-[500px] p-4' : 'max-h-0 p-0'
        )}
      >
        {children}
      </div>
    </div>
  )
}

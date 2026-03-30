import { useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/cn'

const supportedTypes = ['PDF', 'TXT', 'DOCX', 'MD', 'PPTX']

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<{ name: string; size: string }[]>([])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setFiles((prev) => [...prev, { name: 'lecture-notes.pdf', size: '2.4 MB' }])
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() =>
          setFiles((prev) => [...prev, { name: 'algorithms-chapter-3.pdf', size: '1.8 MB' }])
        }
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border-subtle hover:border-primary/30 hover:bg-primary/[0.02]'
        )}
      >
        <Upload
          className={cn(
            'w-8 h-8 mx-auto mb-3',
            isDragging ? 'text-primary-light' : 'text-text-tertiary'
          )}
        />
        <p className="text-sm text-white font-medium mb-1">
          Drop your files here or click to browse
        </p>
        <p className="text-xs text-text-tertiary mb-4">
          Upload study materials to generate AI-powered lessons
        </p>

        <div className="flex items-center justify-center gap-2">
          {supportedTypes.map((type) => (
            <Badge key={type} variant="default" className="text-[10px]">
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface border border-border-subtle"
            >
              <FileText className="w-4 h-4 text-primary-light flex-shrink-0" />
              <span className="text-sm text-white flex-1 truncate">{file.name}</span>
              <span className="text-xs text-text-tertiary">{file.size}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setFiles((prev) => prev.filter((_, i) => i !== idx))
                }}
                className="text-text-tertiary hover:text-danger transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

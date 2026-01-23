import { useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled: boolean
}

export const ChatInput = ({ value, onChange, onSend, disabled }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'

      // Set the height based on content
      const scrollHeight = textarea.scrollHeight
      if (scrollHeight > 0) {
        textarea.style.height = `${scrollHeight}px`
      }
    }
  }, [value])

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border p-2 sm:p-3 md:p-4 z-[100]">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-end gap-2 sm:gap-3 bg-dark-bg rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-2 sm:py-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 border border-dark-border/50">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan Anda..."
              rows={1}
              disabled={disabled}
              style={{
                height: 'auto',
                minHeight: '24px',
                maxHeight: '150px'
              }}
              className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-dark-text placeholder:text-dark-muted resize-none overflow-y-auto py-1 leading-relaxed"
            />
            <button
              onClick={onSend}
              disabled={disabled || !value.trim()}
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:opacity-50 text-white flex items-center justify-center text-base sm:text-lg md:text-xl transition-all duration-200 flex-shrink-0 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-md"
              style={{ paddingBottom: '2px' }}
            >
              ➤
            </button>
        </div>
      </div>
    </footer>
  )
}

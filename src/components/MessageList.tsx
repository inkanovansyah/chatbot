import { useRef, useEffect } from 'react'
import type { Message } from '../types'
import { MessageItem } from './MessageItem'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  return (
    <main className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 scroll-smooth" style={{ marginTop: '70px', marginBottom: '90px', paddingBottom: 'max(env(safe-area-inset-bottom), 90px)' }}>
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-4xl mb-5 shadow-xl">
            🤖
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">Selamat datang di Phi-Five Bot! 👋</h2>
          <p className="text-sm sm:text-base text-dark-muted mb-2">Saya adalah asisten AI yang siap membantu Anda.</p>
          <p className="text-sm sm:text-base text-dark-muted">Ketik pesan Anda di bawah untuk memulai percakapan.</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {messages.map((message, index) => (
            <MessageItem
              key={index}
              message={message}
              time={formatTime(new Date())}
            />
          ))}
        </div>
      )}
      {isLoading && (
        <div className="flex gap-2 items-start w-full justify-start">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-base sm:text-lg flex-shrink-0">
            🤖
          </div>
          <div className="px-4 py-3 bg-primary text-white rounded-2xl rounded-tl-sm">
            <p className="text-sm sm:text-base opacity-80 animate-pulse">Sedang berpikir...</p>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </main>
  )
}

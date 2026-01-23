import type { Message } from '../types'

interface MessageItemProps {
  message: Message
  time: string
}

export const MessageItem = ({ message, time }: MessageItemProps) => {
  return (
    <div
      className={`flex gap-2 items-start w-full ${
        message.role === 'assistant' ? 'justify-start' : 'justify-end'
      }`}
    >
      {message.role === 'assistant' && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-base sm:text-lg flex-shrink-0">
          🤖
        </div>
      )}
      <div className={`px-4 py-3 max-w-[85%] sm:max-w-[75%] md:max-w-[65%] ${
        message.role === 'assistant'
          ? 'bg-primary text-white rounded-2xl rounded-tl-sm'
          : 'bg-dark-card text-dark-text border border-dark-border rounded-2xl rounded-tr-sm'
      }`}>
        <p className="text-sm sm:text-base whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</p>
        <span className={`text-xs mt-2 block ${
          message.role === 'assistant' ? 'text-white/70' : 'text-dark-muted'
        }`}>
          {time}
        </span>
      </div>
      {message.role === 'user' && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-dark-border flex items-center justify-center text-base sm:text-lg flex-shrink-0 order-last">
          👤
        </div>
      )}
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import './index.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Halo! Saya BG23 Bot 🤖\n\nSaya adalah asisten AI cerdas yang baru dikembangkan nama model adalah Borneo.AI'
  }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const conversationHistory = messages.map(m =>
        `${m.role === 'user' ? 'User' : 'Bot'}: ${m.content}`
      ).join('\n')

      const prompt = `${conversationHistory}\nUser: ${input.trim()}\nBot:`

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Response:', errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('API Data:', data)

      let botResponse = 'Maaf, saya tidak dapat memproses pesan tersebut.'

      if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        botResponse = data[0].generated_text
      } else if (data.generated_text) {
        botResponse = data.generated_text
      }

      const lines = botResponse.split('\n').filter(line => line.trim())
      if (lines.length > 0) {
        botResponse = lines[0].trim()
      }

      if (botResponse.startsWith('Bot:')) {
        botResponse = botResponse.substring(5).trim()
      }

      const botMessage: Message = {
        role: 'assistant',
        content: botResponse
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan koneksi ke AI. Pastikan API key sudah benar.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  return (
    <div className="w-full h-screen bg-dark-bg flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-dark-card border-b border-dark-border p-4 flex items-center justify-between z-50 max-w-md mx-auto w-full sm:rounded-b-2xl sm:shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
            🤖
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold text-primary">BG23 Bot</h1>
            <p className="text-xs sm:text-sm text-dark-muted">Chat with AI</p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-dark-bg hover:bg-dark-border flex items-center justify-center text-lg transition-all duration-200">
          ⚙️
        </button>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth mt-[72px] mb-[72px]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-4xl mb-5 shadow-xl">
                🤖
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">Selamat datang di BG23 Bot! 👋</h2>
              <p className="text-sm sm:text-base text-dark-muted mb-2">Saya adalah asisten AI yang siap membantu Anda.</p>
              <p className="text-sm sm:text-base text-dark-muted">Ketik pesan Anda di bawah untuk memulai percakapan.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 items-start w-full ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-base sm:text-lg flex-shrink-0">
                    🤖
                  </div>
                )}
                <div className={`px-4 py-3 ${
                  message.role === 'assistant'
                    ? 'bg-primary text-white rounded-2xl rounded-tl-sm'
                    : 'bg-dark-card text-dark-text border border-dark-border rounded-2xl rounded-tr-sm'
                }`}>
                  <p className="text-sm sm:text-base whitespace-pre-wrap">{message.content}</p>
                  <span className={`text-xs mt-2 block ${
                    message.role === 'assistant' ? 'text-white/70' : 'text-dark-muted'
                  }`}>
                    {formatTime(new Date())}
                  </span>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-dark-border flex items-center justify-center text-base sm:text-lg flex-shrink-0 order-last">
                    👤
                  </div>
                )}
              </div>
            ))
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
      </div>

      {/* Fixed Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border p-3 sm:p-4 z-50 max-w-md mx-auto w-full sm:rounded-t-2xl sm:shadow-lg">
        <div className="flex items-end gap-2 sm:gap-3 bg-dark-bg rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-dark-text placeholder:text-dark-muted resize-none max-h-24 overflow-y-auto"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:opacity-50 text-white flex items-center justify-center text-base sm:text-lg transition-all duration-200 flex-shrink-0 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              ➤
            </button>
        </div>
      </div>
    </div>
  )
}

export default App

import { useState, useRef, useEffect } from 'react'
import './App.css'

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
      // Format prompt untuk model conversational
      const conversationHistory = messages.map(m =>
        `${m.role === 'user' ? 'User' : 'Bot'}: ${m.content}`
      ).join('\n')

      const prompt = `${conversationHistory}\nUser: ${input.trim()}\nBot:`

      // Panggil backend API (Vercel serverless atau local proxy)
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

      // Handle response format dari Hugging Face
      let botResponse = 'Maaf, saya tidak dapat memproses pesan tersebut.'

      if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        botResponse = data[0].generated_text
      } else if (data.generated_text) {
        botResponse = data.generated_text
      }

      // Bersihkan response
      const lines = botResponse.split('\n').filter(line => line.trim())
      if (lines.length > 0) {
        botResponse = lines[0].trim()
      }

      // Hapus "Bot:" prefix jika ada
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
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <div className="bot-avatar-header">🤖</div>
          <div className="header-text">
            <h1>BG23 Bot</h1>
            <p>Chat with AI</p>
          </div>
        </div>
        <div className="header-right">
          <button className="settings-icon">⚙️</button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-avatar">🤖</div>
            <h2>Selamat datang di BG23 Bot! 👋</h2>
            <p>Saya adalah asisten AI yang siap membantu Anda.</p>
            <p>Ketik pesan Anda di bawah untuk memulai percakapan.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              {message.role === 'assistant' && (
                <div className="message-avatar bot-avatar">🤖</div>
              )}
              <div className="message-bubble">
                <p className="message-text">{message.content}</p>
                <span className="message-time">{formatTime(new Date())}</span>
              </div>
              {message.role === 'user' && (
                <div className="message-avatar user-avatar">👤</div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar bot-avatar">🤖</div>
            <div className="message-bubble">
              <p className="message-text typing">Sedang berpikir...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            rows={1}
            disabled={isLoading}
            className="chat-input"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="send-button"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

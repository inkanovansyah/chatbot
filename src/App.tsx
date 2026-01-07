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

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>🤖 BG23 Bot</h1>
        <p>Curhat aja gpp</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h2>Selamat datang di BG23 Bot! 👋</h2>
            <p>Saya adalah asisten AI yang siap membantu Anda.</p>
            <p>Ketik pesan Anda di bawah untuk memulai percakapan.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">
                <strong>{message.role === 'user' ? '👤 Anda' : '🤖 BG23 Bot'}</strong>
                <p>{message.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <strong>🤖 BG23 Bot</strong>
              <p className="typing">Sedang Berpikir...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pesan Anda di sini... (Enter untuk kirim, Shift+Enter untuk baris baru)"
          rows={2}
          disabled={isLoading}
          className="chat-input"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="send-button"
        >
          {isLoading ? '⏳' : 'Kirim 📤'}
        </button>
      </div>

      <div className="chat-footer">
        <p><b>BG23 bot</b></p>
      </div>
    </div>
  )
}

export default App

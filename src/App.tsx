import { useState } from 'react'
import './index.css'
import { Header, MessageList, ChatInput } from './components'
import type { Message } from './types'

function App() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Halo! Saya Phi-Five Bot 🤖\n\nSaya adalah asisten AI cerdas yang baru dikembangkan nama model adalah Borneo.AI'
  }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      const conversationHistory = messages.map(m =>
        `${m.role === 'user' ? 'User' : 'Bot'}: ${m.content}`
      ).join('\n')

      const prompt = `${conversationHistory}\nUser: ${userInput}\nBot:`

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

  return (
    <div className="w-full h-screen bg-dark-bg flex flex-col">
      <Header />
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        disabled={isLoading}
      />
    </div>
  )
}

export default App

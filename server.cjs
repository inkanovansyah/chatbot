const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Groq API Key
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Simple AI responses (fallback)
const simpleResponses = {
  greetings: ["Halo! Saya Inka Bot! Ada yang bisa saya bantu? 😊", "Hai! Senang bertemu Anda! Apa yang ingin Anda diskusikan?", "Hello! Selamat datang!"],
  identity: ["Saya Inka Bot, chatbot AI yang dibuat dengan"],
  thanks: ["Sama-sama! Senang bisa membantu! 😊", "You're welcome! Ada lagi yang ingin Anda tanyakan?"],
  default: [
    "Menarik! Ceritakan lebih lanjut! 🤔",
    "Hmm, pertanyaan yang bagus! Ada hal spesifik yang ingin Anda tanyakan?",
    "Saya mengerti! Ada lagi yang ingin Anda diskusikan?",
    "Terima kasih sudah berbagi! Ada pertanyaan lain?"
  ]
  
};

function getSimpleResponse(prompt) {
  const lower = prompt.toLowerCase();

  if (lower.includes('halo') || lower.includes('hai') || lower.includes('hello')) {
    return simpleResponses.greetings[Math.floor(Math.random() * simpleResponses.greetings.length)];
  }
  if (lower.includes('siapa kamu') || lower.includes('siapa')) {
    return simpleResponses.identity[Math.floor(Math.random() * simpleResponses.identity.length)];
  }
  if (lower.includes('terima kasih') || lower.includes('thanks')) {
    return simpleResponses.thanks[Math.floor(Math.random() * simpleResponses.thanks.length)];
  }

  return simpleResponses.default[Math.floor(Math.random() * simpleResponses.default.length)];
}

// Chat endpoint dengan Groq API + fallback ke Simple AI
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log(`\n📨 User message: ${prompt}`);

    // Coba gunakan Groq API
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'Anda adalah Inka Bot, asisten AI yang ramah, cerdas, dan profesional. Anda dibuat dengan React, Vite, dan TypeScript. Jawab dengan bahasa Indonesia yang santai tapi sopan. Berikan jawaban yang detail, membantu, dan informatif. Gunakan emoji sesekali agar lebih menarik.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botResponse = data.choices[0].message.content;
        console.log(`✅ Groq response: ${botResponse.substring(0, 50)}...\n`);

        return res.json({
          generated_text: botResponse
        });
      } else {
        throw new Error('Groq API failed');
      }
    } catch (apiError) {
      console.log(`⚠️  API Error, using Simple AI fallback`);
      console.log(`   Error: ${apiError.message}\n`);

      // Fallback ke Simple AI
      const simpleResponse = getSimpleResponse(prompt);

      return res.json({
        generated_text: simpleResponse
      });
    }

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════╗`);
  console.log(`║       🤖 INKA BOT - HYBRID AI SYSTEM 🤖         ║`);
  console.log(`╠════════════════════════════════════════════════╣`);
  console.log(`║  Status:     ✅ ONLINE                         ║`);
  console.log(`║  Port:       ${PORT}                               ║`);
  console.log(`║  URL:        http://localhost:${PORT}             ║`);
  console.log(`║  AI:         Groq Llama 3.3 + Simple AI         ║`);
  console.log(`║  API Key:    ✅ Loaded (Groq)                   ║`);
  console.log(`╚════════════════════════════════════════════════╝`);
  console.log(`\n🚀 Inka Bot siap!`);
  console.log(`💬 Buka http://localhost:5173`);
  console.log(`\n✨ Mode: Groq API dengan fallback Simple AI`);
  console.log(`   (Gratis & super cepat!)\n`);
});

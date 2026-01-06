// Vercel Serverless Function untuk Inka Bot
// Note: fetch is built-in in Node.js 18+ (Vercel)

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`📨 User message: ${prompt}`);

    // Simple AI responses (fallback)
    const simpleResponses = {
      greetings: ["Halo! Saya Inka Bot! Ada yang bisa saya bantu? 😊", "Hai! Senang bertemu Anda! Apa yang ingin Anda diskusikan?", "Hello! Selamat datang!"],
      identity: ["Saya Inka Bot, chatbot AI yang dibuat dengan React, Vite, dan TypeScript! 🚀", "Saya Inka Bot, asisten AI pribadi Anda!"],
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

    // Coba gunakan Groq API
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
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

        return res.status(200).json({
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

      return res.status(200).json({
        generated_text: simpleResponse
      });
    }

  } catch (error) {
    console.error('❌ Server Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

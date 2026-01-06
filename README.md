# 🤖 Inka Bot

Aplikasi chatbot lengkap yang dibuat dengan Vite + React + TypeScript menggunakan Hugging Face AI.

## ✨ Fitur

- 💬 Chatbot interaktif dengan Hugging Face AI
- 🎨 UI modern dan responsif
- ⚡ Dibangun dengan Vite untuk performa cepat
- 🔷 TypeScript untuk type safety
- 📱 Responsive design untuk mobile dan desktop

## 🚀 Cara Mendapatkan API Key Hugging Face (Gratis)

1. Kunjungi [https://huggingface.co/](https://huggingface.co/)
2. Sign up atau login ke akun Anda
3. Pergi ke [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
4. Klik "New token"
5. Beri nama token (contoh: "inka-bot")
6. Pilih type "Read"
7. Klik "Generate token"
8. Copy token yang muncul (simpan token ini, tidak akan ditampilkan lagi)

## 📦 Instalasi

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
# Copy file .env.example ke .env
copy .env.example .env
```

3. Edit file `.env` dan masukkan API key Hugging Face Anda:
```
VITE_HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🎯 Menjalankan Aplikasi

Development mode:
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

Build untuk production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🎨 Fitur UI

- **Header**: Nama bot "Inka Bot" dengan gradient yang menarik
- **Chat Area**:
  - Pesan user di sebelah kanan dengan gradient ungu
  - Pesan bot di sebelah kiri dengan background putih
  - Auto scroll ke pesan terbaru
  - Animasi slide-in untuk setiap pesan baru
- **Input Area**: Textarea dengan auto-resize dan tombol kirim
- **Loading State**: Indikator "Sedang mengetik..." saat bot memproses
- **Welcome Message**: Pesan selamat datang saat belum ada chat
- **Responsive**: Tampilan optimal di desktop dan mobile

## 🛠️ Tech Stack

- [Vite](https://vitejs.dev/) - Build tool dan dev server
- [React 18](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Hugging Face Inference API](https://huggingface.co/inference-api) - AI model
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) - Styling

## 📝 Cara Menggunakan

1. Buka aplikasi di browser
2. Ketik pesan Anda di input field
3. Tekan Enter untuk kirim pesan
4. Inka Bot akan membalas menggunakan AI
5. Nikmati percakapan dengan bot!

## 🔧 Troubleshooting

**Bot tidak merespon?**
- Pastikan API key Hugging Face sudah benar
- Cek console browser untuk error message
- Pastikan internet connection stabil

**API key tidak valid?**
- Pastikan token sudah dibuat di Hugging Face
- Token harus dimulai dengan "hf_"
- Pastikan token memiliki permission "Read"

## 📄 License

MIT License - Bebas digunakan untuk project pribadi atau komersial

## 🤝 Kontribusi

Kontribusi sangat welcome! Silakan buat pull request atau issue.

---

Dibuat dengan ❤️ menggunakan Vite + React + Hugging Face

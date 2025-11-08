// Dokumentasi untuk index.js
// File ini adalah server backend untuk chatbot Gemini AI menggunakan Express.js dan Google GenAI.

// Mengimpor modul yang diperlukan
import 'dotenv/config'; // Mengimpor konfigurasi dari file .env untuk variabel lingkungan
import express from 'express'; // Framework web untuk Node.js
import cors from 'cors'; // Middleware untuk mengizinkan Cross-Origin Resource Sharing (CORS)
import { GoogleGenAI } from "@google/genai"; // Library untuk berinteraksi dengan Google Generative AI

// Membuat instance aplikasi Express
const app = express();

// Menginisialisasi Google GenAI dengan API key dari variabel lingkungan
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY // API key untuk akses ke Gemini AI, disimpan di .env untuk keamanan
});

// Menentukan model Gemini yang digunakan
const GEMINI_MODEL = 'gemini-2.5-flash'; // Model AI yang digunakan untuk menghasilkan respons

// Middleware untuk menangani CORS, memungkinkan permintaan dari domain berbeda
app.use(cors());

// Middleware untuk parsing body permintaan sebagai JSON
app.use(express.json());

// Middleware untuk menyajikan file statis dari folder 'public' (seperti HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint POST untuk '/api/chat' - menangani permintaan chat dari frontend
app.post('/api/chat', async (req, res) => {
  // Mengambil array pesan dari body permintaan
  const { messages } = req.body;

  try {
    // Validasi: pastikan messages adalah array
    if (!Array.isArray(messages)) throw new Error("Messages should be an array");

    // Mengubah format pesan menjadi format yang diharapkan oleh Google GenAI
    const contents = messages.map(({ role, text }) => ({
      role, // Role pesan (misalnya 'user')
      parts: [{ type: 'text', text }] // Bagian pesan sebagai teks
    }));

    // Mengirim permintaan ke model Gemini untuk menghasilkan konten
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL, // Model yang digunakan
      contents // Konten pesan yang dikirim
    });

    // Mengirim respons sukses dengan hasil dari AI
    res.status(200).json({ result: response.text });
  } catch (error) {
    // Menangani error dan mengirim respons error
    res.status(500).json({ error: error.message });
  }
});

// Menentukan port server, default 3000 jika tidak ada di environment
const PORT = process.env.PORT || 3000;

// Menjalankan server dan mencetak pesan di konsol
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

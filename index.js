import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const GEMINI_MODEL = 'gemini-2.5-flash';

app.use(express.json());

// Endpoint to generate text from a prompt
app.post('/generate-text', async (req, res) => {
  const {prompt} = req.body;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

// Endpoint to generate content from an image
app.post('/generate-from-image', upload.single('image'), async (req, res) => {
  const {prompt} = req.body;
  const base64Image = req.file.buffer.toString('base64');

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {text: prompt, type: "text"},
        {
            inlineData:{
                data: base64Image,
                mimeType: req.file.mimetype
            }
        }
      ]
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

// Endpoint to generate content from a document
app.post('/generate-from-document', upload.single('document'), async (req, res) => {
    const {prompt} = req.body;
    const base64Document = req.file.buffer.toString('base64');

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {text: prompt ?? "Tolong buat ringkasan dari dokumen berikut!", type: "text"},
          {
              inlineData:{
                  data: base64Document,
                  mimeType: req.file.mimetype
              }
          }
        ]
      });

      res.status(200).json({ result: response.text });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  });

// Endpoint to generate content from audio
app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
    const {prompt} = req.body;
    const base64Audio = req.file.buffer.toString('base64');

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {text: prompt ?? "Tolong buat transcript dari audio berikut!", type: "text"},
          {
              inlineData:{
                  data: base64Audio,
                  mimeType: req.file.mimetype
              }
          }
        ]
      });

      res.status(200).json({ result: response.text });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  });

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
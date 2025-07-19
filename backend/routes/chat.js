// routes/chat.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Ensure your .env file contains: GEMINI_API_KEY=your_api_key_here
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/', async (req, res) => {
  const { message } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ 
      error: 'Invalid message format',
      details: 'Message must be a non-empty string'
    });
  }
  
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key not found in environment variables');
    return res.status(500).json({ 
      error: 'Server configuration error',
      details: 'API key not configured'
    });
  }
  
  // Use correct endpoint for your chatbot API call.
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${GEMINI_API_KEY}`;
  
  const data = {
    contents: [
      {
        role: "user",
        parts: [{ text: message }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  try {
    console.log('Sending request to Gemini API with message:', message);
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Gemini API response received:', JSON.stringify(response.data, null, 2));
    if (!response.data.candidates || response.data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }
    const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (error) {
    console.error('Full error object:', error);
    console.error('Error response data:', error.response?.data);
    console.error('Error message:', error.message);
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: error.response?.data?.error?.message || error.message,
      fullError: error.response?.data || error.toString()
    });
  }
});

module.exports = router;

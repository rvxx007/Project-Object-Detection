// server/index.js
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// Set up file storage for images
const upload = multer({ dest: 'uploads/' });

// Object Detection Endpoint
app.post('/api/detect-object', upload.single('image'), async (req, res) => {
  try {
    const imagePath = path.resolve(req.file.path);
    
    // Call Google Cloud Vision API or any object detection API
    const response = await axios.post('https://vision.googleapis.com/v1/images:annotate', {
      // Google Vision API payload structure
      requests: [
        {
          image: { content: imagePath },
          features: [{ type: 'LABEL_DETECTION' }],
        },
      ],
    }, {
      headers: { Authorization: `Bearer ${process.env.GOOGLE_API_KEY}` },
    });

    const objectName = response.data.responses[0].labelAnnotations[0].description;
    res.json({ objectName });
  } catch (error) {
    console.error('Error in object detection:', error);
    res.status(500).send('Object detection failed');
  }
});

// Translation Endpoint
app.post('/api/translate', async (req, res) => {
  const { objectName, targetLang } = req.body;

  try {
    const response = await axios.post(`https://translation.googleapis.com/language/translate/v2`, {
      q: objectName,
      target: targetLang,
      key: process.env.GOOGLE_API_KEY,
    });

    const translation = response.data.data.translations[0].translatedText;
    res.json({ translation });
  } catch (error) {
    console.error('Error in translation:', error);
    res.status(500).send('Translation failed');
  }
});

// Pronunciation (Text-to-Speech) Endpoint
app.get('/api/pronunciation', async (req, res) => {
  const { word, langCode } = req.query;

  try {
    const response = await axios.post('https://texttospeech.googleapis.com/v1/text:synthesize', {
      input: { text: word },
      voice: { languageCode: langCode },
      audioConfig: { audioEncoding: 'MP3' },
    }, {
      headers: { Authorization: `Bearer ${process.env.GOOGLE_API_KEY}` },
    });

    const audioContent = response.data.audioContent;
    res.json({ audioUrl: `data:audio/mp3;base64,${audioContent}` });
  } catch (error) {
    console.error('Error in TTS:', error);
    res.status(500).send('Pronunciation failed');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const puppeteerCapture = require('../lib/puppeteerCapture');
const downloadAndConvertAudio = require('../lib/downloadAndConvertAudio');
const transcribeFree = require('../lib/transcribeFree');
const aiDetectionFree = require('../lib/aiDetectionFree');
const storage = require('../storage');

router.post('/', async (req, res) => {
  const youtubeUrl = req.body.youtubeUrl;
  if (!youtubeUrl) return res.status(400).json({ error: 'youtubeUrl required' });

  const id = uuidv4();
  const destDir = path.join(__dirname, '..', '..', 'data', id);
  fs.mkdirSync(destDir, { recursive: true });

  // respond quickly with id
  res.json({ id });

  // run heavy work in background of this request handler
  (async () => {
    try {
      // 1. screenshot
      const screenshotPath = path.join(destDir, 'screenshot.png');
      await puppeteerCapture(youtubeUrl, screenshotPath);

      // 2. download + convert audio -> wav
      const wavPath = path.join(destDir, 'audio.wav');
      await downloadAndConvertAudio(youtubeUrl, wavPath);

      // 3. transcription with FREE service (Whisper or mock)
      const transcription = await transcribeFree(wavPath);

      // 4. for each sentence, run FREE AI detection and append ai_probability
      for (let s of transcription.sentences || []) {
        const analysis = await aiDetectionFree.analyzeText(s.text);
        s.ai_probability = analysis.ai_probability;
        s.provider = analysis.provider;
        s.note = analysis.note;
      }

      // 5. persist JSON
      const result = {
        id,
        youtubeUrl,
        screenshot: `/data/${id}/screenshot.png`,
        audio: `/data/${id}/audio.wav`,
        transcription,
        createdAt: new Date().toISOString()
      };
      storage.saveResult(id, result);
      console.log('analysis complete', id);
    } catch (err) {
      console.error('analysis error', err);
      storage.saveResult(id, { error: err.message, createdAt: new Date().toISOString() });
    }
  })();
});

module.exports = router;

# Demo Setup Guide

## Quick Test Without API Keys

If you want to test the service without spending money on API keys, follow these steps:

### 1. Comment Out Expensive API Calls

Edit `src/routes/analyze.js` and comment out these lines:

```javascript
// Comment out these lines to avoid API costs:
// const transcription = await transcribeElevenLabs(wavPath);
// for (let s of transcription.sentences || []) {
//   const analysis = await gptzero.analyzeText(s.text);
//   s.ai_probability = analysis.ai_probability;
// }

// Replace with mock data:
const transcription = {
  sentences: [
    {
      text: "Demo transcription - API calls disabled to save costs",
      start: 0,
      end: 10,
      words: [],
      ai_probability: 0.5
    }
  ]
};
```

### 2. Test Core Functionality

The service will still:
- ✅ Take YouTube screenshots
- ✅ Download audio files
- ✅ Convert to WAV format
- ✅ Generate unique IDs
- ✅ Save results to disk

### 3. Run the Service

```bash
npm start
# or
docker-compose up --build
```

### 4. Test with a YouTube URL

Visit `http://localhost:8080` and paste any YouTube URL.

## What You'll Get

- Screenshot saved to `data/{id}/screenshot.png`
- Audio file saved to `data/{id}/audio.wav`
- Mock transcription data
- JSON result at `/result/{id}`

## Enable Full Features Later

When you're ready to use the full features:
1. Get API keys from ElevenLabs and GPTZero
2. Copy `env.sample` to `.env`
3. Add your actual API keys
4. Uncomment the API calls in the code

## Cost Estimates (as of 2024)

- **ElevenLabs**: $5-22/month depending on usage
- **GPTZero**: $0.01-0.10 per 1000 characters
- **Total**: $5-50/month for moderate usage

## Free Alternatives

- **Whisper**: Free local transcription (requires more setup)
- **Hugging Face**: Free tier available
- **OpenAI Whisper API**: Cheaper than ElevenLabs

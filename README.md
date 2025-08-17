# YouTube Analysis Node.js Service

## What this does

- Accepts YouTube URL via POST /analyze or the web form
- Puppeteer loads the page, attempts playback, saves a thumbnail screenshot
- Downloads audio with ytdl-core, pipes through ffmpeg to WAV 16kHz mono s16
- **FREE Transcription**: Uses OpenAI Whisper API (free tier) or generates mock data
- **FREE AI Detection**: Uses Hugging Face inference API (free tier) or smart heuristics
- Persists data in ./data/{id}/result.json and screenshot at ./data/{id}/screenshot.png
- GET /result/:id returns JSON

## Setup (local)

1. Install Node 18
2. Copy env.example to .env (API keys are optional - service works without them!)
3. npm install
4. Ensure ffmpeg and chromium are installed on your machine
   - Ubuntu: `sudo apt-get install ffmpeg chromium`
   - Windows: Install ffmpeg and add to PATH
   - macOS: `brew install ffmpeg chromium`
5. Start: `npm start`
6. Visit: http://localhost:8080

**🎉 The service now works completely FREE by default!**

## Docker

1. Create .env with keys
2. `docker-compose up --build -d`
3. Visit http://localhost:8080

## GCE deploy notes

1. Create VM with tag youtube-analyzer
2. Open firewall for port 8080:
   ```bash
   gcloud compute firewall-rules create allow-yta-8080 \
     --allow tcp:8080 \
     --target-tags youtube-analyzer \
     --description "Allow port 8080 to YouTube analysis service"
   ```
3. SSH port-forward fallback if firewall blocked:
   ```bash
   ssh -L 8080:localhost:8080 <USER>@<VM_EXTERNAL_IP> -i <your-key>
   ```
4. On VM install docker and run `docker-compose up -d`

## Endpoints

- **POST /analyze** - `{ youtubeUrl: "..." }` returns `{ id }`
- **GET /result/:id** - Returns analysis results

## Notes

- Replace ElevenLabs and GPTZero placeholders per provider docs
- Respect YouTube TOS and copyright rules
- The service responds immediately with an ID and processes the analysis in the background
- Check the result endpoint to see when analysis is complete

## 🆓 FREE Service - No API Costs Required!

**Great News!** This service now works completely FREE by default:

### **Free Services Included:**
- **🎯 Transcription**: OpenAI Whisper API (free tier available)
- **🤖 AI Detection**: Hugging Face inference API (free tier available)
- **📱 Mock Data**: Smart fallback when APIs are unavailable

### **Optional Premium Upgrades:**
- **ElevenLabs Scribe**: Better transcription quality (paid)
- **GPTZero**: Advanced AI detection (paid)

### **How to Get Free API Keys:**
1. **OpenAI**: Sign up at [openai.com](https://openai.com) - free tier available
2. **Hugging Face**: Sign up at [huggingface.co](https://huggingface.co) - free tier available

**The service works perfectly without any API keys!** 🎉

## Sample JSON Output

```json
{
  "id": "b3b1c8f3-xxxx-xxxx",
  "youtubeUrl": "https://www.youtube.com/watch?v=EXAMPLE",
  "screenshot": "/data/b3b1c8f3-xxxx-xxxx/screenshot.png",
  "audio": "/data/b3b1c8f3-xxxx-xxxx/audio.wav",
  "transcription": {
    "sentences": [
      {
        "text": "Hello and welcome to the video.",
        "start": 0.2,
        "end": 2.0,
        "words": [
          {"text":"Hello","start":0.2,"end":0.6,"speaker":0}
        ],
        "ai_probability": 0.12
      }
    ],
    "raw": { "providerResponse": "..." }
  },
  "createdAt": "2025-08-17T12:00:00.000Z"
}
```

## Troubleshooting

- **Puppeteer fails in docker**: Ensure chromium path matches `PUPPETEER_EXECUTABLE` in Dockerfile
- **ffmpeg missing**: Install ffmpeg on your system
- **Large audio uploads timing out**: Increase axios timeout where required
- **API keys not working**: Verify your ElevenLabs and GPTZero API keys are correct

## Quick Demo Setup

For users who want to test without API costs, see [demo-setup.md](./demo-setup.md) for detailed instructions on how to run the service with mock data.

## Project Structure

```
youtube-analysis-service/
├── src/
│   ├── server.js              # Main Express server
│   ├── routes/
│   │   └── analyze.js         # Analysis endpoint
│   ├── lib/
│   │   ├── puppeteerCapture.js    # Screenshot capture
│   │   ├── downloadAndConvertAudio.js  # Audio processing
│   │   ├── transcribeElevenLabs.js     # Transcription API
│   │   └── gptzero.js                 # AI detection API
│   └── storage.js             # Data persistence
├── public/
│   └── index.html             # Web interface
├── data/                      # Generated files (gitignored)
├── Dockerfile                 # Container setup
├── docker-compose.yml         # Easy deployment
└── README.md                  # This file
```

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Made with ❤️ for the YouTube analysis community**
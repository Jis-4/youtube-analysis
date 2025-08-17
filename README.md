# YouTube Analysis Node.js Service

## What this does

- Accepts YouTube URL via POST /analyze or the web form
- Puppeteer loads the page, attempts playback, saves a thumbnail screenshot
- Downloads audio with ytdl-core, pipes through ffmpeg to WAV 16kHz mono s16
- Sends WAV to ElevenLabs Scribe for transcription (word-level timestamps + speaker diarisation)
- Runs GPTZero on each sentence to append ai_probability
- Persists data in ./data/{id}/result.json and screenshot at ./data/{id}/screenshot.png
- GET /result/:id returns JSON

## Setup (local)

1. Install Node 18
2. Copy env.example to .env and set keys
3. npm install
4. Ensure ffmpeg and chromium are installed on your machine
   - Ubuntu: `sudo apt-get install ffmpeg chromium`
   - Windows: Install ffmpeg and add to PATH
   - macOS: `brew install ffmpeg chromium`
5. Start: `npm start`
6. Visit: http://localhost:8080

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

## ⚠️ IMPORTANT: API Key Costs Note

**Special Note for Users:** This service requires API keys from ElevenLabs and GPTZero, which involve subscription costs:

- **ElevenLabs Scribe**: Transcription service with various pricing tiers
- **GPTZero**: AI content detection service with usage-based pricing

**If you cannot afford these API costs**, you can:

1. Use the service without transcription (comment out the transcription calls)
2. Replace with free alternatives like:
   - **Whisper** (free, local transcription)
   - **OpenAI Whisper API** (cheaper than ElevenLabs)
   - **Hugging Face** (free tier available)
3. Mock the API responses for testing purposes

The core YouTube analysis (screenshots, audio download) will still work without these APIs.

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
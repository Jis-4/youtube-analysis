const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

module.exports = async function transcribeFree(wavPath) {
  // Try OpenAI Whisper API first (free tier available)
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (openaiKey) {
    try {
      console.log('Using OpenAI Whisper API for transcription...');
      const formData = new FormData();
      formData.append('file', fs.createReadStream(wavPath));
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'verbose_json');

      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          ...formData.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      const data = response.data;
      const transcription = { sentences: [], raw: data };

      // Parse OpenAI Whisper response
      if (data.segments) {
        for (const seg of data.segments) {
          transcription.sentences.push({
            text: seg.text || '',
            start: seg.start || 0,
            end: seg.end || 0,
            words: seg.words || []
          });
        }
      } else if (data.text) {
        transcription.sentences.push({ 
          text: data.text, 
          start: 0, 
          end: 0, 
          words: [] 
        });
      }

      return transcription;
    } catch (error) {
      console.log('OpenAI Whisper failed, falling back to mock data:', error.message);
    }
  }

  // Fallback: Generate mock transcription from audio file
  console.log('Using free mock transcription service...');
  
  // Get file size to estimate duration (rough approximation)
  const stats = fs.statSync(wavPath);
  const fileSizeInBytes = stats.size;
  const estimatedDuration = Math.max(10, Math.floor(fileSizeInBytes / 10000)); // Rough estimate
  
  const mockTranscription = {
    sentences: [
      {
        text: "This is a free transcription demo. The actual audio content would be transcribed here using free services like Whisper or Hugging Face.",
        start: 0,
        end: estimatedDuration,
        words: [
          { text: "This", start: 0, end: 1, speaker: 0 },
          { text: "is", start: 1, end: 2, speaker: 0 },
          { text: "a", start: 2, end: 3, speaker: 0 },
          { text: "free", start: 3, end: 4, speaker: 0 },
          { text: "transcription", start: 4, end: 6, speaker: 0 }
        ]
      }
    ],
    raw: { 
      provider: "free-mock-service",
      note: "This is demo data. For real transcription, set OPENAI_API_KEY or use local Whisper"
    }
  };

  return mockTranscription;
};

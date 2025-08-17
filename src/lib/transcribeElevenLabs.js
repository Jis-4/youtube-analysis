const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

module.exports = async function transcribeElevenLabs(wavPath) {
  // This is a template implementation.
  // Replace endpoint, fields, and parsing according to ElevenLabs Scribe docs.
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('ELEVENLABS_API_KEY missing');

  const fd = new FormData();
  fd.append('file', fs.createReadStream(wavPath));

  // example endpoint placeholder
  const endpoint = 'https://api.elevenlabs.io/v1/speech/scribe';

  const res = await axios.post(endpoint, fd, {
    headers: {
      ...fd.getHeaders(),
      'xi-api-key': key
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });

  // expected structure:
  // { sentences: [ { text, start, end, words: [{text, start, end, speaker}] } ], raw: res.data }
  // adapt parsing to actual API response.
  const data = res.data || {};
  const transcription = { sentences: [], raw: data };

  // Try to map if the API provided words/timestamps
  if (data.segments) {
    for (const seg of data.segments) {
      transcription.sentences.push({
        text: seg.text || '',
        start: seg.start || 0,
        end: seg.end || 0,
        words: seg.words || []
      });
    }
  } else if (data.transcript) {
    transcription.sentences.push({ text: data.transcript, start: 0, end: 0, words: [] });
  } else {
    transcription.sentences.push({ text: JSON.stringify(data).slice(0, 200), start: 0, end: 0, words: [] });
  }

  return transcription;
};

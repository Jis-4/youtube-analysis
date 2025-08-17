const axios = require('axios');

module.exports = {
  analyzeText: async (text) => {
    const key = process.env.GPTZERO_API_KEY;
    if (!key) return { ai_probability: null };

    // placeholder endpoint; replace with real GPTZero endpoint and request format
    const endpoint = 'https://api.gptzero.me/v2/analyze';
    try {
      const resp = await axios.post(endpoint, { text }, {
        headers: { Authorization: `Bearer ${key}` }
      });
      // expected response: { ai_probability: 0.22 } adjust parsing as needed
      return { ai_probability: resp.data.ai_probability || null, raw: resp.data };
    } catch (err) {
      console.error('gptzero error', err.message);
      return { ai_probability: null, error: err.message };
    }
  }
};

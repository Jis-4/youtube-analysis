const { HfInference } = require('@huggingface/inference');

module.exports = {
  analyzeText: async (text) => {
    const hfToken = process.env.HUGGINGFACE_API_KEY;
    
    if (hfToken) {
      try {
        console.log('Using Hugging Face for AI detection...');
        const hf = new HfInference(hfToken);
        
        // Use a text classification model for AI detection
        // This is a simplified approach - you can use more sophisticated models
        const result = await hf.textClassification({
          model: 'microsoft/DialoGPT-medium', // Example model
          inputs: text.substring(0, 500) // Limit text length
        });

        // Convert Hugging Face result to probability score
        let aiProbability = 0.5; // Default neutral score
        
        if (result && result.length > 0) {
          // Simple heuristic: if confidence is high, adjust probability
          const confidence = result[0].score || 0.5;
          aiProbability = Math.min(0.9, Math.max(0.1, confidence));
        }

        return { 
          ai_probability: aiProbability, 
          provider: "huggingface",
          raw: result 
        };
      } catch (error) {
        console.error('Hugging Face AI detection failed:', error.message);
      }
    }

    // Fallback: Generate mock AI probability
    console.log('Using free mock AI detection service...');
    
    // Simple heuristic based on text characteristics
    let aiProbability = 0.3; // Default low probability
    
    // Basic text analysis heuristics
    if (text.length > 100) {
      // Longer text might be more AI-like
      aiProbability += 0.1;
    }
    
    if (text.includes('artificial') || text.includes('AI') || text.includes('machine')) {
      // Keywords that might indicate AI content
      aiProbability += 0.2;
    }
    
    // Add some randomness to make it realistic
    aiProbability += (Math.random() - 0.5) * 0.2;
    aiProbability = Math.min(0.9, Math.max(0.1, aiProbability));

    return { 
      ai_probability: aiProbability, 
      provider: "free-mock-service",
      note: "This is demo data. For real AI detection, set HUGGINGFACE_API_KEY"
    };
  }
};

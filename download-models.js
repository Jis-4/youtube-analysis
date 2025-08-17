// Script to download Hugging Face AI detection models for offline use
const { pipeline } = require('@xenova/transformers');

async function downloadModels() {
  console.log('🚀 Downloading Hugging Face AI Detection Models...\n');
  
  const models = [
    {
      name: 'Prasoonmhwr AI Detector',
      model: 'prasoonmhwr/ai_detection_model',
      description: 'Probability-based AI detection (F1 score ~0.907)'
    },
    {
      name: 'OpenAI Detector',
      model: 'openai-community/roberta-base-openai-detector',
      description: 'OpenAI\'s official AI detector'
    },
    {
      name: 'Three-Way Classifier',
      model: 'Mohinikathro/AI-Content-Detector',
      description: 'Human/AI/Paraphrased classification'
    }
  ];

  for (const modelInfo of models) {
    try {
      console.log(`📥 Downloading: ${modelInfo.name}`);
      console.log(`   Model: ${modelInfo.model}`);
      console.log(`   Description: ${modelInfo.description}`);
      
      const pipe = await pipeline("text-classification", modelInfo.model);
      
      // Test the model with a simple text
      const testResult = await pipe("This is a test message for model validation.");
      console.log(`   ✅ Success! Test result:`, testResult);
      console.log(`   💾 Model cached for offline use\n`);
      
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}\n`);
    }
  }
  
  console.log('🎯 Model download complete!');
  console.log('💡 Models are now cached locally and will work offline.');
  console.log('🚀 You can now run the service with real AI detection!');
}

// Run the download
downloadModels().catch(console.error);

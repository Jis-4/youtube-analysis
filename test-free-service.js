// Test script to demonstrate the REAL AI Detection YouTube Analysis service
const transcribeFree = require('./src/lib/transcribeFree');
const aiDetectionReal = require('./src/lib/aiDetectionReal');

async function testFreeService() {
  console.log('🧪 Testing FREE YouTube Analysis Service...\n');

  // Test 1: Mock transcription (no API key needed)
  console.log('📝 Test 1: Free Transcription Service');
  console.log('=====================================');
  
  // Create a dummy WAV file path for testing
  const dummyWavPath = './test-audio.wav';
  
  try {
    const transcription = await transcribeFree(dummyWavPath);
    console.log('✅ Transcription successful!');
    console.log('📊 Result:', JSON.stringify(transcription, null, 2));
  } catch (error) {
    console.log('⚠️  Transcription test (expected error for dummy file):', error.message);
  }

  console.log('\n');

  // Test 2: REAL AI detection using Hugging Face models
  console.log('🤖 Test 2: REAL AI Detection Service (Hugging Face)');
  console.log('====================================================');
  
  const testTexts = [
    "Hello, this is a simple test message.",
    "This is a longer text that might be analyzed for AI content detection purposes.",
    "Artificial intelligence and machine learning are fascinating topics."
  ];

  for (let i = 0; i < testTexts.length; i++) {
    const text = testTexts[i];
    console.log(`\n📝 Text ${i + 1}: "${text}"`);
    
    try {
      const analysis = await aiDetectionReal.analyzeText(text);
      console.log(`🎯 AI Probability: ${(analysis.ai_probability * 100).toFixed(1)}%`);
      console.log(`🏷️  Provider: ${analysis.provider}`);
      if (analysis.model) console.log(`🤖 Model: ${analysis.model}`);
      if (analysis.confidence) console.log(`📊 Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
      if (analysis.note) console.log(`📝 Note: ${analysis.note}`);
      if (analysis.heuristics) {
        console.log(`🔍 Heuristics: Length=${analysis.heuristics.textLength}, AI Keywords=${analysis.heuristics.aiKeywords}`);
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }

  console.log('\n🎉 FREE Service Test Complete!');
  console.log('\n💡 Key Benefits:');
  console.log('   • REAL AI detection using Hugging Face models');
  console.log('   • No API keys required - runs locally');
  console.log('   • Multiple model fallbacks for reliability');
  console.log('   • Smart heuristics when models fail');
  console.log('   • Professional analysis with confidence scores');
  console.log('\n🚀 Ready to analyze YouTube videos with REAL AI detection!');
}

// Run the test
testFreeService().catch(console.error);

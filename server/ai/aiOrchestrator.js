const { generateErrorPredictionPrompt } = require('./prompts/errorPrediction.prompt');
const { analyzeWithClaude } = require("./providers/anthropic.provider");
const { mockAIResponse } = require('./providers/mock.provider');
const { parseAIResponse } = require('./parsers/aiResponse.parser');

const analyzeCode = async (code) => {
  try {
    // Step 1: Generate prompt for AI
    const prompt = generateErrorPredictionPrompt(code);
    
    // Step 2: Try real AI provider first
    let aiResponseString;
    let source;
    
    try {
      aiResponseString = await analyzeWithClaude(prompt);
      source = 'claude';
      console.log('Used Claude API for analysis');
    } catch (aiError) {
      console.log('Claude API failed, falling back to mock provider:', aiError.message);
      aiResponseString = await mockAIResponse(prompt);
      source = 'mock';
      console.log('Used mock provider for analysis');
    }
    
    // Step 3: Parse and sanitize AI response
    const analysisResult = parseAIResponse(aiResponseString);
    
    // Add source information
    analysisResult.source = source;
    
    return analysisResult;
  } catch (error) {
    console.error('AI Orchestrator error:', error);
    
    // Return fallback response
    return {
      issues: [{
        description: 'AI analysis failed: ' + error.message,
        type: 'warning',
        severity: 'medium'
      }],
      suggestions: ['Please try again later', 'Check API key configuration'],
      confidence: 0.3,
      source: 'error'
    };
  }
};

module.exports = {
  analyzeCode
};

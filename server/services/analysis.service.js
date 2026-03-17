const { analyzeCode: aiAnalyzeCode } = require('../ai/aiOrchestrator');
const Analysis = require('../models/Analysis');

const analyzeCode = async (code) => {
  try {
    // Get AI analysis
    const analysisResult = await aiAnalyzeCode(code);
    
    // Try to save to MongoDB, but don't fail if it's not available
    let savedAnalysis = null;
    try {
      // Convert string issues array to object format for MongoDB
      const issuesForDB = analysisResult.issues.map(issue => ({
        description: issue,
        type: 'warning', // Default type for backward compatibility
        severity: 'medium' // Default severity for individual issues
      }));
      
      // Create analysis document
      const analysis = new Analysis({
        code: code,
        issues: issuesForDB,
        overallSeverity: analysisResult.severity,
        suggestions: analysisResult.suggestions,
        confidence: analysisResult.confidence,
        source: analysisResult.source
      });
      
      // Save to MongoDB
      savedAnalysis = await analysis.save();
      console.log('Analysis saved to MongoDB successfully');
    } catch (dbError) {
      console.warn('MongoDB save failed, returning analysis without saving:', dbError.message);
      // Continue without saving to database
    }
    
    // Return the result
    const result = {
      issues: analysisResult.issues,
      severity: analysisResult.severity,
      suggestions: analysisResult.suggestions,
      confidence: analysisResult.confidence,
      source: analysisResult.source,
      createdAt: savedAnalysis ? savedAnalysis.createdAt : new Date()
    };
    
    // Add ID if saved to database
    if (savedAnalysis) {
      result.id = savedAnalysis._id;
    }
    
    return result;
  } catch (error) {
    console.error('Analysis service error:', error);
    
    // Return fallback response
    return {
      issues: ['Analysis service failed'],
      severity: 'medium',
      suggestions: ['Please try again later'],
      confidence: 0.3,
      source: 'error',
      createdAt: new Date(),
      error: error.message
    };
  }
};

module.exports = {
  analyzeCode
};

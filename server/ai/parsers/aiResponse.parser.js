const parseAIResponse = (aiResponseString) => {
  try {
    // Parse the JSON response from AI
    const parsedResponse = JSON.parse(aiResponseString);
    
    // Handle new format (issues as objects) and old format (issues as strings)
    let issues = parsedResponse.issues || [];
    let suggestions = parsedResponse.suggestions || [];
    let confidence = parsedResponse.confidence;
    
    // Convert new format to old format for backward compatibility
    if (issues.length > 0 && typeof issues[0] === 'object' && issues[0].description) {
      // New format: extract descriptions and determine overall severity
      const issueDescriptions = issues.map(issue => issue.description);
      const severities = issues.map(issue => issue.severity);
      
      // Determine overall severity (highest severity found)
      const overallSeverity = severities.includes('high') ? 'high' : 
                           severities.includes('medium') ? 'medium' : 'low';
      
      return {
        issues: issueDescriptions,
        severity: overallSeverity,
        suggestions: suggestions,
        confidence: confidence || 0.5 // Default confidence if not provided
      };
    } else {
      // Old format or simple string array
      issues = Array.isArray(issues) ? issues.filter(issue => typeof issue === 'string') : [];
      suggestions = Array.isArray(suggestions) ? suggestions.filter(suggestion => typeof suggestion === 'string') : [];
      
      // If no issues found, provide default response
      if (issues.length === 0) {
        issues = ['No issues detected'];
        suggestions = ['Code looks clean'];
      }
      
      return {
        issues: issues,
        severity: ['low', 'medium', 'high'].includes(parsedResponse.severity) 
          ? parsedResponse.severity 
          : 'low',
        suggestions: suggestions,
        confidence: confidence || 0.5 // Default confidence if not provided
      };
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
    
    // Return fallback response if parsing fails
    return {
      issues: ['Error processing AI response'],
      severity: 'medium',
      suggestions: ['Please try again with different code'],
      confidence: 0.3 // Low confidence for error case
    };
  }
};

module.exports = {
  parseAIResponse
};

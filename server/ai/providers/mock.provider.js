const mockAIResponse = (prompt) => {
  const delay = Math.random() * 1000 + 500;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const code = extractCodeFromPrompt(prompt);
      const issues = analyzeCodePatterns(code);
      const confidence = calculateConfidence(code, issues);
      
      resolve(JSON.stringify({
        issues: issues,
        suggestions: generateSuggestions(issues),
        confidence: confidence
      }));
    }, delay);
  });
};

const extractCodeFromPrompt = (prompt) => {
  const codeMatch = prompt.match(/Code:\s*\n([\s\S]*?)(?=\n\n|\n$|$)/);
  return codeMatch ? codeMatch[1].trim() : '';
};

const analyzeCodePatterns = (code) => {
  const issues = [];
  const codeLower = code.toLowerCase();

  // High severity issues (potential crashes)
  if (hasUndefinedVariableAccess(code)) {
    issues.push({
      description: `Variable '${extractUndefinedVariable(code)}' is used without being declared or initialized`,
      type: 'bug',
      severity: 'high'
    });
  }

  if (hasUnsafePropertyAccess(code)) {
    const unsafeObj = extractUnsafeObject(code);
    issues.push({
      description: `Unsafe property access on '${unsafeObj}' - potential null/undefined reference error`,
      type: 'bug',
      severity: 'high'
    });
  }

  if (hasMissingErrorHandling(code)) {
    issues.push({
      description: 'Asynchronous operations lack proper error handling - could cause unhandled promise rejections',
      type: 'bug',
      severity: 'high'
    });
  }

  if (hasUnsafeJSONOperations(code)) {
    issues.push({
      description: 'JSON.parse() called without try-catch block - malformed JSON will crash the application',
      type: 'bug',
      severity: 'high'
    });
  }

  // Medium severity issues (bad practices)
  if (codeLower.includes('console.log')) {
    issues.push({
      description: 'Console.log statements detected in code - should be removed in production',
      type: 'warning',
      severity: 'medium'
    });
  }

  if (hasLooseEquality(code)) {
    issues.push({
      description: 'Loose equality (==) comparison detected - can lead to unexpected type coercion',
      type: 'warning',
      severity: 'medium'
    });
  }

  if (code.includes('var ')) {
    issues.push({
      description: 'Using deprecated var keyword - prefer let/const for better scoping',
      type: 'warning',
      severity: 'medium'
    });
  }

  if (hasAsyncAntiPatterns(code)) {
    issues.push({
      description: 'Async/await anti-pattern detected - mixing promises and callbacks incorrectly',
      type: 'warning',
      severity: 'medium'
    });
  }

  // Low severity issues (minor improvements)
  if (hasMagicNumbers(code)) {
    issues.push({
      description: 'Magic numbers found in code - should be extracted to named constants',
      type: 'performance',
      severity: 'low'
    });
  }

  if (hasInefficientOperations(code)) {
    issues.push({
      description: 'Inefficient operation detected - could impact performance at scale',
      type: 'performance',
      severity: 'low'
    });
  }

  // Ensure at least one meaningful issue for potentially risky code
  if (issues.length === 0 && hasPotentialRisk(code)) {
    issues.push({
      description: 'Code contains patterns that could be risky in production environments',
      type: 'warning',
      severity: 'low'
    });
  }

  return issues.length > 0 ? issues : [{
    description: 'Code appears to follow good practices with no immediate concerns',
    type: 'warning',
    severity: 'low'
  }];
};

const hasUndefinedVariableAccess = (code) => {
  // Look for variables that are used but not declared
  const usedVars = code.match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g) || [];
  const declaredVars = code.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
  const declaredVarNames = declaredVars.map(dec => dec.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/)[1]);
  
  // Common globals and built-ins to ignore
  const globals = ['console', 'process', 'require', 'module', 'exports', 'document', 'window', 'fetch', 'JSON', 'Math', 'Date', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Promise', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'];
  
  return usedVars.some(variable => 
    !declaredVarNames.includes(variable) && 
    !globals.includes(variable) &&
    variable.length > 1 // Skip single letters like 'i', 'x', etc.
  );
};

const extractUndefinedVariable = (code) => {
  const usedVars = code.match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g) || [];
  const declaredVars = code.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
  const declaredVarNames = declaredVars.map(dec => dec.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/)[1]);
  const globals = ['console', 'process', 'require', 'module', 'exports', 'document', 'window', 'fetch', 'JSON', 'Math', 'Date', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Promise', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'];
  
  const undefinedVar = usedVars.find(variable => 
    !declaredVarNames.includes(variable) && 
    !globals.includes(variable) &&
    variable.length > 1
  );
  
  return undefinedVar || 'unknown';
};

const hasUnsafePropertyAccess = (code) => {
  const unsafePatterns = [
    /(\w+\.\w+)/, // Simple property access
    /(\w+\[\w+\])/, // Bracket notation access
  ];
  
  return unsafePatterns.some(pattern => {
    const matches = code.match(pattern);
    if (!matches) return false;
    
    // Check if there's no null check before the access
    const objectName = matches[1].split('.')[0] || matches[1].split('[')[0];
    return !code.includes(`if (${objectName}`) && 
           !code.includes(`${objectName} != null`) && 
           !code.includes(`${objectName} !== null`) &&
           !code.includes(`${objectName}?`);
  });
};

const extractUnsafeObject = (code) => {
  const match = code.match(/(\w+)\.\w+/);
  return match ? match[1] : 'object';
};

const hasMissingErrorHandling = (code) => {
  const asyncPatterns = [
    /fetch\s*\(/,
    /\.then\s*\(/,
    /await\s+(?!try)/,
    /fs\./,
    /require\s*\(['"]fs['"]\)/
  ];
  
  return asyncPatterns.some(pattern => pattern.test(code)) && 
         !code.includes('catch') && 
         !code.includes('try');
};

const hasUnsafeJSONOperations = (code) => {
  return /JSON\.parse\s*\(/.test(code) && !code.includes('try');
};

const hasLooseEquality = (code) => {
  return /(?:[^=!])=([^=]|$)/.test(code) && !/===/.test(code);
};

const hasAsyncAntiPatterns = (code) => {
  return (
    (/await/.test(code) && !/async/.test(code)) ||
    (/.then/.test(code) && /await/.test(code)) ||
    (code.includes('callback') && code.includes('function') && /await/.test(code))
  );
};

const hasMagicNumbers = (code) => {
  return /\b(?!1|0|2|10|100)\d{2,}\b/.test(code);
};

const hasInefficientOperations = (code) => {
  return (
    /for\s*\(\s*let\s+\w+\s*=\s*0\s*;.*\.length/.test(code) ||
    /\.push\(.*\)\.join/.test(code) ||
    /\.split\(.*\)\.join/.test(code)
  );
};

const hasPotentialRisk = (code) => {
  return (
    code.includes('.') || // Any property access
    code.includes('(') || // Any function call
    code.includes('[') || // Any array access
    code.length > 50 // Longer code has higher risk
  );
};

const generateSuggestions = (issues) => {
  const suggestions = [];
  const issueTypes = issues.map(issue => issue.description);

  if (issueTypes.some(desc => desc.includes('without being declared'))) {
    suggestions.push('Declare the variable using const, let, or var before using it');
    suggestions.push('Import the variable from another module if it\'s defined elsewhere');
    suggestions.push('Check for typos in the variable name');
  }

  if (issueTypes.some(desc => desc.includes('Unsafe property access'))) {
    suggestions.push('Add null/undefined checks before accessing object properties');
    suggestions.push('Use optional chaining operator (?.) for safer property access');
    suggestions.push('Implement defensive programming patterns');
    suggestions.push('Consider using default values or object destructuring with defaults');
  }

  if (issueTypes.some(desc => desc.includes('lack proper error handling'))) {
    suggestions.push('Wrap async operations in try-catch blocks');
    suggestions.push('Use .catch() method for promise error handling');
    suggestions.push('Implement proper error propagation and logging');
    suggestions.push('Consider using Promise.finally for cleanup operations');
  }

  if (issueTypes.some(desc => desc.includes('JSON.parse() called without try-catch'))) {
    suggestions.push('Wrap JSON.parse() in try-catch block to handle malformed JSON');
    suggestions.push('Validate input before parsing if possible');
    suggestions.push('Provide fallback values for failed parsing operations');
  }

  if (issueTypes.some(desc => desc.includes('Console.log statements'))) {
    suggestions.push('Remove console.log statements before deploying to production');
    suggestions.push('Use a proper logging library like Winston or Bunyan');
    suggestions.push('Implement environment-based logging (only log in development)');
  }

  if (issueTypes.some(desc => desc.includes('Loose equality'))) {
    suggestions.push('Replace == with === for strict equality comparison');
    suggestions.push('Be explicit about type conversions if needed');
    suggestions.push('Consider using Object.is() for special cases like NaN');
  }

  if (issueTypes.some(desc => desc.includes('deprecated var'))) {
    suggestions.push('Replace var with let for variables that will be reassigned');
    suggestions.push('Use const for variables that won\'t change');
    suggestions.push('Understand block scoping differences between var and let/const');
  }

  if (issueTypes.some(desc => desc.includes('Async/await anti-pattern'))) {
    suggestions.push('Ensure async functions are properly declared with async keyword');
    suggestions.push('Avoid mixing callback patterns with async/await');
    suggestions.push('Use Promise.all() for concurrent async operations');
    suggestions.push('Consider using async generators for complex async flows');
  }

  if (issueTypes.some(desc => desc.includes('Magic numbers'))) {
    suggestions.push('Extract magic numbers to named constants at the top of the file');
    suggestions.push('Use descriptive names that explain the number\'s purpose');
    suggestions.push('Group related constants in a configuration object');
  }

  if (issueTypes.some(desc => desc.includes('Inefficient operation'))) {
    suggestions.push('Cache array length in loops to avoid repeated property access');
    suggestions.push('Use appropriate array methods (map, filter, reduce) instead of manual loops');
    suggestions.push('Consider using built-in methods that are optimized for performance');
  }

  if (issueTypes.some(desc => desc.includes('no immediate concerns'))) {
    suggestions.push('Consider adding unit tests to ensure code correctness');
    suggestions.push('Add JSDoc comments for better documentation');
    suggestions.push('Run static analysis tools like ESLint for additional checks');
    suggestions.push('Consider code review for edge cases and security implications');
  }

  if (issueTypes.some(desc => desc.includes('could be risky'))) {
    suggestions.push('Add input validation and sanitization');
    suggestions.push('Implement proper error boundaries');
    suggestions.push('Consider adding integration tests');
    suggestions.push('Review code for security vulnerabilities');
  }

  return [...new Set(suggestions)]; // Remove duplicates
};

const calculateConfidence = (code, issues) => {
  let confidence = 0.5; // Base confidence
  
  // Increase confidence based on code characteristics
  const codeLength = code.length;
  const codeComplexity = calculateCodeComplexity(code);
  const issueCount = issues.length;
  const highSeverityCount = issues.filter(issue => issue.severity === 'high').length;
  
  // Factors that increase confidence
  if (codeLength > 20) confidence += 0.1; // Sufficient code to analyze
  if (codeLength > 100) confidence += 0.1; // More substantial code
  if (issueCount > 0) confidence += 0.1; // Found issues to report
  if (issueCount > 2) confidence += 0.1; // Multiple issues found
  if (highSeverityCount > 0) confidence += 0.1; // High severity issues detected
  
  // Complexity-based confidence
  if (codeComplexity > 3) confidence += 0.1; // Complex code gives more to analyze
  if (codeComplexity > 5) confidence += 0.1; // Very complex code
  
  // Pattern-based confidence boosts
  if (hasClearPatterns(code)) confidence += 0.1; // Clear anti-patterns detected
  if (hasModernJSFeatures(code)) confidence += 0.05; // Modern JS features
  if (hasAsyncOperations(code)) confidence += 0.05; // Async operations to analyze
  
  // Code quality indicators
  if (hasGoodStructure(code)) confidence += 0.05; // Well-structured code
  if (hasErrorHandling(code)) confidence += 0.05; // Some error handling present
  
  // Cap confidence at 0.95 (never 100% certain)
  confidence = Math.min(confidence, 0.95);
  
  // Round to 2 decimal places
  return Math.round(confidence * 100) / 100;
};

const calculateCodeComplexity = (code) => {
  let complexity = 0;
  
  // Count complexity indicators
  complexity += (code.match(/\bif\b/g) || []).length;
  complexity += (code.match(/\bfor\b/g) || []).length;
  complexity += (code.match(/\bwhile\b/g) || []).length;
  complexity += (code.match(/\bswitch\b/g) || []).length;
  complexity += (code.match(/\btry\b/g) || []).length;
  complexity += (code.match(/\bcatch\b/g) || []).length;
  complexity += (code.match(/function/g) || []).length;
  complexity += (code.match(/=>/g) || []).length;
  complexity += (code.match(/\bawait\b/g) || []).length;
  complexity += (code.match(/\.then\(/g) || []).length;
  
  return complexity;
};

const hasClearPatterns = (code) => {
  const patterns = [
    /console\./,
    /JSON\.parse/,
    /fetch\s*\(/,
    /==/,
    /var\s+/,
    /undefined/,
    /null/
  ];
  
  return patterns.some(pattern => pattern.test(code));
};

const hasModernJSFeatures = (code) => {
  const modernFeatures = [
    /const\s+/,
    /let\s+/,
    /=>/,
    /await/,
    /Promise/,
    /\.\.\./,
    /\?\./
  ];
  
  return modernFeatures.some(feature => feature.test(code));
};

const hasAsyncOperations = (code) => {
  const asyncPatterns = [
    /fetch\s*\(/,
    /await/,
    /\.then\s*\(/,
    /Promise/,
    /async/
  ];
  
  return asyncPatterns.some(pattern => pattern.test(code));
};

const hasGoodStructure = (code) => {
  // Basic structure indicators
  return (
    code.includes('{') && code.includes('}') && // Has blocks
    code.split('\n').length > 2 && // Multiple lines
    !code.includes('eval(') && // No eval
    !code.includes('new Function(') // No dynamic functions
  );
};

const hasErrorHandling = (code) => {
  return (
    code.includes('try') ||
    code.includes('catch') ||
    code.includes('.catch(')
  );
};

module.exports = {
  mockAIResponse
};

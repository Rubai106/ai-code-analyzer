function generateErrorPredictionPrompt(code) {
  return `
You are an expert senior software engineer.

Analyze the following code and predict potential issues BEFORE runtime.

Focus on:
- possible runtime errors
- null/undefined issues
- bad practices
- edge cases
- performance issues

Return STRICT JSON format:

{
  "issues": [
    {
      "description": "",
      "type": "bug | warning | performance",
      "severity": "low | medium | high"
    }
  ],
  "suggestions": [
    ""
  ]
}

Code:
${code}

Rules:
- Do not explain outside JSON
- Be concise
- Only return valid JSON
`;
}

module.exports = { generateErrorPredictionPrompt };
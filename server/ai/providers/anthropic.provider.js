require('dotenv').config();
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function analyzeWithClaude(prompt) {
  try {
    console.log('Using Anthropic API key:', process.env.ANTHROPIC_API_KEY ? 'Present' : 'Missing');
    
    const response = await client.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.error("Claude API Error:", error.message);
    console.error("Full error:", error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

module.exports = { analyzeWithClaude };
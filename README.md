# AI Code Analyzer

A full-stack web application that analyzes JavaScript code for potential issues and improvements using AI.

## Features

- **Backend**: Express.js API with MongoDB integration
- **Frontend**: React UI with modern design
- **AI Analysis**: Multiple AI providers (Anthropic Claude + Mock fallback)
- **Code Analysis**: Detects undefined variables, unsafe property access, console.log usage, equality issues, missing error handling
- **Real-time Results**: Issues, severity, suggestions, confidence score, and AI source tracking
- **Database Storage**: MongoDB for analysis history

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Anthropic AI SDK
- Environment configuration with dotenv

### Frontend
- React 18 with Vite
- Axios for API calls
- Modern CSS with gradients and animations
- Responsive design

## Project Structure

```
├── server/                 # Express.js backend
│   ├── ai/                # AI layer
│   │   ├── aiOrchestrator.js
│   │   ├── providers/     # AI providers (Claude, Mock)
│   │   ├── parsers/       # Response parsers
│   │   └── prompts/       # AI prompts
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── models/            # MongoDB models
│   ├── services/          # Business logic
│   ├── validators/        # Input validation
│   └── app.js            # Express app setup
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   └── App.jsx       # Main app component
│   └── public/           # Static assets
└── README.md
```

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (running on localhost:27017)
- Anthropic API key (optional, will use mock if not available)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-code-analyzer
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd server
   npm install
   
   # Frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # In server directory
   cd server
   cp .env.example .env
   
   # Edit .env with your configuration:
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/express-backend
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   mongod
   ```

## Usage

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   node server.js
   ```
   
   The server will start on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   
   The frontend will start on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` and start analyzing your JavaScript code!

## API Endpoints

### POST /api/v1/analysis

Analyzes JavaScript code and returns AI-generated insights.

**Request Body:**
```json
{
  "code": "const x = user.name; console.log(x);"
}
```

**Response:**
```json
{
  "issues": ["Variable 'user' is used without being declared or initialized", ...],
  "severity": "high",
  "suggestions": ["Declare the variable using const, let, or var before using it", ...],
  "confidence": 0.95,
  "source": "mock",
  "createdAt": "2026-03-17T15:14:41.580Z",
  "id": "507f1f77bcf86a619b1f8b9ac"
}
```

## AI Providers

### Anthropic Claude (Primary)
- Uses Claude AI for advanced code analysis
- Requires valid API key in `.env` file
- Provides high-quality, context-aware analysis

### Mock Provider (Fallback)
- Automatically used when Claude API is unavailable
- Pattern-based detection for common JavaScript issues
- Still provides realistic and useful analysis

## Code Analysis Features

The AI analyzes JavaScript code for:

- **Undefined Variables**: Variables used without declaration
- **Unsafe Property Access**: Potential null/undefined reference errors
- **Console.log Usage**: Debugging statements in production code
- **Equality Issues**: Loose equality (`==`) vs strict equality (`===`)
- **Missing Error Handling**: Async operations without try-catch
- **JSON.parse Issues**: Parsing without error handling
- **Deprecated Syntax**: Usage of `var` keyword
- **Performance Issues**: Inefficient operations

## Database Schema

### Analysis Collection
```javascript
{
  code: String,           // Original analyzed code
  issues: [{              // Array of detected issues
    description: String,
    type: String,         // bug, warning, performance
    severity: String      // low, medium, high
  }],
  overallSeverity: String,    // Overall risk level
  suggestions: [String],     // Improvement suggestions
  confidence: Number,        // AI confidence score (0-1)
  source: String,           // AI provider used
  createdAt: Date,          // Analysis timestamp
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running on localhost:27017
   - Check the `MONGODB_URI` in your `.env` file

2. **Anthropic API Error**
   - Verify your API key is correct
   - Ensure you have sufficient API credits
   - The app will automatically fall back to mock provider

3. **Port Conflicts**
   - Backend uses port 5000
   - Frontend dev server uses port 5173
   - Change ports in `.env` or `vite.config.js` if needed

### Development Tips

- The mock provider provides realistic analysis for testing without API costs
- Check the console for detailed AI provider logs
- MongoDB saves all analyses for history and debugging

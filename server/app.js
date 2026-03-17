const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import controllers and validators
const { analyzeCodeController } = require('./controllers/analysis.controller');
const { validateAnalysisInput } = require('./validators/analysis.validator');

// Test route
app.get('/api/v1/test', (req, res) => {
  res.json({ message: 'API working' });
});

// Analysis route
app.post('/api/v1/analysis', validateAnalysisInput, analyzeCodeController);

module.exports = app;

const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true
  },
  issues: [{
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['bug', 'warning', 'performance'],
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    }
  }],
  overallSeverity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  suggestions: [{
    type: String,
    required: true
  }],
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  source: {
    type: String,
    enum: ['claude', 'mock', 'error'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
analysisSchema.index({ createdAt: -1 });
analysisSchema.index({ source: 1 });
analysisSchema.index({ overallSeverity: 1 });

module.exports = mongoose.model('Analysis', analysisSchema);

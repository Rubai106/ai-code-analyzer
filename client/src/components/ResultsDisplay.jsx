import React from 'react';

function ResultsDisplay({ result, loading, error }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'claude': return '#007bff';
      case 'mock': return '#6c757d';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="results loading">
        <div className="loading-spinner"></div>
        <p>Analyzing your code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results error">
        <h3>Error</h3>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results empty">
        <p>Enter code and click &quot;Analyze Code&quot; to see results</p>
      </div>
    );
  }

  return (
    <div className="results">
      <div className="results-header">
        <h3>Analysis Results</h3>
        <div className="meta-info">
          <span className="severity-badge" style={{ backgroundColor: getSeverityColor(result.severity) }}>
            {result.severity.toUpperCase()}
          </span>
          <span className="source-badge" style={{ backgroundColor: getSourceColor(result.source) }}>
            Source: {result.source.toUpperCase()}
          </span>
          <span className="confidence-score">
            Confidence: {Math.round(result.confidence * 100)}%
          </span>
        </div>
      </div>

      <div className="issues-section">
        <h4>Issues Found ({result.issues.length})</h4>
        {result.issues.length === 0 ? (
          <p className="no-issues">No issues detected!</p>
        ) : (
          <ul className="issues-list">
            {result.issues.map((issue, index) => (
              <li key={index} className="issue-item">
                {issue}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="suggestions-section">
        <h4>Suggestions ({result.suggestions.length})</h4>
        <ul className="suggestions-list">
          {result.suggestions.map((suggestion, index) => (
            <li key={index} className="suggestion-item">
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {result.createdAt && (
        <div className="timestamp">
          <small>Analyzed at: {new Date(result.createdAt).toLocaleString()}</small>
        </div>
      )}
    </div>
  );
}

export default ResultsDisplay;

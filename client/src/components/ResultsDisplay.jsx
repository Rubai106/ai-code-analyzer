import React from 'react';

function ResultsDisplay({ result, loading, error }) {
  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5' };
      case 'medium': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#FCD34D' };
      case 'low': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7' };
      default: return { bg: '#374151', color: '#D1D5DB' };
    }
  };

  if (loading) return null; // Loading state handled by the button spinner
  
  if (error) {
    return (
      <div className="results-container">
        <div className="results-card error">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h3 style={{ color: '#F87171', fontWeight: '600' }}>Analysis Failed</h3>
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results-container">
        <div className="results-placeholder">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p>Analysis details will appear here</p>
        </div>
      </div>
    );
  }

  const severityStyle = getSeverityStyles(result.severity);
  const confidencePercent = Math.round((result.confidence || 0) * 100);

  return (
    <div className="results-container">
      <div className="results-card">
        <div className="results-header">
          <div className="results-title-group">
            <h3>Analysis Results</h3>
            <span className="source-tag">{result.source?.toUpperCase() || 'AI'} ENGINE</span>
          </div>
          
          <div className="meta-info">
            <div className="confidence-wrapper">
              <div className="confidence-label">
                <span>Confidence</span>
                <span>{confidencePercent}%</span>
              </div>
              <div className="confidence-track">
                <div 
                  className="confidence-fill" 
                  style={{ width: `${confidencePercent}%` }}
                ></div>
              </div>
            </div>
            <span 
              className="badge severity-badge" 
              style={{ backgroundColor: severityStyle.bg, color: severityStyle.color }}
            >
              <span className="badge-dot" style={{ backgroundColor: severityStyle.color }}></span>
              {result.severity?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
        </div>

        <div className="results-body">
          <div className="section issues-section">
            <h4>
              <span className="section-icon">🚨</span> 
              Issues Found <span className="count">{result.issues?.length || 0}</span>
            </h4>
            {(!result.issues || result.issues.length === 0) ? (
              <div className="empty-state sub success">
                <span className="empty-icon">✨</span>
                <p>No major issues detected. Great job!</p>
              </div>
            ) : (
              <ul className="clean-list issues-list">
                {result.issues.map((issue, index) => (
                  <li key={index} className="list-item issue-item">
                    <span className="item-bullet issue-bullet"></span>
                    <p>{issue}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="section suggestions-section">
            <h4>
              <span className="section-icon">💡</span> 
              Suggestions <span className="count">{result.suggestions?.length || 0}</span>
            </h4>
            {(!result.suggestions || result.suggestions.length === 0) ? (
              <div className="empty-state sub neutral">
                <p>No specific suggestions at this time.</p>
              </div>
            ) : (
              <ul className="clean-list suggestions-list">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="list-item suggestion-item">
                    <span className="item-bullet suggestion-bullet"></span>
                    <p>{suggestion}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsDisplay;

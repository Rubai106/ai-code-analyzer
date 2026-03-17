import React from 'react';

function CodeInput({ value, onChange, onAnalyze, disabled }) {
  return (
    <div className="code-input">
      <div className="code-input-header">
        <label htmlFor="code-input">JavaScript Source Code</label>
        <div className="window-controls">
          <span className="dot dot-close"></span>
          <span className="dot dot-minimize"></span>
          <span className="dot dot-expand"></span>
        </div>
      </div>
      <textarea
        id="code-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="// Enter your JavaScript code here...&#10;const analyze = () => {&#10;  console.log('Ready to optimize');&#10;};"
        disabled={disabled}
        className="code-textarea"
        spellCheck="false"
      />
      <div className="analyze-button-container">
        <button 
          onClick={onAnalyze}
          disabled={disabled || !value.trim()}
          className={`analyze-button ${disabled ? 'disabled' : ''}`}
        >
          {disabled ? (
            <span className="button-content">
              <span className="spinner"></span> Analyzing...
            </span>
          ) : (
            'Analyze Code'
          )}
        </button>
      </div>
    </div>
  );
}

export default CodeInput;

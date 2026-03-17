import React from 'react';

function CodeInput({ value, onChange, onAnalyze, disabled }) {
  return (
    <div className="code-input">
      <label htmlFor="code-input">Enter your JavaScript code:</label>
      <textarea
        id="code-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="const x = user.name; console.log(x);"
        rows={10}
        disabled={disabled}
        className="code-textarea"
      />
      <button 
        onClick={onAnalyze}
        disabled={disabled || !value.trim()}
        className="analyze-button"
      >
        {disabled ? 'Analyzing...' : 'Analyze Code'}
      </button>
    </div>
  );
}

export default CodeInput;

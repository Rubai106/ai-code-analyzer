import React, { useState } from 'react';
import axios from 'axios';
import CodeInput from './components/CodeInput';
import ResultsDisplay from './components/ResultsDisplay';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/analysis', {
        code: code
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze code. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>AI Code Analyzer</h1>
          <p>Professional Static Analysis & Optimization via LLM</p>
        </div>
      </header>

      <main className="main">
        <CodeInput
          value={code}
          onChange={setCode}
          onAnalyze={analyzeCode}
          disabled={loading}
        />

        <ResultsDisplay
          result={result}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  );
}

export default App;

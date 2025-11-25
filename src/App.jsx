import React, { useState } from 'react';
import Quiz from './components/Quiz';
import Home from './components/Home';
import Learn from './components/Learn';
import Theory from './components/Theory';
import Sidebar from './components/Sidebar';
import { fetchQuestions } from './services/api';
import './index.css';

function App() {
  const [view, setView] = useState('home'); // 'home', 'quiz', 'result', 'learn'
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [currentTopic, setCurrentTopic] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');

  const startQuiz = async (topic, level) => {
    setLoading(true);
    setError(null);
    setCurrentTopic(topic);
    setCurrentLevel(level);

    try {
      const data = await fetchQuestions(topic, level, 5);
      if (data && data.perguntas && data.perguntas.length > 0) {
        setQuestions(data.perguntas);
        setView('quiz');
      } else {
        setError("Não encontramos perguntas para este tópico. Tente outro.");
      }
    } catch (err) {
      setError("Erro ao carregar o quiz. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (finalScore, total) => {
    setScore(finalScore);
    setTotalQuestions(total);
    setView('result');
  };

  const goHome = () => {
    setView('home');
    setQuestions([]);
    setScore(0);
    setError(null);
  };

  const renderContent = () => {
    if (view === 'home') {
      return (
        <>
          {loading ? (
            <div className="loading-screen">
              <div className="spinner"></div>
              <p>Preparando seu desafio...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="error-banner">
                  {error}
                  <button onClick={() => setError(null)}>✕</button>
                </div>
              )}
              <Home onStart={startQuiz} />
            </>
          )}
        </>
      );
    }

    if (view === 'quiz') {
      return (
        <div className="quiz-wrapper">
          <Quiz questions={questions} onComplete={handleQuizComplete} />
        </div>
      );
    }

    if (view === 'result') {
      return (
        <div className="result-screen">
          <div className="glass-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h1>Desafio Concluído!</h1>
            <div className="score-circle">
              <span>{Math.round((score / totalQuestions) * 100)}%</span>
            </div>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
              Você acertou <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{score}</span> de {totalQuestions} questões
            </p>

            <div className="result-actions">
              <button className="btn-primary" onClick={() => startQuiz(currentTopic, currentLevel)} style={{ width: '100%' }}>
                TENTAR NOVAMENTE
              </button>
              <button className="btn-secondary" onClick={goHome} style={{ width: '100%' }}>
                ESCOLHER OUTRO TÓPICO
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (view === 'learn') {
      return <Learn />;
    }

    if (view === 'theory') {
      return <Theory />;
    }

    return null;
  };

  return (
    <div className="app-layout">
      <Sidebar currentView={view} onViewChange={setView} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;

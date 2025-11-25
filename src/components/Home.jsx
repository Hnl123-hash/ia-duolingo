import React, { useState } from 'react';

const STANDARD_TOPICS = [
  { id: 'familia', label: 'Família', icon: '👨‍👩‍👧‍👦', promptContext: 'Inglês sobre membros da família, relacionamentos e descrições pessoais' },
  { id: 'comida', label: 'Comida', icon: '🍔', promptContext: 'Inglês sobre alimentos, restaurantes, culinária e pedidos' },
  { id: 'viagens', label: 'Viagens', icon: '✈️', promptContext: 'Inglês para viagens, aeroportos, hotéis e turismo' },
  { id: 'animais', label: 'Animais', icon: '🐶', promptContext: 'Inglês sobre animais de estimação, selvagens e natureza' },
  { id: 'escola', label: 'Escola', icon: '📚', promptContext: 'Inglês sobre escola, materiais, matérias e sala de aula' },
  { id: 'hobbies', label: 'Hobbies', icon: '🎨', promptContext: 'Inglês sobre passatempos, esportes, música e lazer' },
];

const FLUENCY_TOPICS = [
  { id: 'entrevista', label: 'Entrevista', icon: '🤝', promptContext: 'Simulação de entrevista de emprego em inglês, perguntas comuns e respostas profissionais' },
  { id: 'debate', label: 'Debate', icon: '🗣️', promptContext: 'Inglês para argumentação, expressar opiniões e concordar/discordar' },
  { id: 'narrativa', label: 'Narrativa', icon: '📖', promptContext: 'Inglês para contar histórias passadas, experiências pessoais e memórias' },
];

const LEVELS = [
  { id: 'A1', label: 'Iniciante (A1)' },
  { id: 'B1', label: 'Intermediário (B1)' },
  { id: 'C1', label: 'Avançado (C1)' },
  { id: 'C2', label: 'Fluente (C2)' },
];

const Home = ({ onStart }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleStart = () => {
    if (selectedTopic && selectedLevel) {
      onStart(selectedTopic.promptContext || selectedTopic.label, selectedLevel.id);
    }
  };

  return (
    <div className="home-container fade-in">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Vamos dominar o Inglês! 🚀</h1>
          <p>Selecione seu objetivo e nível para criar um plano de estudo personalizado com IA.</p>
        </div>
      </div>

      <div className="content-wrapper">
        <section className="section-block">
          <div className="section-header">
            <span className="section-icon">🌟</span>
            <h2>Tópicos Essenciais</h2>
          </div>
          <div className="topics-grid">
            {STANDARD_TOPICS.map((topic) => (
              <div
                key={topic.id}
                className={`topic-card ${selectedTopic === topic ? 'selected' : ''}`}
                onClick={() => setSelectedTopic(topic)}
              >
                <div className="topic-icon-wrapper">{topic.icon}</div>
                <span className="topic-name">{topic.label}</span>
                {selectedTopic === topic && <div className="check-badge">✓</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-header">
            <span className="section-icon">🔥</span>
            <h2>Desafios de Fluência</h2>
          </div>
          <div className="fluency-grid">
            {FLUENCY_TOPICS.map((topic) => (
              <div
                key={topic.id}
                className={`fluency-card-modern ${selectedTopic === topic ? 'selected' : ''}`}
                onClick={() => setSelectedTopic(topic)}
              >
                <div className="fluency-content">
                  <span className="fluency-icon">{topic.icon}</span>
                  <span className="fluency-label">{topic.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-header">
            <span className="section-icon">📊</span>
            <h2>Seu Nível Atual</h2>
          </div>
          <div className="levels-row">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                className={`level-chip ${selectedLevel === level ? 'selected' : ''}`}
                onClick={() => setSelectedLevel(level)}
              >
                {level.label}
              </button>
            ))}
          </div>
        </section>

        <div className="action-area">
          <button
            className="start-hero-btn"
            onClick={handleStart}
            disabled={!selectedTopic || !selectedLevel}
          >
            {selectedTopic && selectedLevel ? 'INICIAR JORNADA' : 'SELECIONE AS OPÇÕES'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { fetchLearningContent } from '../services/api';

const GRAMMAR_TOPICS = [
    { id: 'present_tenses', label: 'Presente (Simple & Continuous)', promptContext: 'Exercícios de Present Simple e Present Continuous' },
    { id: 'past_tenses', label: 'Passado (Simple & Continuous)', promptContext: 'Exercícios de Past Simple e Past Continuous' },
    { id: 'future', label: 'Futuro (Will & Going to)', promptContext: 'Exercícios de futuro com Will e Going to' },
    { id: 'prepositions', label: 'Preposições (In, On, At)', promptContext: 'Uso correto de preposições de tempo e lugar' },
    { id: 'conditionals', label: 'Condicionais (If clauses)', promptContext: 'Zero, First, Second and Third Conditionals' },
    { id: 'modals', label: 'Verbos Modais', promptContext: 'Can, Could, Should, Must, Might' },
    { id: 'passive', label: 'Voz Passiva', promptContext: 'Transformação de ativa para passiva e uso' },
];

const Learn = () => {
    const [mode, setMode] = useState('grammar'); // 'grammar' | 'vocabulary'
    const [topicId, setTopicId] = useState('present_tenses');
    const [level, setLevel] = useState('B1');
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadContent = async (append = false) => {
        setLoading(true);
        setError(null);
        try {
            let topicPrompt = '';
            let type = '';

            if (mode === 'grammar') {
                const selectedTopic = GRAMMAR_TOPICS.find(t => t.id === topicId);
                topicPrompt = selectedTopic ? selectedTopic.promptContext : topicId;
                type = 'Gramática';
            } else {
                topicPrompt = 'Vocabulário diversificado e útil para o dia a dia';
                type = 'Vocabulário';
            }

            // Request questions for the learning section
            const data = await fetchLearningContent(topicPrompt, level, type);

            let items = [];
            if (Array.isArray(data)) {
                items = data;
            } else if (data && (data.items || data.conteudo)) {
                items = data.items || data.conteudo;
            } else if (data && data.perguntas) {
                items = data.perguntas;
            } else if (data) {
                items = [data];
            }

            if (append) {
                setContent(prev => [...prev, ...items]);
            } else {
                setContent(items);
            }
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar conteúdo. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContent(false);
    }, [mode, topicId, level]);

    const handleLoadMore = () => {
        loadContent(true);
    };

    return (
        <div className="home-container fade-in">
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Central de Aprendizado 📚</h1>
                    <p>Pratique com flashcards inteligentes e expanda seu conhecimento.</p>
                </div>
            </div>

            <div className="content-wrapper">
                <section className="section-block">
                    <div className="section-header">
                        <span className="section-icon">⚙️</span>
                        <h2>Personalize seu Estudo</h2>
                    </div>

                    <div className="glass-card" style={{ background: 'white', border: '1px solid var(--border)' }}>
                        {/* Mode Selection Tabs */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
                            <button
                                className={mode === 'grammar' ? 'level-chip selected' : 'level-chip'}
                                onClick={() => setMode('grammar')}
                                style={{ flex: 1, fontSize: '1.1rem' }}
                            >
                                📖 Gramática
                            </button>
                            <button
                                className={mode === 'vocabulary' ? 'level-chip selected' : 'level-chip'}
                                onClick={() => setMode('vocabulary')}
                                style={{ flex: 1, fontSize: '1.1rem' }}
                            >
                                🗣️ Vocabulário
                            </button>
                        </div>

                        <div className="grid-2">
                            {mode === 'grammar' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: '600' }}>Tópico de Gramática</label>
                                    <select
                                        value={topicId}
                                        onChange={(e) => setTopicId(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', fontSize: '1rem', fontFamily: 'var(--font-body)' }}
                                    >
                                        {GRAMMAR_TOPICS.map(t => (
                                            <option key={t.id} value={t.id}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div style={{ gridColumn: mode === 'vocabulary' ? '1 / -1' : 'auto' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: '600' }}>Nível de Dificuldade</label>
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', fontSize: '1rem', fontFamily: 'var(--font-body)' }}
                                >
                                    <option value="A1">Iniciante (A1)</option>
                                    <option value="B1">Intermediário (B1)</option>
                                    <option value="C1">Avançado (C1)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {loading && (
                    <div className="loading-screen" style={{ padding: '40px' }}>
                        <div className="spinner"></div>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                            {mode === 'grammar' ? 'Gerando exercícios de gramática...' : 'Selecionando vocabulário...'}
                        </p>
                    </div>
                )}

                {error && (
                    <div style={{ padding: '20px', background: '#fef2f2', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', color: 'var(--error)', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <div className="content-grid">
                    {content.map((item, index) => (
                        <div key={index} className="learn-card" style={{ borderLeft: `6px solid ${mode === 'grammar' ? 'var(--primary)' : 'var(--accent)'}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>
                                    {mode === 'grammar' ? '✍️' : '🔤'}
                                </span>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{item.titulo || item.pergunta || "Questão"}</h3>
                            </div>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{item.explicacao || item.definicao || "Tente responder antes de ver a resposta."}</p>

                            {item.alternativas && item.alternativas.length > 0 && (
                                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px', marginTop: '16px' }}>
                                    {item.alternativas.map((alt, i) => (
                                        <li key={i} style={{
                                            padding: '12px 16px',
                                            background: '#f8fafc',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border)',
                                            color: 'var(--text-main)',
                                            fontSize: '1rem',
                                            fontWeight: '500'
                                        }}>
                                            {alt.texto}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="reveal-section" style={{ marginTop: '20px' }}>
                                <details>
                                    <summary className="start-hero-btn" style={{ display: 'inline-block', fontSize: '0.9rem', padding: '10px 24px', cursor: 'pointer', background: 'var(--surface)', color: 'var(--primary)', border: '2px solid var(--primary)', boxShadow: 'none' }}>
                                        Revelar Resposta
                                    </summary>
                                    <div className="example-box" style={{ marginTop: '20px', background: 'var(--primary-light)', borderLeftColor: 'var(--primary)' }}>
                                        {(() => {
                                            let answer = item.exemplo || item.frase || item.resposta || item.answer || item.solucao;

                                            if (!answer && item.alternativas && Array.isArray(item.alternativas)) {
                                                const correctOption = item.alternativas.find(a => a.isCorreto);
                                                if (correctOption) {
                                                    answer = correctOption.texto;
                                                }
                                            }

                                            return answer ? (
                                                <><strong>Resposta:</strong> {answer}</>
                                            ) : (
                                                <em>Resposta não disponível.</em>
                                            );
                                        })()}
                                    </div>
                                </details>
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && !error && content.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: '60px' }}>
                        <button
                            className="start-hero-btn"
                            onClick={handleLoadMore}
                            style={{ maxWidth: '300px' }}
                        >
                            Carregar Mais Perguntas
                        </button>
                    </div>
                )}

                {!loading && !error && content.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>Nenhum conteúdo encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default Learn;

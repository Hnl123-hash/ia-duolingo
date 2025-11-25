import React, { useState, useEffect } from 'react';
import { fetchLearningContent } from '../services/api';

const THEORY_TOPICS = [
    { id: 'present_simple', label: 'Present Simple' },
    { id: 'present_continuous', label: 'Present Continuous' },
    { id: 'past_simple', label: 'Past Simple' },
    { id: 'future_will', label: 'Future (Will)' },
    { id: 'articles', label: 'Articles (A/An/The)' },
    { id: 'pronouns', label: 'Pronouns' },
];

const Theory = () => {
    const [topicId, setTopicId] = useState('present_simple');
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadContent = async (append = false) => {
        setLoading(true);
        setError(null);
        try {
            const selectedTopic = THEORY_TOPICS.find(t => t.id === topicId);
            const topicLabel = selectedTopic ? selectedTopic.label : topicId;

            // We use a specific type 'Teoria' to signal the API to generate summaries
            const data = await fetchLearningContent(topicLabel, 'B1', 'Teoria');

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
    }, [topicId]);

    const handleLoadMore = () => {
        loadContent(true);
    };

    return (
        <div className="home-container fade-in">
            <div className="hero-section" style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)' }}>
                <div className="hero-content">
                    <h1>Resumos & Prática 🧠</h1>
                    <p>Aprenda a regra e aplique imediatamente.</p>
                </div>
            </div>

            <div className="content-wrapper">
                <section className="section-block">
                    <div className="section-header">
                        <span className="section-icon">📖</span>
                        <h2>Escolha o Tópico</h2>
                    </div>

                    <div className="glass-card" style={{ background: 'white', border: '1px solid var(--border)' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: '600' }}>Tópico Gramatical</label>
                        <select
                            value={topicId}
                            onChange={(e) => setTopicId(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', fontSize: '1rem', fontFamily: 'var(--font-body)' }}
                        >
                            {THEORY_TOPICS.map(t => (
                                <option key={t.id} value={t.id}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                </section>

                {error && (
                    <div style={{ padding: '20px', background: '#fef2f2', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', color: 'var(--error)', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <div className="content-grid">
                    {content.map((item, index) => (
                        <div key={index} className="learn-card" style={{ borderLeft: '6px solid #8b5cf6' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.4rem', color: '#8b5cf6' }}>Regra:</h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-main)', background: '#f5f3ff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ddd6fe' }}>
                                    {item.pergunta || item.titulo || "Resumo da regra..."}
                                </p>
                            </div>

                            <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-muted)' }}>Qual frase aplica a regra corretamente?</h4>

                            {item.alternativas && item.alternativas.length > 0 && (
                                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '12px', marginBottom: '24px' }}>
                                    {item.alternativas.map((alt, i) => (
                                        <li key={i} style={{
                                            padding: '16px',
                                            background: 'white',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border)',
                                            color: 'var(--text-main)',
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: '#f3f4f6',
                                                marginRight: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                color: 'var(--text-muted)'
                                            }}>{i + 1}</span>
                                            {alt.texto}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="reveal-section" style={{ marginTop: '20px' }}>
                                <details>
                                    <summary className="start-hero-btn" style={{ display: 'inline-block', fontSize: '0.9rem', padding: '10px 24px', cursor: 'pointer', background: 'var(--surface)', color: '#8b5cf6', border: '2px solid #8b5cf6', boxShadow: 'none' }}>
                                        Ver Resposta Correta
                                    </summary>
                                    <div className="example-box" style={{ marginTop: '20px', background: '#f5f3ff', borderLeftColor: '#8b5cf6' }}>
                                        {(() => {
                                            let answer = item.resposta || item.solucao;

                                            if (!answer && item.alternativas && Array.isArray(item.alternativas)) {
                                                const correctOption = item.alternativas.find(a => a.isCorreto);
                                                if (correctOption) {
                                                    answer = correctOption.texto;
                                                }
                                            }

                                            return (
                                                <>
                                                    <div style={{ marginBottom: '8px' }}><strong>Resposta Correta:</strong> {answer || "Indisponível"}</div>
                                                    {item.explicacao && (
                                                        <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>💡 {item.explicacao}</div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </details>
                            </div>
                        </div>
                    ))}
                </div>

                {loading && (
                    <div className="loading-screen" style={{ padding: '40px' }}>
                        <div className="spinner" style={{ borderTopColor: '#8b5cf6' }}></div>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Gerando resumo e exercícios...</p>
                    </div>
                )}

                {!loading && !error && content.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: '60px' }}>
                        <button
                            className="start-hero-btn"
                            onClick={handleLoadMore}
                            style={{ maxWidth: '300px', background: '#8b5cf6', borderColor: '#8b5cf6' }}
                        >
                            Carregar Mais Resumos
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

export default Theory;

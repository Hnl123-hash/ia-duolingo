import React, { useState } from 'react';

const Quiz = ({ questions, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null); // { type: 'correct' | 'incorrect', message: '' }

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionClick = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
    };

    const handleCheckAnswer = () => {
        if (!selectedOption) return;

        const isCorrect = selectedOption.isCorreto;
        setIsAnswered(true);

        if (isCorrect) {
            setScore(score + 1);
            setFeedback({ type: 'correct', message: 'Mandou bem!' });
            // Play sound effect here if we had them
        } else {
            setFeedback({ type: 'incorrect', message: `Resposta correta: ${currentQuestion.alternativas.find(a => a.isCorreto).texto}. ${selectedOption.explicacao || ''}` });
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setFeedback(null);
        } else {
            onComplete(score, questions.length);
        }
    };

    const progress = ((currentQuestionIndex) / questions.length) * 100;

    return (
        <div className="quiz-container">
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="question-card glass-card">
                <h2 className="question-text">{currentQuestion.pergunta}</h2>

                <div className="options-grid">
                    {currentQuestion.alternativas.map((option, index) => (
                        <button
                            key={index}
                            className={`option-btn ${selectedOption === option ? 'selected' : ''} ${isAnswered && option.isCorreto ? 'correct' : ''} ${isAnswered && selectedOption === option && !option.isCorreto ? 'incorrect' : ''}`}
                            onClick={() => handleOptionClick(option)}
                            disabled={isAnswered}
                        >
                            <span className="option-key" style={{ marginRight: '15px', fontWeight: 'bold', color: 'var(--primary)' }}>{index + 1}</span>
                            <span className="option-text">{option.texto}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={`footer ${isAnswered ? (feedback.type === 'correct' ? 'footer-correct' : 'footer-incorrect') : ''}`} style={{ position: 'relative', background: 'transparent', border: 'none', padding: '0', marginTop: '20px' }}>
                {!isAnswered ? (
                    <button
                        className="btn-primary"
                        onClick={handleCheckAnswer}
                        disabled={!selectedOption}
                        style={{ width: '100%' }}
                    >
                        VERIFICAR
                    </button>
                ) : (
                    <div className={`feedback-area ${feedback.type}`}>
                        <div className="feedback-content">
                            <div className="feedback-icon">
                                {feedback.type === 'correct' ? '✅' : '❌'}
                            </div>
                            <div className="feedback-text">
                                <h3 style={{ fontSize: '1.2rem', color: feedback.type === 'correct' ? 'var(--success)' : 'var(--error)' }}>
                                    {feedback.type === 'correct' ? 'Correto!' : 'Incorreto'}
                                </h3>
                                <p style={{ margin: 0 }}>{feedback.message}</p>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handleNextQuestion}>
                            CONTINUAR
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quiz;

import React, { useEffect, useState } from 'react';
import './QuestionPage.css';

const QuestionPage = ({ question, currentIndex, totalQuestions, onAnswer, onBack }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [question]);

  const handleAnswerClick = (value) => {
    setIsVisible(false);
    setTimeout(() => onAnswer(value), 300);
  };

  const handleBack = () => {
    setIsVisible(false);
    setTimeout(() => onBack(), 300);
  };

  return (
    <div className={`question-page ${isVisible ? 'visible' : ''}`}>
      <div className="question-content">
        <button className="back-button" onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19L5 12L12 5" />
          </svg>
        </button>

        <div className="question-progress">
          <span className="progress-text">{currentIndex + 1} / {totalQuestions}</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        <h2 className="question-text">{question.question}</h2>

        <div className={`options-list ${question.type === 'mbti' ? 'options-grid' : ''}`}>
          {question.options.map((option, index) => (
            <button
              key={option.value}
              className="option-button"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleAnswerClick(option.value)}
            >
              <span className="option-text">{option.text}</span>
              {question.type !== 'mbti' && <span className="option-arrow">→</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="question-bg-gradient"></div>
    </div>
  );
};

export default QuestionPage;

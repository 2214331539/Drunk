import React, { useEffect, useState } from 'react';
import logoImage from '../../imgs/logo.png';
import './QuestionPage.css';

const QuestionPage = ({ question, currentIndex, totalQuestions, onAnswer, onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const isSbtiQuestion = question.type === 'sbti';
  const helperLine = isSbtiQuestion
    '直接选你测出的 SBTI。'
    

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
      <div className="question-shell">
        <div className="question-topline">
          <button className="back-button" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19L5 12L12 5" />
            </svg>
          </button>

          <div className="question-progress">
            <span className="progress-badge">Q{currentIndex + 1}</span>
            <div className="progress-copy">
              <strong>{currentIndex + 1} / {totalQuestions}</strong>
              <span>{helperLine}</span>
            </div>
          </div>
        </div>

        <div className="question-card">
          <div className="question-card-head">
            <span className="question-tag">
              {isSbtiQuestion ? 'SBTI 人格' : '当下心情'}
            </span>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="question-image-slot" aria-hidden="true">
            <img className="question-logo-image" src={logoImage} alt="" />
          </div>

          <h2 className="question-text">{question.question}</h2>
          <p className="question-note">{helperLine}</p>

          <div className={`options-list ${isSbtiQuestion ? 'options-grid' : ''}`}>
            {question.options.map((option, index) => {
              const [optionCode, optionLabel = option.text] = isSbtiQuestion
                ? option.text.split(' - ')
                : [null, option.text];

              return (
                <button
                  key={option.value}
                  className="option-button"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleAnswerClick(option.value)}
                >
                  <span className="option-marker">
                    {isSbtiQuestion ? optionCode : `0${index + 1}`.slice(-2)}
                  </span>

                  <span className="option-text">{optionLabel}</span>

                  <span className="option-arrow">{isSbtiQuestion ? '✓' : '→'}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;

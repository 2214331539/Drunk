import React, { useEffect, useState } from 'react';
import './QuestionPage.css';

const QuestionPage = ({ question, currentIndex, totalQuestions, onAnswer, onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const helperLine = question.type === 'mbti'
    ? '别选标准答案，选最像你的。'
    : '按第一反应点，火柴人替你记着。';

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
              {question.type === 'mbti' ? '人格速配' : '当下心情'}
            </span>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="question-sketch" aria-hidden="true">
            <svg className="question-doodle" viewBox="0 0 120 120">
              <path className="stroke-main" d="M45 32c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20Z" />
              <path className="stroke-main" d="M65 54v24" />
              <path className="stroke-main" d="M65 62l-19 11" />
              <path className="stroke-main" d="M65 62l18 6" />
              <path className="stroke-main" d="M65 78L51 102" />
              <path className="stroke-main" d="M65 78l18 23" />
              <path className="stroke-accent" d="M86 27c9-10 21-13 31-8 7 4 11 12 10 22-11 4-22 4-33-1" />
              <path className="stroke-main" d="M88 45l-7 9" />
              <path className="stroke-accent-alt" d="M22 66c5-9 13-15 23-16" />
            </svg>

            <p className="question-note">{helperLine}</p>
          </div>

          <h2 className="question-text">{question.question}</h2>

          <div className={`options-list ${question.type === 'mbti' ? 'options-grid' : ''}`}>
            {question.options.map((option, index) => {
              const [optionCode, optionLabel = option.text] = question.type === 'mbti'
                ? option.text.split(' - ')
                : [null, option.text];

              return (
                <button
                  key={option.value}
                  className="option-button"
                  data-tone={index % 4}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleAnswerClick(option.value)}
                >
                  <span className="option-marker">
                    {question.type === 'mbti' ? optionCode : `0${index + 1}`.slice(-2)}
                  </span>

                  <span className="option-copy">
                    <span className="option-text">{optionLabel}</span>
                    <span className="option-meta">
                      {question.type === 'mbti' ? '人格代号' : '第一反应就好'}
                    </span>
                  </span>

                  <span className="option-arrow">{question.type === 'mbti' ? '✓' : '→'}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="question-bg-doodles" aria-hidden="true">
        <svg className="bg-doodle bg-doodle-left" viewBox="0 0 120 120">
          <path className="stroke-main" d="M14 61c20-29 46-44 77-45" />
          <path className="stroke-accent" d="M37 94c16-4 31 0 46 12" />
        </svg>
        <svg className="bg-doodle bg-doodle-right" viewBox="0 0 120 120">
          <path d="M19 12H5M12 19L5 12L12 5" />
          <path className="stroke-main" d="M14 24c16 8 29 21 39 39" />
          <path className="stroke-accent-alt" d="M66 23c8-10 18-15 32-14" />
        </svg>
      </div>
    </div>
  );
};

export default QuestionPage;

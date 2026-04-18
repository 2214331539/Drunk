import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import './ResultPage.css';

const ResultPage = ({ result, onRestart }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const currentCocktail = result.cocktails[currentIndex];
  const isLast = currentIndex === result.cocktails.length - 1;
  const isFirst = currentIndex === 0;
  const rankTone = currentCocktail.rank === 1
    ? 'champion'
    : currentCocktail.rank === 2
      ? 'runner'
      : currentCocktail.rank === 3
        ? 'third'
        : 'wild';
  const rankLabel = currentCocktail.rank === 1
    ? '今日最佳匹配'
    : currentCocktail.rank <= 3
      ? `高匹配 No.${currentCocktail.rank}`
      : `隐藏惊喜 No.${currentCocktail.rank}`;

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && !isLast) {
        setCurrentIndex((prev) => prev + 1);
      } else if (diff < 0 && !isFirst) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  };

  const handleMouseDown = (e) => {
    setTouchStart(e.clientX);
  };

  const handleMouseUp = (e) => {
    const diff = touchStart - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && !isLast) {
        setCurrentIndex((prev) => prev + 1);
      } else if (diff < 0 && !isFirst) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  };

  const handleShare = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          scale: 2,
          backgroundColor: null,
          logging: false
        });
        const image = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.download = `我的微醺解药-${currentCocktail.name}.png`;
        link.href = image;
        link.click();
      } catch (error) {
        console.error('生成图片失败:', error);
      }
    }
  };

  return (
    <div className={`result-page ${isVisible ? 'visible' : ''}`}>
      <div className="result-content">
        <div className="result-intro">
          <div className="mbti-badge">
            <span className="mbti-type">{result.sbti}</span>
            <span className="mbti-name">{result.sbtiInfo.name}</span>
          </div>

          <p className="mbti-shortdesc">{result.sbtiInfo.shortdesc}</p>
          <p className="mbti-description">{result.sbtiInfo.desc}</p>
        </div>

        <div
          className="cards-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div
            className="result-card"
            data-rank={rankTone}
            ref={cardRef}
          >
            <div className="result-header">
              <span className="result-label">{rankLabel}</span>
              <span className="match-score">{currentCocktail.displayMatch}%</span>
            </div>

            <div className="poster-headline">
              <h2 className="drink-name">{currentCocktail.name}</h2>
              <p className="drink-english">{currentCocktail.english_name}</p>
              <p className="poster-caption">{currentCocktail.spotlightTitle}</p>
            </div>

            <div className="poster-stage" aria-hidden="true">
              <span className="poster-emoji">🍸</span>

              <svg className="result-doodle" viewBox="0 0 360 240">
                <path className="stroke-main" d="M130 82c0-20 16-36 36-36s36 16 36 36-16 36-36 36-36-16-36-36Z" />
                <path className="stroke-main" d="M166 118v58" />
                <path className="stroke-main" d="M166 134l-58 26" />
                <path className="stroke-main" d="M166 134l56-30" />
                <path className="stroke-main" d="M166 176l-42 46" />
                <path className="stroke-main" d="M166 176l48 42" />
                <path className="stroke-accent" d="M220 86l12 40 32-8-11-39Z" />
                <path className="stroke-main" d="M70 214c67-17 151-18 231-2" />
                <path className="stroke-accent-alt" d="M84 66c11-15 28-23 50-23" />
              </svg>
            </div>

            <div className="reason-block">
              <span className="reason-heading">{currentCocktail.reasonHeading}</span>
              <p className="result-reason">{currentCocktail.personalizedReason}</p>
            </div>

            <div className="wine-info">
              <div className="info-item">
                <span className="info-label">基酒</span>
                <span className="info-value">{currentCocktail.base_liquor}</span>
              </div>
              <div className="info-item">
                <span className="info-label">参考价</span>
                <span className="info-value">{currentCocktail.priceText}</span>
              </div>
            </div>

            <div className="result-footer">
              <span className="footer-logo">白日微醺 / Stick Mood Mix</span>
              <span>{currentIndex + 1} / {result.cocktails.length}</span>
            </div>
          </div>
        </div>

        <div className="slide-indicators">
          {result.cocktails.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`查看第 ${index + 1} 个推荐`}
            />
          ))}
        </div>

        {result.cocktails.length > 1 && (
          <p className="slide-hint">
            {currentIndex < result.cocktails.length - 1
              ? '左右划一划，看看火柴人还给你留了哪几杯。'
              : '已经滑到最后一杯了。'}
          </p>
        )}

        <div className="result-actions">
          <button className="action-button secondary" onClick={onRestart}>
            再测一次
          </button>
          <button className="action-button primary" onClick={handleShare}>
            保存这张海报
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;

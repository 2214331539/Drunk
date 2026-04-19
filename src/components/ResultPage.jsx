import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import './ResultPage.css';

const ResultPage = ({ result, onRestart }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [isArtworkOpen, setIsArtworkOpen] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setIsArtworkOpen(false);
  }, [currentIndex]);

  const currentCocktail = result.cocktails[currentIndex];
  const imageSrc = currentCocktail.imageUrl
    || currentCocktail.image_url
    || currentCocktail.cover
    || currentCocktail.image;
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

  const renderPosterStage = (variant = 'compact') => (
    <div className={`poster-stage ${variant} ${imageSrc ? 'has-image' : 'is-placeholder'}`}>
      <div className="poster-media">
        {imageSrc ? (
          <img
            className="poster-image"
            src={imageSrc}
            alt={`${currentCocktail.name} 展示图`}
          />
        ) : (
          <div className="poster-placeholder" aria-hidden="true">
            <span className="poster-placeholder-badge">图片占位</span>
            <div className="poster-placeholder-center">
              <span className="poster-placeholder-mark">+</span>
              <span className="poster-placeholder-copy">
                后续可插入产品图 / 海报图
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="poster-meta">
        <span className="poster-meta-name">{currentCocktail.name}</span>
        <span className="poster-meta-tip">
          {variant === 'compact' ? '点击放大' : '点击空白处关闭'}
        </span>
      </div>
    </div>
  );

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

            <div className="reason-block">
              <span className="reason-label">{currentCocktail.reasonLabel}</span>
              <h3 className="reason-title">{currentCocktail.reasonHeading}</h3>
              <p className="result-reason">{currentCocktail.personalizedReason}</p>
            </div>

            <div className="result-support">
              <button
                type="button"
                className="poster-preview"
                onClick={() => setIsArtworkOpen(true)}
                aria-label={`放大查看 ${currentCocktail.name} 图片框`}
              >
                {renderPosterStage('compact')}
              </button>

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
              ? '左右划一划，看看还有哪几杯更适合你。'
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

      {isArtworkOpen && (
        <div
          className="artwork-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${currentCocktail.name} 图片预览`}
          onClick={() => setIsArtworkOpen(false)}
        >
          <div className="artwork-panel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="artwork-close"
              onClick={() => setIsArtworkOpen(false)}
              aria-label="关闭大图"
            >
              ×
            </button>

            {renderPosterStage('expanded')}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;

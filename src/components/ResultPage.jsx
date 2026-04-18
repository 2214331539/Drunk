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

  const currentWine = result.wines[currentIndex];
  const isLast = currentIndex === result.wines.length - 1;
  const isFirst = currentIndex === 0;
  const posterReason = currentWine.matchReason
    || `你的情绪答案把 ${currentWine.name} 推进了今天的推荐列表，它会比第一眼看上去更适合你现在的状态。`;
  const rankTone = currentWine.rank === 1
    ? 'champion'
    : currentWine.rank === 2
      ? 'runner'
      : currentWine.rank === 3
        ? 'third'
        : 'wild';
  const rankLabel = currentWine.rank === 1
    ? '今日最佳匹配'
    : currentWine.rank <= 3
      ? `高匹配 No.${currentWine.rank}`
      : `隐藏惊喜 No.${currentWine.rank}`;
  const posterCaption = currentWine.rank === 1
    ? '这杯像是专门替你留的。'
    : currentWine.rank <= 3
      ? '风格不同，但气质依然对路。'
      : '不是第一眼主角，但越看越顺。';

  // 滑动处理
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // 滑动阈值
    if (Math.abs(diff) > 50) {
      if (diff > 0 && !isLast) {
        // 左滑，下一个
        setCurrentIndex(prev => prev + 1);
      } else if (diff < 0 && !isFirst) {
        // 右滑，上一个
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  // 鼠标拖动处理
  const handleMouseDown = (e) => {
    setTouchStart(e.clientX);
  };

  const handleMouseUp = (e) => {
    const diff = touchStart - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && !isLast) {
        setCurrentIndex(prev => prev + 1);
      } else if (diff < 0 && !isFirst) {
        setCurrentIndex(prev => prev - 1);
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
        link.download = `我的微醺解药-${currentWine.name}.png`;
        link.href = image;
        link.click();
      } catch (error) {
        console.error('生成图片失败:', error);
      }
    }
  };

  // 移除了旧的渐变函数，使用 CSS data-rank 属性

  return (
    <div className={`result-page ${isVisible ? 'visible' : ''}`}>
      <div className="result-content">
        {/* MBTI 信息 */}
        <div className="result-intro">
          <div className="mbti-badge">
            <span className="mbti-type">{result.mbti}</span>
            <span className="mbti-name">{result.mbtiInfo.name}</span>
          </div>

          <p className="mbti-description">{result.mbtiInfo.desc}</p>

          <div className="keyword-list">
            {result.mbtiInfo.keywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </div>

        {/* 卡片容器 */}
        <div
          className="cards-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {/* 结果卡片 */}
          <div
            className="result-card"
            data-rank={rankTone}
            ref={cardRef}
          >
            <span className="tape tape-left"></span>
            <span className="tape tape-right"></span>

            <div className="result-header">
              <span className="result-label">{rankLabel}</span>
              <span className="match-score">{currentWine.displayMatch}%</span>
            </div>

            <div className="poster-headline">
              <h2 className="drink-name">{currentWine.name}</h2>
              <p className="poster-caption">{posterCaption}</p>
            </div>

            <div className="poster-stage" aria-hidden="true">
              <span className="poster-type">{currentWine.type}</span>
              <span className="poster-emoji">{currentWine.image}</span>
              <span className="poster-bubble">今晚喝这杯？</span>

              <svg className="result-doodle" viewBox="0 0 360 240">
                <path className="stroke-main" d="M130 82c0-20 16-36 36-36s36 16 36 36-16 36-36 36-36-16-36-36Z" />
                <path className="stroke-main" d="M166 118v58" />
                <path className="stroke-main" d="M166 134l-58 26" />
                <path className="stroke-main" d="M166 134l56-30" />
                <path className="stroke-main" d="M166 176l-42 46" />
                <path className="stroke-main" d="M166 176l48 42" />
                <path className="stroke-accent" d="M220 86l12 40 32-8-11-39Z" />
                <path className="stroke-main" d="M252 84c16 7 30 23 36 40" />
                <path className="stroke-main" d="M106 168c-18 6-36 18-45 34" />
                <path className="stroke-accent-alt" d="M80 72c9-20 29-32 53-32" />
                <path className="stroke-accent-alt" d="M262 150c20 3 36 16 43 34" />
                <path className="stroke-main" d="M70 214c67-17 151-18 231-2" />
                <path className="stroke-main" d="M84 42l20 16" />
                <path className="stroke-main" d="M98 25l4-21" />
                <path className="stroke-main" d="M118 22l16-14" />
                <path className="stroke-main" d="M268 46l21-10" />
                <path className="stroke-main" d="M284 63l18 10" />
                <path className="stroke-main" d="M274 28l8-17" />
              </svg>
            </div>

            <p className="result-reason">{posterReason}</p>

            <div className="wine-info">
              <div className="info-item">
                <span className="info-label">风味</span>
                <span className="info-value">{currentWine.flavor}</span>
              </div>
              <div className="info-item">
                <span className="info-label">酒精度</span>
                <span className="info-value">{currentWine.alcohol}</span>
              </div>
            </div>

            <div className="result-footer">
              <span className="footer-logo">白日微醺 / Stick Mood Mix</span>
              <span>{currentIndex + 1} / {result.wines.length}</span>
            </div>
          </div>
        </div>

        {/* 滑动指示器 */}
        <div className="slide-indicators">
          {result.wines.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`查看第 ${index + 1} 个推荐`}
            />
          ))}
        </div>

        {/* 滑动提示 */}
        {result.wines.length > 1 && (
          <p className="slide-hint">
            {currentIndex < result.wines.length - 1
              ? '左右划一划，看看火柴人还给你留了哪几杯。'
              : '已经滑到最后一杯了。'}
          </p>
        )}

        {/* 操作按钮 */}
        <div className="result-actions">
          <button className="action-button secondary" onClick={onRestart}>
            再测一次
          </button>
          <button className="action-button primary" onClick={handleShare}>
            保存这张海报
          </button>
        </div>
      </div>

      <div className="result-bg-doodles" aria-hidden="true">
        <span className="result-spark spark-left"></span>
        <span className="result-spark spark-right"></span>
      </div>
    </div>
  );
};

export default ResultPage;

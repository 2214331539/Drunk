import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import './ResultPage.css';

const ResultPage = ({ result, onRestart }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const currentWine = result.wines[currentIndex];
  const isLast = currentIndex === result.wines.length - 1;
  const isFirst = currentIndex === 0;

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
        <div className="mbti-badge">
          <span className="mbti-type">{result.mbti}</span>
          <span className="mbti-name">{result.mbtiInfo.name}</span>
        </div>

        {/* 卡片容器 */}
        <div
          className="cards-container"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {/* 结果卡片 */}
          <div
            className="result-card"
            data-rank={currentWine.rank <= 3 ? currentWine.rank : "other"}
            ref={currentIndex === 0 ? cardRef : null}
          >
            <div className="result-header">
              <span className="result-label">
                {currentWine.rank === 1 ? '✦ 最佳匹配' : `第 ${currentWine.rank} 匹配`}
              </span>
              <span className="match-score">{currentWine.displayMatch}% 匹配</span>
            </div>

            <div className="result-drink">
              <div className="drink-icon">{currentWine.image}</div>
              <h2 className="drink-name">{currentWine.name}</h2>
              <span className="drink-type">{currentWine.type}</span>
            </div>

            <div className="result-divider"></div>

            <p className="result-reason">{currentWine.matchReason}</p>

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
              <span className="footer-logo">白日微醺</span>
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
            {currentIndex < result.wines.length - 1 ? '← 滑动查看更多推荐 →' : '已到最后一个推荐'}
          </p>
        )}

        {/* 操作按钮 */}
        <div className="result-actions">
          <button className="action-button secondary" onClick={onRestart}>
            重新测试
          </button>
          <button className="action-button primary" onClick={handleShare}>
            保存当前卡片
          </button>
        </div>
      </div>

      <div className="result-bg-gradient"></div>
    </div>
  );
};

export default ResultPage;

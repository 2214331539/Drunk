import React, { useEffect, useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './ResultPage.css';

const characterImageModules = import.meta.glob(
  '../../imgs/character/*.{png,jpg,jpeg,webp,avif}',
  { eager: true, import: 'default' }
);
const drinkImageModules = import.meta.glob(
  '../../imgs/drinks/*.{png,jpg,jpeg,webp,avif}',
  { eager: true, import: 'default' }
);

function buildAssetMap(modules) {
  return Object.entries(modules).reduce((assetMap, [path, assetUrl]) => {
    const fileName = path.split('/').pop()?.replace(/\.[^.]+$/, '');

    if (fileName && !assetMap[fileName]) {
      assetMap[fileName] = assetUrl;
    }

    return assetMap;
  }, {});
}

function normalizeAssetKey(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/!/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const characterImageMap = buildAssetMap(characterImageModules);
const drinkImageMap = buildAssetMap(drinkImageModules);
const characterImageAliasMap = {
  drunk: 'drun-k'
};

function hashString(text = '') {
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seedSource) {
  let seed = hashString(seedSource) || 1;

  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function createAmbientParticles(seedSource, count = 26) {
  const random = createSeededRandom(seedSource);
  const tones = ['lime', 'blue', 'pink', 'yellow'];
  const shapes = ['dot', 'diamond', 'spark'];

  return Array.from({ length: count }, (_, index) => ({
    id: `ambient-${index}`,
    left: `${random() * 100}%`,
    top: `${random() * 100}%`,
    size: `${6 + random() * 12}px`,
    duration: `${10 + random() * 8}s`,
    delay: `${-random() * 8}s`,
    driftX: `${-40 + random() * 80}px`,
    driftY: `${-28 - random() * 140}px`,
    opacity: `${0.18 + random() * 0.42}`,
    tone: tones[Math.floor(random() * tones.length)],
    shape: shapes[Math.floor(random() * shapes.length)]
  }));
}

function createBurstParticles(seedSource, count = 22) {
  const random = createSeededRandom(seedSource);
  const tones = ['lime', 'blue', 'pink', 'yellow'];
  const shapes = ['dot', 'diamond', 'line'];

  return Array.from({ length: count }, (_, index) => {
    const angle = random() * Math.PI * 2;
    const radius = 78 + random() * 152;
    const originX = 50 + (random() - 0.5) * 12;
    const originY = 38 + (random() - 0.5) * 12;

    return {
      id: `burst-${index}`,
      left: `${originX}%`,
      top: `${originY}%`,
      size: `${5 + random() * 12}px`,
      duration: `${0.8 + random() * 0.7}s`,
      delay: `${random() * 0.18}s`,
      tx: `${Math.cos(angle) * radius}px`,
      ty: `${Math.sin(angle) * radius}px`,
      rotate: `${-90 + random() * 180}deg`,
      tone: tones[Math.floor(random() * tones.length)],
      shape: shapes[Math.floor(random() * shapes.length)]
    };
  });
}

function resolveCharacterImage(sbtiCode) {
  const normalizedCode = normalizeAssetKey(sbtiCode);
  const assetKey = characterImageAliasMap[normalizedCode] || normalizedCode;

  return characterImageMap[assetKey] || null;
}

function resolveDrinkImage(cocktail) {
  if (!cocktail) {
    return null;
  }

  return cocktail.imageUrl
    || cocktail.image_url
    || cocktail.cover
    || cocktail.image
    || drinkImageMap[cocktail.id]
    || null;
}

function waitForNextFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve);
    });
  });
}

function waitForFonts() {
  if (!document.fonts?.ready) {
    return Promise.resolve();
  }

  return document.fonts.ready.catch(() => undefined);
}

function waitForImages(container) {
  const images = Array.from(container.querySelectorAll('img'));
  const pendingImages = images.filter((image) => !image.complete);

  if (!pendingImages.length) {
    return Promise.resolve();
  }

  return Promise.all(
    pendingImages.map(
      (image) =>
        new Promise((resolve) => {
          const finish = () => {
            image.removeEventListener('load', finish);
            image.removeEventListener('error', finish);
            resolve();
          };

          image.addEventListener('load', finish, { once: true });
          image.addEventListener('error', finish, { once: true });
        })
    )
  );
}

const ResultPage = ({ result, onRestart }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [isArtworkOpen, setIsArtworkOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const captureRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setIsArtworkOpen(false);
  }, [currentIndex]);

  useEffect(() => {
    setIsDescriptionExpanded(false);
  }, [result.sbti]);

  const currentCocktail = result.cocktails[currentIndex];
  const imageSrc = useMemo(
    () => resolveDrinkImage(currentCocktail),
    [currentCocktail]
  );
  const characterImageSrc = useMemo(
    () => resolveCharacterImage(result.sbti),
    [result.sbti]
  );
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
  const frameKey = `${currentCocktail.id}-${currentIndex}`;
  const ambientParticles = useMemo(
    () => createAmbientParticles(`${result.sbti}-result-atmosphere`),
    [result.sbti]
  );
  const burstParticles = useMemo(
    () => createBurstParticles(frameKey),
    [frameKey]
  );

  const handleTouchStart = (event) => {
    setTouchStart(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    const touchEnd = event.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && !isLast) {
        setCurrentIndex((prev) => prev + 1);
      } else if (diff < 0 && !isFirst) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  };

  const handleMouseDown = (event) => {
    setTouchStart(event.clientX);
  };

  const handleMouseUp = (event) => {
    const diff = touchStart - event.clientX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && !isLast) {
        setCurrentIndex((prev) => prev + 1);
      } else if (diff < 0 && !isFirst) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  };

  const handleShare = async () => {
    if (!captureRef.current || isSharing) {
      return;
    }

    setIsSharing(true);

    try {
      await waitForFonts();
      await waitForImages(captureRef.current);
      await waitForNextFrame();

      const canvas = await html2canvas(captureRef.current, {
        scale: Math.min(window.devicePixelRatio || 2, 3),
        backgroundColor: null,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        onclone: (clonedDocument) => {
          clonedDocument.body.classList.add('is-exporting-result');
        }
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');

      link.download = `stick-mood-result-${currentCocktail.id}.png`;
      link.href = image;
      link.click();
      setIsSharing(false);
    } catch (error) {
      setIsSharing(false);
      console.error('生成图片失败:', error);
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
        <span className="poster-meta-tip subtle">
          {variant === 'compact' ? '点击放大' : '点击空白处关闭'}
        </span>
      </div>
    </div>
  );

  return (
    <div className={`result-page ${isVisible ? 'visible' : ''}`}>
      <div className="result-atmosphere" aria-hidden="true">
        <div className="atmosphere-glow glow-one" />
        <div className="atmosphere-glow glow-two" />
        <div className="atmosphere-glow glow-three" />

        {ambientParticles.map((particle) => (
          <span
            key={particle.id}
            className={`ambient-particle ${particle.tone} ${particle.shape}`}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
              '--drift-x': particle.driftX,
              '--drift-y': particle.driftY
            }}
          />
        ))}
      </div>

      <div className="result-content">
        <div className="result-share-shell" ref={captureRef}>
        <div className="result-intro">
          <div className="mbti-intro-head">
            <div className="mbti-intro-copy">
              <div className="mbti-badge">
                <span className="mbti-type">{result.sbti}</span>
                <span className="mbti-name">{result.sbtiInfo.name}</span>
              </div>

              <p className="mbti-shortdesc">{result.sbtiInfo.shortdesc}</p>
            </div>

            <div className="mbti-portrait-shell">
              {characterImageSrc ? (
                <img
                  className="mbti-portrait"
                  src={characterImageSrc}
                  alt={`${result.sbti} portrait`}
                />
              ) : (
                <div className="mbti-portrait-placeholder" aria-hidden="true">
                  <span>{result.sbti}</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className={`mbti-description-panel ${isDescriptionExpanded ? 'expanded' : ''}`}
            onClick={() => setIsDescriptionExpanded((current) => !current)}
            aria-expanded={isDescriptionExpanded}
          >
            <p className={`mbti-description ${isDescriptionExpanded ? 'expanded' : ''}`}>
              {result.sbtiInfo.desc}
            </p>
            <span className="mbti-description-toggle">
              {isDescriptionExpanded ? '收起人格描述' : '点击展开人格描述'}
            </span>
          </button>
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
            >
            <div className="result-card-frame" key={frameKey}>
              <div className="card-transition-shell" aria-hidden="true">
                <div className="card-transition-veil" />
                <div className="card-transition-core" />
                <div className="card-transition-rune rune-outer" />
                <div className="card-transition-rune rune-inner" />
                <div className="card-transition-rays" />
                <div className="card-transition-flare" />
                <div className="card-transition-sweep" />

                {burstParticles.map((particle) => (
                  <span
                    key={particle.id}
                    className={`burst-particle ${particle.tone} ${particle.shape}`}
                    style={{
                      left: particle.left,
                      top: particle.top,
                      width: particle.size,
                      height: particle.size,
                      animationDuration: particle.duration,
                      animationDelay: particle.delay,
                      '--tx': particle.tx,
                      '--ty': particle.ty,
                      '--rotate': particle.rotate
                    }}
                  />
                ))}
              </div>

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
          <button className="action-button primary" onClick={handleShare} disabled={isSharing}>
            {isSharing ? '生成中...' : '保存这张海报'}
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
          <div className="artwork-panel" onClick={(event) => event.stopPropagation()}>
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

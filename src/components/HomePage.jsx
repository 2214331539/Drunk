import React from 'react';
import './HomePage.css';

const HomePage = ({ onStart }) => {
  return (
    <div className="home-page">
      <div className="home-panel">
        <p className="home-kicker">Stick Mood Lab</p>

        <div className="home-copy">
          <h1 className="home-title">
            <span className="title-main">白日微醺</span>
            <span className="title-sub">Stick Mood Lab</span>
          </h1>

          <p className="home-description">
            用更轻松的方式，测出今天更适合你的那一杯。
            6 个问题，换一张更有氛围感的推荐结果。
          </p>
        </div>

        <div className="home-scene" aria-hidden="true">
          <div className="scene-caption">哪杯像今天的你？</div>

          <div className="scene-image-frame">
            <span className="scene-image-tag">封面图占位</span>

            <div className="scene-image-inner">
              <span className="scene-image-plus">+</span>
              <span className="scene-image-hint">后续可插入品牌图 / 酒品主视觉</span>
            </div>
          </div>
        </div>

        <button className="start-button" onClick={onStart}>
          <span className="button-main">开始测试</span>
          <span className="button-sub">6 个问题 · 约 1 分钟</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;

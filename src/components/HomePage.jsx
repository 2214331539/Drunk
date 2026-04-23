import React from 'react';
import logoImage from '../../imgs/logo.png';
import './HomePage.css';

const HomePage = ({ onStart }) => {
  return (
    <div className="home-page">
      <div className="home-panel">
        <p className="home-kicker">Stick Mood Lab</p>

        <div className="home-copy">
          <h1 className="home-title">
            <span className="title-main">微醺时刻</span>
            <span className="title-sub">Stick Mood Lab</span>
          </h1>

          <p className="home-description">
            用更轻松的方式，测出今天更适合你的那一杯。
            6 个问题，换一杯微醺的酒。
          </p>
        </div>

        <div className="home-scene" aria-hidden="true">
          <div className="scene-caption">哪个像今天的你？</div>

          <div className="scene-image-frame">
            <img className="scene-logo-image" src={logoImage} alt="" />
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

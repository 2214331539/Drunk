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
            火柴人负责气氛，推荐结果负责认真。
          </p>
        </div>

        <div className="home-scene" aria-hidden="true">
          <div className="scene-caption">哪杯像今天的你？</div>

          <svg className="home-doodle" viewBox="0 0 360 260">
            <path className="board-fill" d="M38 28 H320 a20 20 0 0 1 20 20 V212 a22 22 0 0 1 -22 22 H58 a22 22 0 0 1 -22 -22 V48 a20 20 0 0 1 20 -20 Z" />
            <path className="stroke-main" d="M149 70c0-18 14-32 31-32s31 14 31 32-14 32-31 32-31-14-31-32Z" />
            <path className="stroke-main" d="M180 104v58" />
            <path className="stroke-main" d="M180 128l-46 22" />
            <path className="stroke-main" d="M180 128l44-12" />
            <path className="stroke-main" d="M180 162l-34 50" />
            <path className="stroke-main" d="M180 162l36 50" />
            <path className="stroke-main" d="M118 214h118" />
            <path className="stroke-main" d="M223 90c24-12 48 0 48 23 0 10-5 18-14 22" />
            <path className="stroke-accent" d="M226 113l9 31 26-7-9-32Z" />
            <path className="stroke-main" d="M112 53h72" />
            <path className="stroke-accent-alt" d="M92 92c12-6 28-4 39 6" />
            <text x="181" y="56">今天想喝点什么？</text>
          </svg>
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

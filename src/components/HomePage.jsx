import React from 'react';
import './HomePage.css';

const HomePage = ({ onStart }) => {
  return (
    <div className="home-page">
      <div className="home-panel">
        <div className="home-stickers">
          <span className="sticker sticker-pink">火柴人微醺测试</span>
          <span className="sticker sticker-lime">TODAY&apos;S DRINK CHECK</span>
        </div>

        <div className="home-copy">
          <p className="home-kicker">先画出今天的情绪，再决定今晚的那一杯。</p>
          <h1 className="home-title">
            <span className="title-main">白日微醺</span>
            <span className="title-sub">Stick Mood Lab</span>
          </h1>

          <p className="home-description">
            6 个问题，1 分钟内测出你今天更适合哪杯酒。
            画风不正经，推荐很认真。
          </p>
        </div>

        <div className="home-scene" aria-hidden="true">
          <div className="home-note">今日适配中...</div>
          <div className="scene-chip chip-left">先选心情</div>
          <div className="scene-chip chip-right">再看 MBTI</div>

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
            <path className="stroke-accent-alt" d="M95 67c8-14 24-20 40-14" />
            <path className="stroke-accent-alt" d="M92 96c12-6 28-4 39 6" />
            <path className="stroke-main" d="M252 147c17 7 31 19 38 33" />
            <path className="stroke-main" d="M80 205c21-10 40-12 61-8" />
            <path className="stroke-main" d="M112 53h72" />
            <path className="stroke-main" d="M97 53l-10-13" />
            <path className="stroke-main" d="M107 35l-3-18" />
            <path className="stroke-main" d="M127 32l8-16" />
            <text x="187" y="56">哪杯像你今天？</text>
          </svg>
        </div>

        <button className="start-button" onClick={onStart}>
          <span className="button-main">开始测试</span>
          <span className="button-sub">60 秒出结果海报</span>
        </button>

        <div className="home-tags">
          <span>6 道题</span>
          <span>MBTI 联动</span>
          <span>可保存海报</span>
        </div>
      </div>

      <span className="home-spark spark-a"></span>
      <span className="home-spark spark-b"></span>
      <span className="home-spark spark-c"></span>
    </div>
  );
};

export default HomePage;

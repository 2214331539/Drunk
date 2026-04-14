import React from 'react';
import './HomePage.css';

const HomePage = ({ onStart }) => {
  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-decoration">
          <span className="deco-circle deco-1"></span>
          <span className="deco-circle deco-2"></span>
          <span className="deco-circle deco-3"></span>
        </div>

        <h1 className="home-title">
          <span className="title-main">白日</span>
          <span className="title-sub">微醺</span>
        </h1>

        <p className="home-description">
          轻轻几道题<br />
          找到此刻适合你的味道
        </p>

        <button className="start-button" onClick={onStart}>
          <span className="button-text">开始</span>
          <span className="button-shine"></span>
        </button>

        <p className="home-footer">
          6个问题 · 约1分钟
        </p>
      </div>

      <div className="home-bg-gradient"></div>
    </div>
  );
};

export default HomePage;

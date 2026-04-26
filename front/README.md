# 白日微醺 H5 测试页面

一个轻量、治愈风格的微醺酒类推荐测试 H5 应用。

## 设计理念

- **白日微醺感**：柔和色彩、低饱和度、粉彩渐变
- **空气感**：大量留白、轻盈动画、柔和阴影
- **低压决策**：简单直观的交互，无压力的选择体验
- **社交传播**：支持生成精美的分享卡片

## 技术栈

- React 18
- Vite（构建工具）
- 纯 CSS（无预处理器）
- html2canvas（分享卡片生成）

## 项目结构

```
drunk-test-h5/
├── public/
│   └── index.html          # HTML 模板
├── src/
│   ├── components/
│   │   ├── HomePage.jsx    # 首页组件
│   │   ├── HomePage.css
│   │   ├── QuestionPage.jsx  # 问答页组件
│   │   ├── QuestionPage.css
│   │   ├── ResultPage.jsx    # 结果页组件
│   │   └── ResultPage.css
│   ├── styles/
│   │   ├── index.css       # 全局样式
│   │   └── App.css         # App 基础样式
│   ├── App.js              # 主应用组件（含问题逻辑）
│   └── index.js            # 入口文件
└── package.json
```

## 安装与运行

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev
# 或者
npm start

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 核心功能

### 1. 首页
- 柔和的视觉引导
- 浮动装饰元素营造空气感
- 平滑的开始动画

### 2. 问答页
- 5道轻松的问题
- 柔和的选项卡片
- 平滑的页面过渡

### 3. 结果页
- 个性化酒款推荐
- 精美的结果卡片设计
- 支持导出分享图片

## 视觉规范

### 色彩系统
- 背景色：`#faf6f2`（米白）
- 主色：`#c9b8a8`（柔沙色）
- 文字：`#6b5d52`（深棕色）

### 渐变
- 暖色：`#fdf6f0 → #f5ebe0 → #e8d5c4`
- 冷色：`#f6f3f0 → #e8e4f0 → #d8d4e8`
- 粉调：`#fdf6f0 → #f8e8e8 → #f0d8d8`

### 阴影
- 轻柔：`0 8px 32px rgba(201, 184, 168, 0.12)`
- 浮动：`0 16px 48px rgba(201, 184, 168, 0.18)`

## 自定义修改

### 修改问题
编辑 `src/App.js` 中的 `questions` 数组

### 修改结果逻辑
编辑 `src/App.js` 中的 `getResult` 函数

### 修改颜色主题
编辑 `src/styles/index.css` 中的 CSS 变量

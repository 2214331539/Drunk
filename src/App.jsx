import React, { useState, useCallback } from 'react';
import HomePage from './components/HomePage';
import QuestionPage from './components/QuestionPage';
import ResultPage from './components/ResultPage';
import mockData from './data/mockdata.json';
import './styles/App.css';

// 问题数据
const questions = [
  {
    id: 1,
    question: "此刻，你想微醺是因为...",
    options: [
      { text: "想暂时放空，什么都不想", value: "relax" },
      { text: "有一些情绪想慢慢消化", value: "emotion" },
      { text: "和朋友聊聊天，轻轻松松", value: "social" },
      { text: "只是想尝一点味道", value: "taste" }
    ]
  },
  {
    id: 2,
    question: "你觉得最舒服的状态是...",
    options: [
      { text: "一个人静静待着", value: "alone" },
      { text: "和三两好友小聚", value: "friends" },
      { text: "在人群中但不被注意", value: "crowd" },
      { text: "和重要的人独处", value: "intimate" }
    ]
  },
  {
    id: 3,
    question: "你偏爱什么样的味道？",
    options: [
      { text: "清清爽爽，不甜腻", value: "fresh" },
      { text: "有点甜，像小确幸", value: "sweet" },
      { text: "有层次，慢慢品", value: "complex" },
      { text: "淡淡的，若有若无", value: "subtle" }
    ]
  },
  {
    id: 4,
    question: "此刻的心情，更接近...",
    options: [
      { text: "云一样，飘着", value: "cloud" },
      { text: "风一样，流动着", value: "wind" },
      { text: "水一样，平静着", value: "water" },
      { text: "光一样，温暖着", value: "light" }
    ]
  },
  {
    id: 5,
    question: "你希望微醺的感觉是...",
    options: [
      { text: "像做了一场温柔的梦", value: "dream" },
      { text: "像被拥抱了一下", value: "hug" },
      { text: "像深呼吸了一口", value: "breath" },
      { text: "像听了一首喜欢的歌", value: "song" }
    ]
  },
  {
    id: 6,
    question: "你的 MBTI 是？",
    type: "mbti",
    options: [
      { text: "INFJ - 提倡者", value: "INFJ" },
      { text: "INFP - 调停者", value: "INFP" },
      { text: "ENFJ - 主人公", value: "ENFJ" },
      { text: "ENFP - 竞选者", value: "ENFP" },
      { text: "INTJ - 建筑师", value: "INTJ" },
      { text: "INTP - 逻辑学家", value: "INTP" },
      { text: "ENTJ - 指挥官", value: "ENTJ" },
      { text: "ENTP - 辩论家", value: "ENTP" },
      { text: "ISFJ - 守卫者", value: "ISFJ" },
      { text: "ISFP - 探险家", value: "ISFP" },
      { text: "ESFJ - 执政官", value: "ESFJ" },
      { text: "ESFP - 表演者", value: "ESFP" },
      { text: "ISTJ - 物流师", value: "ISTJ" },
      { text: "ISTP - 手艺人", value: "ISTP" },
      { text: "ESTJ - 总经理", value: "ESTJ" },
      { text: "ESTP - 企业家", value: "ESTP" }
    ]
  }
];

// 计算酒品推荐结果
const calculateResults = (answers, mbti) => {
  const { wines, mbtiWineMatches, moodWineMatches } = mockData;

  // 初始化所有酒的分数
  const wineScores = wines.map(wine => ({
    ...wine,
    baseScore: 50, // 基础分
    totalScore: 50,
    matchReason: ""
  }));

  // 1. 根据心情答案计算分数
  const moodAnswers = answers.slice(0, 5); // 前5个问题是心情相关
  moodAnswers.forEach(answer => {
    const moodMatch = moodWineMatches[answer];
    if (moodMatch) {
      moodMatch.wines.forEach(wineId => {
        const wineIndex = wineScores.findIndex(w => w.id === wineId);
        if (wineIndex !== -1) {
          wineScores[wineIndex].baseScore += moodMatch.boost;
          wineScores[wineIndex].totalScore += moodMatch.boost;
        }
      });
    }
  });

  // 2. 根据MBTI计算分数
  const mbtiMatch = mbtiWineMatches.find(m => m.mbti === mbti);
  if (mbtiMatch) {
    mbtiMatch.wines.forEach(matchWine => {
      const wineIndex = wineScores.findIndex(w => w.id === matchWine.id);
      if (wineIndex !== -1) {
        wineScores[wineIndex].totalScore += (matchWine.match - 50); // 使用MBTI匹配度
        wineScores[wineIndex].matchReason = matchWine.reason;
        wineScores[wineIndex].mbtiMatch = matchWine.match;
      }
    });
  }

  // 3. 排序并添加排名
  const sortedWines = wineScores
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 6) // 只取前6个
    .map((wine, index) => ({
      ...wine,
      rank: index + 1,
      displayMatch: Math.min(99, Math.round(wine.totalScore))
    }));

  return {
    mbti,
    mbtiInfo: mockData.mbti[mbti],
    wines: sortedWines,
    topWine: sortedWines[0]
  };
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleStart = useCallback(() => {
    setCurrentPage('question');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  }, []);

  const handleAnswer = useCallback((value) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 最后一个问题，计算结果
      const mbti = newAnswers[newAnswers.length - 1]; // 最后一个答案是MBTI
      const moodAnswers = newAnswers.slice(0, -1); // 前面的是心情答案
      const calculatedResult = calculateResults(moodAnswers, mbti);
      setResult(calculatedResult);
      setCurrentPage('result');
    }
  }, [answers, currentQuestion]);

  const handleRestart = useCallback(() => {
    setCurrentPage('home');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  }, []);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    } else {
      setCurrentPage('home');
    }
  }, [currentQuestion, answers]);

  return (
    <div className="app">
      {currentPage === 'home' && (
        <HomePage onStart={handleStart} />
      )}
      {currentPage === 'question' && (
        <QuestionPage
          question={questions[currentQuestion]}
          currentIndex={currentQuestion}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      )}
      {currentPage === 'result' && result && (
        <ResultPage
          result={result}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;

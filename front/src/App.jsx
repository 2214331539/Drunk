import React, { useState, useCallback, useMemo } from 'react';
import HomePage from './components/HomePage';
import QuestionPage from './components/QuestionPage';
import ResultPage from './components/ResultPage';
import questionsData from '../data/questions.json';
import mbtiData from '../data/mbti.json';
import alcoholData from '../data/alcohol.json';
import answerData from '../data/answer.json';
import { buildQuestions, calculateRecommendations } from './utils/recommendationEngine';
import './styles/App.css';

function App() {
  const mbtiMap = useMemo(() => mbtiData.mbti, []);
  const cocktailsMap = useMemo(() => alcoholData.cocktails, []);
  const answerPlanMap = useMemo(() => answerData.answers, []);
  const questions = useMemo(
    () => buildQuestions(questionsData.questions, mbtiMap),
    [mbtiMap]
  );

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
      return;
    }

    const mbtiCode = newAnswers[newAnswers.length - 1];

    const calculatedResult = calculateRecommendations({
      mbtiCode,
      mbtiMap,
      cocktailsMap,
      answerPlanMap
    });

    setResult(calculatedResult);
    setCurrentPage('result');
  }, [answerPlanMap, answers, cocktailsMap, currentQuestion, questions.length, mbtiMap]);

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
  }, [answers, currentQuestion]);

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

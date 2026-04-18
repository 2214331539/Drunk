import React, { useState, useCallback, useMemo } from 'react';
import HomePage from './components/HomePage';
import QuestionPage from './components/QuestionPage';
import ResultPage from './components/ResultPage';
import questionsData from '../data/questions.json';
import sbtiData from '../data/sbti.json';
import alcoholData from '../data/alcohol.json';
import { buildQuestions, calculateRecommendations } from './utils/recommendationEngine';
import './styles/App.css';

function App() {
  const sbtiMap = useMemo(() => sbtiData.sbti, []);
  const cocktailsMap = useMemo(() => alcoholData.cocktails, []);
  const questions = useMemo(
    () => buildQuestions(questionsData.questions, sbtiMap),
    [sbtiMap]
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

    const sbtiCode = newAnswers[newAnswers.length - 1];
    const answerValues = newAnswers.slice(0, -1);

    const calculatedResult = calculateRecommendations({
      answerValues,
      sbtiCode,
      questionData: questionsData.questions,
      sbtiMap,
      cocktailsMap
    });

    setResult(calculatedResult);
    setCurrentPage('result');
  }, [answers, cocktailsMap, currentQuestion, questions.length, sbtiMap]);

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

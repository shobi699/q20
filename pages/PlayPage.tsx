import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validateAnswer, logAnswerAndGetCount } from '../services/api';

const HeartIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-all duration-300 ${filled ? 'text-red-500' : 'text-on-surface/20'}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);


const PlayPage: React.FC = () => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'submitting' | 'feedback' | 'gameOver'>('idle');
  const [currentWord, setCurrentWord] = useState('ابر');
  const [answer, setAnswer] = useState('');
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [turn, setTurn] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean; count?: number } | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const MAX_TURNS = 20;
  const TIME_LIMIT = 15;

  const proceedToNextTurn = (nextWord: string) => {
    setTurn(prev => prev + 1);
    if (turn + 1 > MAX_TURNS) {
      setGameState('gameOver');
      return;
    }
    setCurrentWord(nextWord);
    setAnswer('');
    setGameState('feedback');
    setTimeout(() => setGameState(currentGameState => currentGameState === 'gameOver' ? 'gameOver' : 'playing'), 3000);
  }
  
  const handleIncorrectAnswer = (message: string) => {
    setLives(prevLives => {
      const newLives = prevLives - 1;
      setFeedback({ message, isCorrect: false });
      if (newLives <= 0) {
        setGameState('gameOver');
      } else {
        setGameState('feedback');
         setTimeout(() => setGameState(currentGameState => currentGameState === 'gameOver' ? 'gameOver' : 'playing'), 3000);
      }
      return newLives;
    });
    setAnswer('');
  }

  const handleTimeout = useCallback(() => {
    handleIncorrectAnswer('زمان شما تمام شد!');
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIME_LIMIT);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if(timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleTimeout]);

  useEffect(() => {
    if (gameState === 'playing') {
      resetTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentWord, resetTimer]);
  
  const handleStartGame = () => {
    setLives(3);
    setScore(0);
    setTurn(1);
    setCurrentWord('ابر');
    setFeedback(null);
    setAnswer('');
    setGameState('playing');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || gameState !== 'playing') return;

    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('submitting');
    setFeedback(null);

    try {
      const result = await validateAnswer({
        sourceWord: currentWord,
        answerWord: answer.trim()
      });

      if (result.valid) {
        const { count } = await logAnswerAndGetCount({
            sourceWord: currentWord,
            answerWord: answer.trim(),
        });

        setScore(prev => prev + 1);
        setFeedback({ message: result.reason, isCorrect: true, count: count || 1 });
        proceedToNextTurn(answer.trim());
      } else {
        handleIncorrectAnswer(result.reason);
      }
    } catch (err: any) {
      console.error("Error validating answer:", err);
      handleIncorrectAnswer('خطا در ارتباط با سرور');
    }
  };
  
  if (gameState === 'idle') {
    return (
      <div className="text-center p-8 flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-4xl font-bold text-primary mb-4">آماده‌ی چالش هستی؟</h1>
        <p className="text-on-surface/80 mb-8 max-w-md">
          زنجیره را ادامه بده! برای هر کلمه، یک کلمه مرتبط در ۱۵ ثانیه بگو. ۳ بار خطا کنی، می‌بازی.
        </p>
        <button onClick={handleStartGame} className="py-3 px-8 bg-secondary text-on-secondary font-bold text-lg rounded-md hover:opacity-90 transition-opacity">
          شروع بازی
        </button>
      </div>
    );
  }
  
  if (gameState === 'gameOver') {
    return (
       <div className="text-center p-8 flex flex-col items-center justify-center min-h-[400px] bg-surface rounded-lg shadow-xl animate-fade-in">
          <h2 className="text-4xl font-bold text-primary mb-2">بازی تمام شد!</h2>
          <div className="my-4">
              <p className="text-lg text-on-surface/80">امتیاز نهایی شما</p>
              <p className="text-6xl font-bold text-secondary tracking-tight">{score}</p>
          </div>
          <button onClick={handleStartGame} className="mt-6 py-3 px-8 bg-secondary text-on-secondary font-bold text-lg rounded-md hover:opacity-90 transition-opacity">
            بازی دوباره
          </button>
       </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-surface rounded-lg shadow-xl">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => <HeartIcon key={i} filled={i < lives} />)}
        </div>
        <div className="text-center">
            <h2 className="text-xl">امتیاز: <span className="font-bold text-primary">{score}</span></h2>
            <h3 className="text-lg">مرحله: <span className="font-bold text-secondary">{turn} / {MAX_TURNS}</span></h3>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full bg-background rounded-full h-2.5 mb-6">
          <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${(timeLeft / TIME_LIMIT) * 100}%`, transition: 'width 1s linear' }}></div>
      </div>

      {/* Game Content */}
      <div className="my-8 text-center min-h-[150px]">
        <p className="text-on-surface/70 mb-2">کلمه شما</p>
        <h1 className="text-5xl font-bold tracking-wider animate-fade-in">{currentWord}</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
         <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="کلمه مرتبط را وارد کنید..."
              className="w-full bg-background border border-on-surface/20 rounded-md p-4 text-2xl text-center focus:ring-2 focus:ring-primary focus:outline-none"
              disabled={gameState !== 'playing'}
              autoFocus
          />
          <button
              type="submit"
              disabled={gameState !== 'playing' || !answer.trim()}
              className="w-full mt-4 py-3 px-4 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-variant disabled:bg-gray-500 transition-colors"
          >
              ارسال
          </button>
      </form>
      
      {/* Submitting/Feedback Overlay */}
       {(gameState === 'submitting' || gameState === 'feedback') && (
         <div className="mt-6 text-center min-h-[80px]">
          {gameState === 'submitting' ? (
             <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4">در حال بررسی ...</p>
             </div>
          ) : feedback && (
            <div className={`p-4 rounded-md text-center animate-fade-in ${feedback.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-error/20 text-error'}`}>
              <p className="font-bold">{feedback.message}</p>
              {feedback.isCorrect && feedback.count && feedback.count > 1 && (
                  <p className="text-sm mt-1">{feedback.count - 1} نفر دیگر هم همین پاسخ را داده‌اند!</p>
              )}
            </div>
          )}
         </div>
       )}
    </div>
  );
};

export default PlayPage;

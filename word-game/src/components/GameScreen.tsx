import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { GameConfig } from '../App';
import { WORDS, type Word } from '../data/words';
import {
  getDueWords, updateWordProgress,
  addWrongEntry, updateDailyStats, getUnresolvedWrong,
} from '../utils/storage';
import { ChoiceGame } from './games/ChoiceGame';
import { SpellGame } from './games/SpellGame';
import { MatchGame } from './games/MatchGame';
import { WhackGame } from './games/WhackGame';
import { ResultCard } from './ResultCard';

interface Props {
  config: GameConfig;
  onBack: () => void;
}

function getGameWords(config: GameConfig): Word[] {
  if (config.filter === 'due') {
    const due = getDueWords(WORDS);
    return due.length >= 4 ? due : WORDS.slice(0, Math.max(10, due.length));
  }
  if (config.filter === 'wrong') {
    const wrongIds = new Set(getUnresolvedWrong().map(e => e.wordId));
    const wrongWords = WORDS.filter(w => wrongIds.has(w.id));
    return wrongWords.length >= 4 ? wrongWords : WORDS.slice(0, 10);
  }
  if (config.filter === 'unit' && config.unitKey) {
    const [sem, ...unitParts] = config.unitKey.split('-');
    const unit = unitParts.join('-');
    return WORDS.filter(w => w.semester === Number(sem) && w.unit === unit);
  }
  return WORDS;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MODE_LABEL: Record<string, string> = {
  choice: '选择题',
  spell: '拼写',
  match: '配对',
  whack: '打地鼠',
};

export function GameScreen({ config, onBack }: Props) {
  const [words] = useState<Word[]>(() => shuffle(getGameWords(config)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const sessionStart = useRef(Date.now());

  const currentWord = words[currentIndex];
  const isMatch = config.mode === 'match';
  const isWhack = config.mode === 'whack';
  const isBatch = isMatch || isWhack;

  const BATCH_SIZE = isMatch ? 6 : 10;
  const batchWords = words.slice(0, Math.min(BATCH_SIZE, words.length));

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }, []);

  useEffect(() => {
    if (currentWord && !isBatch) speak(currentWord.word);
  }, [currentWord, speak, isBatch]);

  const handleAnswer = useCallback((correct: boolean, wrongAnswer?: string) => {
    const word = words[currentIndex];
    updateWordProgress(word.id, correct ? 4 : 1);
    if (!correct && wrongAnswer) addWrongEntry(word.id, wrongAnswer, word.meaning);
    updateDailyStats({ wordsReviewed: 1 });
    if (correct) setScore(s => s + 1);
    setLastCorrect(correct);
    setTotal(t => t + 1);

    setTimeout(() => {
      setLastCorrect(null);
      if (currentIndex + 1 >= batchWords.length) {
        const minutes = Math.round((Date.now() - sessionStart.current) / 60000);
        if (minutes > 0) updateDailyStats({ studyMinutes: minutes });
        setIsFinished(true);
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 1000);
  }, [currentIndex, words, batchWords.length]);

  const handleBatchComplete = useCallback((results: { wordId: string; correct: boolean }[]) => {
    results.forEach(r => {
      const word = words.find(w => w.id === r.wordId);
      if (!word) return;
      updateWordProgress(word.id, r.correct ? 4 : 1);
      if (!r.correct) addWrongEntry(word.id, isWhack ? '打地鼠未命中' : '配对错误', word.meaning);
    });
    const correctCount = results.filter(r => r.correct).length;
    setScore(correctCount);
    setTotal(results.length);
    updateDailyStats({ wordsReviewed: results.length });
    const minutes = Math.round((Date.now() - sessionStart.current) / 60000);
    if (minutes > 0) updateDailyStats({ studyMinutes: minutes });
    setIsFinished(true);
  }, [words, isWhack]);

  if (words.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <p className="text-xl font-bold text-gray-700 mb-2">今天没有待复习的单词！</p>
        <p className="text-gray-500 mb-6">所有单词都已复习完毕，明天再来吧</p>
        <button onClick={onBack} className="px-6 py-3 bg-purple-500 text-white rounded-xl font-bold">
          返回首页
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <ResultCard
        score={score}
        total={total}
        onBack={onBack}
        onRetry={() => {
          setCurrentIndex(0);
          setScore(0);
          setTotal(0);
          setIsFinished(false);
          sessionStart.current = Date.now();
        }}
      />
    );
  }

  const progress = isBatch ? 0 : Math.round((currentIndex / batchWords.length) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/60 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{MODE_LABEL[config.mode] ?? config.mode}</span>
            {!isBatch && <span>{currentIndex + 1} / {batchWords.length}</span>}
          </div>
          {!isBatch && (
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Feedback flash */}
      {lastCorrect !== null && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold text-white shadow-lg animate-bounce-in ${
          lastCorrect ? 'bg-green-500' : 'bg-red-400'
        }`}>
          {lastCorrect ? '✓ 答对了！' : '✗ 加油！'}
        </div>
      )}

      {/* Game area */}
      {config.mode === 'choice' && currentWord && (
        <ChoiceGame word={currentWord} allWords={WORDS} onAnswer={handleAnswer} onSpeak={speak} />
      )}
      {config.mode === 'spell' && currentWord && (
        <SpellGame word={currentWord} onAnswer={handleAnswer} onSpeak={speak} />
      )}
      {config.mode === 'match' && (
        <MatchGame words={batchWords} onComplete={handleBatchComplete} onSpeak={speak} />
      )}
      {config.mode === 'whack' && (
        <WhackGame words={words} onComplete={handleBatchComplete} />
      )}
    </div>
  );
}

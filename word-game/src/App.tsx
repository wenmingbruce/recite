import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { GameScreen } from './components/GameScreen';
import { WrongNotes } from './components/WrongNotes';
import { Statistics } from './components/Statistics';
import { WordList } from './components/WordList';
import { StickerBook } from './components/StickerBook';
import { startSession, endSession } from './utils/storage';
import { getWordBook, DEFAULT_GRADE, DEFAULT_SEMESTER, type Word } from './data/wordbooks';

export type Screen = 'home' | 'game' | 'wrong' | 'stats' | 'wordlist' | 'stickers';
export type GameMode = 'choice' | 'spell' | 'match' | 'whack';
export type GameFilter = 'due' | 'unit' | 'wrong';

export interface GameConfig {
  mode: GameMode;
  filter: GameFilter;
  unitKey?: string;
}

const GRADE_KEY = 'selected_grade';
const SEM_KEY   = 'selected_semester';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [prevScreen, setPrevScreen] = useState<Screen>('home');
  const [gameConfig, setGameConfig] = useState<GameConfig>({ mode: 'choice', filter: 'due' });

  const [selectedGrade, setSelectedGrade] = useState<number>(() =>
    Number(localStorage.getItem(GRADE_KEY) ?? DEFAULT_GRADE)
  );
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(() =>
    (Number(localStorage.getItem(SEM_KEY) ?? DEFAULT_SEMESTER) as 1 | 2)
  );

  const activeBook = getWordBook(selectedGrade, selectedSemester);
  const activeWords: Word[] = activeBook?.words ?? [];

  const changeBook = (grade: number, sem: 1 | 2) => {
    setSelectedGrade(grade);
    setSelectedSemester(sem);
    localStorage.setItem(GRADE_KEY, String(grade));
    localStorage.setItem(SEM_KEY, String(sem));
  };

  useEffect(() => {
    if (screen === 'game') {
      startSession();
      return () => { endSession(); };
    }
  }, [screen]);

  const navigate = (s: Screen) => {
    setPrevScreen(screen);
    setScreen(s);
  };

  const startGame = (config: GameConfig) => {
    setGameConfig(config);
    navigate('game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {screen === 'home' && (
        <Home
          activeWords={activeWords}
          selectedGrade={selectedGrade}
          selectedSemester={selectedSemester}
          onChangeBook={changeBook}
          onStartGame={startGame}
          onShowWrong={() => navigate('wrong')}
          onShowStats={() => navigate('stats')}
          onShowWordList={() => navigate('wordlist')}
          onShowStickers={() => navigate('stickers')}
        />
      )}
      {screen === 'game' && (
        <GameScreen
          config={gameConfig}
          activeWords={activeWords}
          onBack={() => setScreen('home')}
          onStickerBook={() => navigate('stickers')}
        />
      )}
      {screen === 'wrong' && (
        <WrongNotes onBack={() => setScreen('home')} onStartGame={startGame} activeWords={activeWords} />
      )}
      {screen === 'stats' && (
        <Statistics onBack={() => setScreen('home')} activeWords={activeWords} />
      )}
      {screen === 'wordlist' && (
        <WordList onBack={() => setScreen('home')} activeWords={activeWords} />
      )}
      {screen === 'stickers' && (
        <StickerBook onBack={() => setScreen(prevScreen === 'stickers' ? 'home' : prevScreen)} />
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { GameScreen } from './components/GameScreen';
import { WrongNotes } from './components/WrongNotes';
import { Statistics } from './components/Statistics';
import { WordList } from './components/WordList';
import { startSession, endSession } from './utils/storage';

export type Screen = 'home' | 'game' | 'wrong' | 'stats' | 'wordlist';
export type GameMode = 'choice' | 'spell' | 'match' | 'whack';
export type GameFilter = 'due' | 'unit' | 'wrong';

export interface GameConfig {
  mode: GameMode;
  filter: GameFilter;
  unitKey?: string;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [gameConfig, setGameConfig] = useState<GameConfig>({ mode: 'choice', filter: 'due' });

  useEffect(() => {
    if (screen === 'game') {
      startSession();
      return () => { endSession(); };
    }
  }, [screen]);

  const startGame = (config: GameConfig) => {
    setGameConfig(config);
    setScreen('game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {screen === 'home' && (
        <Home
          onStartGame={startGame}
          onShowWrong={() => setScreen('wrong')}
          onShowStats={() => setScreen('stats')}
          onShowWordList={() => setScreen('wordlist')}
        />
      )}
      {screen === 'game' && (
        <GameScreen config={gameConfig} onBack={() => setScreen('home')} />
      )}
      {screen === 'wrong' && (
        <WrongNotes onBack={() => setScreen('home')} onStartGame={startGame} />
      )}
      {screen === 'stats' && (
        <Statistics onBack={() => setScreen('home')} />
      )}
      {screen === 'wordlist' && (
        <WordList onBack={() => setScreen('home')} />
      )}
    </div>
  );
}

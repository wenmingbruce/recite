import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { GameScreen } from './components/GameScreen';
import { WrongNotes } from './components/WrongNotes';
import { Statistics } from './components/Statistics';
import { WordList } from './components/WordList';
import { StickerBook } from './components/StickerBook';
import { startSession, endSession } from './utils/storage';

export type Screen = 'home' | 'game' | 'wrong' | 'stats' | 'wordlist' | 'stickers';
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
  const [prevScreen, setPrevScreen] = useState<Screen>('home');

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
          onBack={() => setScreen('home')}
          onStickerBook={() => navigate('stickers')}
        />
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
      {screen === 'stickers' && (
        <StickerBook onBack={() => setScreen(prevScreen === 'stickers' ? 'home' : prevScreen)} />
      )}
    </div>
  );
}

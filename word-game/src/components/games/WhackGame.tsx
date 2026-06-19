import { useState, useEffect, useRef } from 'react';
import type { Word } from '../../data/words';
import { WORDS } from '../../data/words';
import { playCorrectHit, playWrongHit, playMoleAppear, playGameOver } from '../../utils/sound';

const QUESTIONS = 10;
const MOLE_DURATION = 3000; // ms before moles hide
const EFFECTS = ['💥', '⭐', '✨', '🌟', '💫', '🎯', '🔥'];

type HoleState = 'empty' | 'up' | 'hit-correct' | 'hit-wrong' | 'miss';

interface Hole {
  id: number;
  word: Word | null;
  isCorrect: boolean;
  state: HoleState;
}

interface Props {
  words: Word[];
  onComplete: (results: { wordId: string; correct: boolean }[]) => void;
}

function makeEmpty(): Hole[] {
  return Array.from({ length: 9 }, (_, i) => ({
    id: i, word: null, isCorrect: false, state: 'empty' as HoleState,
  }));
}

function shuffle<T>(a: T[]): T[] {
  return [...a].sort(() => Math.random() - 0.5);
}

// Pick 10 game words; pad with global words if insufficient
function pickGameWords(words: Word[]): Word[] {
  const pool = words.length >= 4 ? words : WORDS;
  return shuffle(pool).slice(0, Math.min(QUESTIONS, pool.length));
}

export function WhackGame({ words, onComplete }: Props) {
  const gameWords = useRef(pickGameWords(words));
  const total = gameWords.current.length;
  const results = useRef<{ wordId: string; correct: boolean }[]>([]);
  const locked = useRef(false);
  const qIdx = useRef(0);
  const mounted = useRef(true);
  const timerId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const barId = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const [target, setTarget] = useState<Word | null>(null);
  const [holes, setHoles] = useState<Hole[]>(makeEmpty());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const [effect, setEffect] = useState<{ id: number; emoji: string } | null>(null);
  const [qNum, setQNum] = useState(1);

  // Store startQ in a ref so it can recursively call itself safely
  const startQ = useRef<(idx: number) => void>(() => {});

  startQ.current = (idx: number) => {
    if (!mounted.current) return;
    if (idx >= total) {
      clearTimeout(timerId.current);
      clearInterval(barId.current);
      const finalScore = results.current.filter(r => r.correct).length;
      playGameOver(finalScore >= total * 0.6);
      onComplete(results.current);
      return;
    }

    locked.current = false;
    const t = gameWords.current[idx];
    setTarget(t);
    setQNum(idx + 1);
    setEffect(null);
    setTimeLeft(100);

    // Build moles: 1 correct + 3 distractors
    const distractors = shuffle(WORDS.filter(w => w.id !== t.id)).slice(0, 3);
    const moles = shuffle([t, ...distractors]);
    const slots = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 4);

    setHoles(Array.from({ length: 9 }, (_, i) => {
      const si = slots.indexOf(i);
      if (si >= 0) {
        const w = moles[si];
        return { id: i, word: w, isCorrect: w.id === t.id, state: 'up' as HoleState };
      }
      return { id: i, word: null, isCorrect: false, state: 'empty' as HoleState };
    }));

    playMoleAppear();
    clearTimeout(timerId.current);
    clearInterval(barId.current);

    const start = Date.now();
    barId.current = setInterval(() => {
      if (!mounted.current) return;
      setTimeLeft(Math.max(0, 100 - ((Date.now() - start) / MOLE_DURATION) * 100));
    }, 40);

    timerId.current = setTimeout(() => {
      if (!mounted.current) return;
      clearInterval(barId.current);
      locked.current = true;
      results.current = [...results.current, { wordId: t.id, correct: false }];
      setHoles(prev => prev.map(h => h.state === 'up' ? { ...h, state: 'miss' as HoleState } : h));

      setTimeout(() => {
        if (!mounted.current) return;
        setHoles(makeEmpty());
        startQ.current!(idx + 1);
      }, 1100);
    }, MOLE_DURATION);
  };

  useEffect(() => {
    mounted.current = true;
    // Small delay so first mole feels intentional
    setTimeout(() => startQ.current!(0), 300);
    return () => {
      mounted.current = false;
      clearTimeout(timerId.current);
      clearInterval(barId.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleHit = (holeId: number) => {
    if (locked.current) return;

    // Read current hole from state via a DOM-free snapshot
    setHoles(prev => {
      const hole = prev.find(h => h.id === holeId);
      if (!hole || hole.state !== 'up' || !hole.word) return prev;

      if (hole.isCorrect) {
        // ── Correct hit ──
        clearTimeout(timerId.current);
        clearInterval(barId.current);
        locked.current = true;

        const emoji = EFFECTS[Math.floor(Math.random() * EFFECTS.length)];
        // Schedule these outside the setter via microtask
        Promise.resolve().then(() => {
          if (!mounted.current) return;
          setScore(s => s + 1);
          setEffect({ id: holeId, emoji });
          results.current = [...results.current, { wordId: hole.word!.id, correct: true }];
          playCorrectHit();

          setTimeout(() => {
            if (!mounted.current) return;
            setEffect(null);
            setHoles(makeEmpty());
            startQ.current!(qIdx.current + 1);
            qIdx.current += 1;
          }, 1200);
        });

        return prev.map(h =>
          h.id === holeId
            ? { ...h, state: 'hit-correct' as HoleState }
            : { ...h, state: 'empty' as HoleState, word: null }
        );
      } else {
        // ── Wrong hit ──
        Promise.resolve().then(() => {
          if (!mounted.current) return;
          setEffect({ id: holeId, emoji: '❌' });
          playWrongHit();
          setTimeout(() => {
            if (!mounted.current) return;
            setEffect(e => (e?.id === holeId ? null : e));
            setHoles(p => p.map(h =>
              h.id === holeId && h.state === 'hit-wrong' ? { ...h, state: 'up' as HoleState } : h
            ));
          }, 650);
        });

        return prev.map(h =>
          h.id === holeId ? { ...h, state: 'hit-wrong' as HoleState } : h
        );
      }
    });
  };

  // Update qIdx ref so correct-hit callback can read it
  useEffect(() => { qIdx.current = qNum - 1; }, [qNum]);

  const timerColor =
    timeLeft > 60 ? 'bg-green-400' : timeLeft > 30 ? 'bg-yellow-400' : 'bg-red-400';

  return (
    <div>
      {/* Question card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm mb-3 text-center">
        <p className="text-sm text-gray-400 mb-1">🔨 快！打中表示</p>
        <p className="text-3xl font-extrabold text-purple-700">{target?.meaning}</p>
        <p className="text-sm text-gray-500 mt-0.5">的那只地鼠！</p>

        {/* Timer bar */}
        <div className="mt-3 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${timerColor}`}
            style={{ width: `${timeLeft}%`, transition: 'width 40ms linear' }}
          />
        </div>
      </div>

      {/* Score row */}
      <div className="flex justify-between text-sm text-gray-500 mb-3 px-1">
        <span>第 {qNum} / {total} 题</span>
        <span>🎯 打中 {score} 只</span>
      </div>

      {/* 3×3 mole grid */}
      <div className="grid grid-cols-3 gap-3">
        {holes.map(hole => (
          <MoleHole
            key={hole.id}
            hole={hole}
            effect={effect?.id === hole.id ? effect.emoji : null}
            onClick={() => handleHit(hole.id)}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <span className="text-xs text-gray-400">⏱ 时间到地鼠会跑掉！快点击正确的！</span>
      </div>
    </div>
  );
}

// ── Mole hole cell ──────────────────────────────────────────────────────────

interface MoleHoleProps {
  hole: Hole;
  effect: string | null;
  onClick: () => void;
}

const MOLE_FACE: Record<HoleState, string> = {
  empty: '🐹',
  up: '🐹',
  'hit-correct': '😵',
  'hit-wrong': '😤',
  miss: '😅',
};

function MoleHole({ hole, effect, onClick }: MoleHoleProps) {
  const visible = hole.state !== 'empty';
  const isUp = hole.state === 'up';

  return (
    <div className="flex flex-col items-center select-none">
      {/* Effect emoji */}
      <div className="h-8 flex items-center justify-center">
        {effect && (
          <span className="text-3xl animate-bounce-in pointer-events-none">{effect}</span>
        )}
      </div>

      {/* Mole card + hole */}
      <div
        className={`relative w-full flex flex-col items-center cursor-pointer ${isUp ? 'active:scale-90' : ''}`}
        onClick={onClick}
      >
        {/* Mole body */}
        <div
          className={[
            'w-full rounded-2xl flex flex-col items-center justify-center py-2 px-1 shadow-md border-2 transition-all duration-200',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
            hole.state === 'hit-correct' ? 'scale-110 animate-pop border-yellow-400 bg-yellow-100' : '',
            hole.state === 'hit-wrong' ? 'animate-shake border-red-300 bg-red-50' : '',
            hole.state === 'miss' ? 'opacity-40 border-gray-200 bg-gray-50' : '',
            hole.state === 'up' ? (hole.isCorrect ? 'border-amber-300 bg-amber-50 hover:scale-105' : 'border-stone-200 bg-stone-50 hover:scale-105') : '',
          ].join(' ')}
        >
          {/* Face */}
          <span className="text-4xl leading-none mb-1">
            {MOLE_FACE[hole.state]}
          </span>
          {/* Word */}
          <span
            className={[
              'text-xs font-bold text-center leading-tight px-1',
              hole.isCorrect ? 'text-amber-700' : 'text-stone-600',
            ].join(' ')}
          >
            {hole.word?.word ?? ''}
          </span>
        </div>

        {/* Dirt hole */}
        <div className="w-4/5 h-2.5 bg-stone-700 rounded-full opacity-70 shadow-lg -mt-1" />
      </div>
    </div>
  );
}

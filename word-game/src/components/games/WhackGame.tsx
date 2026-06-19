import { useState, useRef, useEffect } from 'react';
import type { Word } from '../../data/wordbooks';
import { ALL_WORDS } from '../../data/wordbooks';
import { ALL_CHINESE_WORDS } from '../../data/chinesebooks';
import { playCorrectHit, playWrongHit, playMoleAppear, playGameOver } from '../../utils/sound';
import moleImg from '../../assets/mole.png';

const QUESTIONS = 10;
const DEFAULT_MOLE_DURATION = 3500;
const HIT_EFFECTS = ['💥', '⭐', '✨', '🌟', '💫', '🎯'];

type HoleState = 'empty' | 'rising' | 'up' | 'hit-correct' | 'hit-wrong' | 'miss';

interface Hole {
  id: number;
  word: Word | null;
  isCorrect: boolean;
  state: HoleState;
}

interface Props {
  words: Word[];
  allWords?: Word[];  // full pool for distractors (defaults to same-language pool)
  duration?: number;
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

function pickGameWords(words: Word[], fallback: Word[]): Word[] {
  const pool = words.length >= 4 ? words : fallback;
  return shuffle(pool).slice(0, Math.min(QUESTIONS, pool.length));
}

export function WhackGame({ words, allWords, duration = DEFAULT_MOLE_DURATION, onComplete }: Props) {
  const MOLE_DURATION = duration;
  // Detect language
  const isChinese_ = words.some(w => w.id.startsWith('zh_'));
  const isPoem = words.some(w => w.unit?.startsWith('古诗'));
  // Pick distractor pool: prefer passed allWords, else detect language from word IDs
  const WORDS = allWords ?? (isChinese_ ? ALL_CHINESE_WORDS : ALL_WORDS);
  const gameWords = useRef(pickGameWords(words, WORDS));
  const total = gameWords.current.length;
  const results = useRef<{ wordId: string; correct: boolean }[]>([]);
  const locked = useRef(false);
  const mounted = useRef(true);
  const timerId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const barId = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const [target, setTarget] = useState<Word | null>(null);
  const [holes, setHoles] = useState<Hole[]>(makeEmpty());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const [effect, setEffect] = useState<{ id: number; emoji: string } | null>(null);
  const [hammerHole, setHammerHole] = useState<number | null>(null);
  const [qNum, setQNum] = useState(0);

  const startQ = useRef<(idx: number) => void>(() => {});

  startQ.current = (idx: number) => {
    if (!mounted.current) return;
    if (idx >= total) {
      clearTimeout(timerId.current);
      clearInterval(barId.current);
      playGameOver(results.current.filter(r => r.correct).length >= total * 0.6);
      onComplete(results.current);
      return;
    }

    locked.current = false;
    const t = gameWords.current[idx];
    setTarget(t);
    setQNum(idx + 1);
    setEffect(null);
    setHammerHole(null);
    setTimeLeft(100);

    const distractors = shuffle(WORDS.filter(w => w.id !== t.id)).slice(0, 3);
    const moles = shuffle([t, ...distractors]);
    const slots = shuffle([0,1,2,3,4,5,6,7,8]).slice(0, 4);

    // Rising animation then up
    setHoles(Array.from({ length: 9 }, (_, i) => {
      const si = slots.indexOf(i);
      if (si >= 0) {
        const w = moles[si];
        return { id: i, word: w, isCorrect: w.id === t.id, state: 'rising' as HoleState };
      }
      return { id: i, word: null, isCorrect: false, state: 'empty' as HoleState };
    }));

    setTimeout(() => {
      if (!mounted.current) return;
      setHoles(prev => prev.map(h => h.state === 'rising' ? { ...h, state: 'up' as HoleState } : h));
    }, 150);

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
      setHoles(prev => prev.map(h =>
        h.state === 'up' || h.state === 'rising' ? { ...h, state: 'miss' as HoleState } : h
      ));
      setTimeout(() => {
        if (!mounted.current) return;
        setHoles(makeEmpty());
        startQ.current(idx + 1);
      }, 900);
    }, MOLE_DURATION);
  };

  useEffect(() => {
    mounted.current = true;
    setTimeout(() => startQ.current(0), 400);
    return () => {
      mounted.current = false;
      clearTimeout(timerId.current);
      clearInterval(barId.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleHit = (holeId: number) => {
    if (locked.current) return;
    setHoles(prev => {
      const hole = prev.find(h => h.id === holeId);
      if (!hole || hole.state !== 'up' || !hole.word) return prev;

      if (hole.isCorrect) {
        clearTimeout(timerId.current);
        clearInterval(barId.current);
        locked.current = true;
        const emoji = HIT_EFFECTS[Math.floor(Math.random() * HIT_EFFECTS.length)];
        Promise.resolve().then(() => {
          if (!mounted.current) return;
          setScore(s => s + 1);
          setEffect({ id: holeId, emoji });
          setHammerHole(holeId);
          results.current = [...results.current, { wordId: hole.word!.id, correct: true }];
          playCorrectHit();
          setTimeout(() => {
            if (!mounted.current) return;
            setHammerHole(null);
            setEffect(null);
            setHoles(makeEmpty());
            startQ.current(results.current.length);
          }, 1100);
        });
        return prev.map(h => h.id === holeId
          ? { ...h, state: 'hit-correct' as HoleState }
          : { ...h, state: 'empty' as HoleState, word: null }
        );
      } else {
        Promise.resolve().then(() => {
          if (!mounted.current) return;
          setEffect({ id: holeId, emoji: '❌' });
          setHammerHole(holeId);
          playWrongHit();
          setTimeout(() => {
            if (!mounted.current) return;
            setHammerHole(null);
            setEffect(e => e?.id === holeId ? null : e);
            setHoles(p => p.map(h =>
              h.id === holeId && h.state === 'hit-wrong' ? { ...h, state: 'up' as HoleState } : h
            ));
          }, 600);
        });
        return prev.map(h => h.id === holeId ? { ...h, state: 'hit-wrong' as HoleState } : h);
      }
    });
  };

  const timerColor = timeLeft > 60 ? 'bg-emerald-400' : timeLeft > 30 ? 'bg-amber-400' : 'bg-red-500';

  return (
    <div>
      {/* Target question */}
      <div className="bg-white rounded-3xl px-6 py-4 shadow-sm mb-3 text-center">
        {isPoem ? (
          <>
            <p className="text-xs text-gray-400 mb-0.5">{target?.example}</p>
            <p className="text-sm text-gray-400">🔨 打中下一句是</p>
            <p className="text-2xl font-extrabold text-purple-700 my-1">{target?.meaning}</p>
            <p className="text-sm text-gray-400">的那只老鼠！</p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-400">🔨 用锤子打中表示</p>
            <p className={`font-extrabold text-purple-700 my-1 ${isChinese_ ? 'text-lg leading-snug' : 'text-3xl'}`}>
              {target?.meaning}
            </p>
            <p className="text-sm text-gray-400">的那只老鼠！</p>
          </>
        )}
        <div className="mt-3 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${timerColor}`}
            style={{ width: `${timeLeft}%`, transition: 'width 40ms linear' }}
          />
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-500 mb-2 px-1">
        <span>第 {Math.min(qNum, total)} / {total} 题</span>
        <span>🎯 打中 {score} 只</span>
      </div>

      {/* 3×3 grid */}
      <div className="grid grid-cols-3 gap-2">
        {holes.map(hole => (
          <MoleCell
            key={hole.id}
            hole={hole}
            effect={effect?.id === hole.id ? effect.emoji : null}
            hammerActive={hammerHole === hole.id}
            onClick={() => handleHit(hole.id)}
          />
        ))}
      </div>

      <div className="mt-3 text-center text-xs text-gray-400">
        ⚡ 老鼠会快速跑掉，快点击正确的！
      </div>
    </div>
  );
}

// ── Mole Cell ────────────────────────────────────────────────────────────────

interface MoleCellProps {
  hole: Hole;
  effect: string | null;
  hammerActive: boolean;
  onClick: () => void;
}

function MoleCell({ hole, effect, hammerActive, onClick }: MoleCellProps) {
  const isVisible = hole.state !== 'empty';
  const isUp = hole.state === 'up';

  return (
    <div
      className="flex flex-col items-center cursor-pointer select-none"
      style={{ userSelect: 'none' }}
      onClick={onClick}
    >
      {/* Hammer + effect row */}
      <div className="h-9 flex items-center justify-center relative" style={{ width: '100%' }}>
        {/* Hammer */}
        <span
          className={`text-3xl absolute transition-all duration-150 ${
            hammerActive ? 'animate-hammer' : isUp ? 'opacity-60' : 'opacity-0'
          }`}
        >
          🔨
        </span>
        {/* Hit effect */}
        {effect && (
          <span className="text-3xl absolute animate-bounce-in pointer-events-none z-10">
            {effect}
          </span>
        )}
      </div>

      {/* Hole + mole container */}
      <div style={{ position: 'relative', width: '100%', height: 110 }}>
        {/* Overflow clip — hides mole below ground */}
        <div
          style={{
            position: 'absolute',
            left: 4, right: 4,
            bottom: 28, top: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          {/* Mole — slides up/down */}
          <div
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
              transition: hole.state === 'rising' ? 'transform 0.18s ease-out' : 'transform 0.22s ease-in',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingBottom: 2,
            }}
          >
            <MoleImg state={hole.state} />
            {/* Word tag */}
            {hole.word && (
              <div
                style={{
                  marginTop: 3,
                  fontSize: 11,
                  fontWeight: 700,
                  textAlign: 'center',
                  padding: '2px 6px',
                  borderRadius: 8,
                  background: hole.isCorrect ? '#fef3c7' : '#f3f4f6',
                  color: hole.isCorrect ? '#92400e' : '#4b5563',
                  maxWidth: 80,
                  lineHeight: 1.2,
                  boxShadow: hole.isCorrect ? '0 0 0 1.5px #fbbf24' : 'none',
                }}
              >
                {hole.word.word}
              </div>
            )}
          </div>
        </div>

        {/* Ground surface */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 32,
            background: 'linear-gradient(180deg, #9a6230 0%, #6b3f1a 100%)',
            borderRadius: '0 0 16px 16px',
          }}
        >
          {/* Hole oval */}
          <div
            style={{
              position: 'absolute',
              top: 5,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '75%',
              height: 22,
              background: 'radial-gradient(ellipse at 50% 60%, #1a0a02 40%, #3d1a08 100%)',
              borderRadius: '50%',
              boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.9)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Mole image component ─────────────────────────────────────────────────────

function MoleImg({ state }: { state: HoleState }) {
  const isDead  = state === 'hit-correct';
  const isAngry = state === 'hit-wrong';
  const isMiss  = state === 'miss';

  return (
    <div style={{ position: 'relative', width: 68, height: 72 }}>
      <img
        src={moleImg}
        alt="mole"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform: isDead ? 'scale(1.15) rotate(-10deg)' : isAngry ? 'scale(0.92) rotate(5deg)' : 'scale(1)',
          transition: 'transform 0.15s',
          filter: isDead
            ? 'brightness(1.2) saturate(0.5)'
            : isAngry
            ? 'hue-rotate(20deg) brightness(0.95)'
            : isMiss
            ? 'brightness(0.85) opacity(0.7)'
            : 'none',
          imageRendering: 'crisp-edges',
        }}
      />
      {/* Reaction overlays */}
      {isDead && (
        <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', fontSize: 18, lineHeight: 1 }}>
          😵
        </div>
      )}
      {isAngry && (
        <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', fontSize: 16, lineHeight: 1 }}>
          😤
        </div>
      )}
      {isMiss && (
        <div style={{ position: 'absolute', top: 0, right: -4, fontSize: 14, lineHeight: 1 }}>
          💦
        </div>
      )}
    </div>
  );
}

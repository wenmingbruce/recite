import { useEffect, useState, useRef } from 'react';
import { RotateCcw, Home, BookOpen } from 'lucide-react';
import {
  pickSticker, addSticker, RARITY_LABEL,
  type StickerDef
} from '../utils/stickers';
import { playLevelUp } from '../utils/sound';

interface Props {
  score: number;
  total: number;
  coinsEarned?: number;
  onBack: () => void;
  onRetry: () => void;
  onStickerBook?: () => void;
  onPet?: () => void;
}

// ── Praise messages ────────────────────────────────────────────────────────
const PRAISE: Record<string, string[]> = {
  '100': ['🏆 完美无缺！你是传说！', '👑 满分公主驾到！', '💎 完美满分！全宇宙最棒！', '🌟 你太厉害了！天才少女！'],
  '80':  ['🔥 超级棒！快到满分了！', '⭐ 你真的好厉害！', '🦄 独角兽为你喝彩！', '🌈 彩虹为你绽放！'],
  '60':  ['💪 做得不错！越来越好！', '🌸 努力的你最美丽！', '🐼 熊猫为你加油！', '✨ 你进步了！好棒！'],
  '0':   ['🐣 坚持就是胜利！', '💕 失败是成功之母！', '🌱 每一步都是进步！', '🤗 你是最勇敢的！'],
};

function getPraise(pct: number): string {
  const key = pct === 100 ? '100' : pct >= 80 ? '80' : pct >= 60 ? '60' : '0';
  const pool = PRAISE[key];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Confetti ────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff', '#ff9f1c', '#b5eae0'];

function Confetti({ active }: { active: boolean }) {
  const pieces = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      dur: 2.5 + Math.random() * 1.5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 9 + 6,
      isCircle: Math.random() > 0.5,
    }))
  ).current;

  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.isCircle ? '50%' : '3px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Stars burst ─────────────────────────────────────────────────────────────
function StarBurst() {
  return (
    <div className="relative flex items-center justify-center" style={{ height: 60 }}>
      {['⭐', '✨', '🌟', '💫', '⭐', '✨'].map((s, i) => (
        <span
          key={i}
          className="absolute text-2xl animate-star-burst"
          style={{
            animationDelay: `${i * 0.08}s`,
            transform: `rotate(${i * 60}deg) translateX(28px)`,
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function ResultCard({ score, total, coinsEarned = 0, onBack, onRetry, onStickerBook, onPet }: Props) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
  const [praise] = useState(() => getPraise(pct));
  const [sticker] = useState<StickerDef>(() => pickSticker(score, total));
  const [showSticker, setShowSticker] = useState(false);
  const [confettiOn, setConfettiOn] = useState(false);

  useEffect(() => {
    // Save sticker
    addSticker({ defId: sticker.id, earnedAt: Date.now(), score, total });

    const t1 = setTimeout(() => { setConfettiOn(true); playLevelUp(); }, 200);
    const t2 = setTimeout(() => setShowSticker(true), 800);
    const t3 = setTimeout(() => setConfettiOn(false), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <Confetti active={confettiOn} />

      {/* Stars */}
      <div className="flex gap-3 mb-4">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className={`text-5xl transition-all duration-300 ${i < stars ? 'animate-bounce-in' : 'opacity-20'}`}
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* Star burst */}
      {pct === 100 && <StarBurst />}

      {/* Praise text */}
      <div className="text-center mb-6 animate-bounce-in" style={{ animationDelay: '0.2s' }}>
        <p className="text-2xl font-extrabold text-gray-800 mb-1">{praise}</p>
        <p className="text-lg font-bold text-purple-600">你是最棒的！继续加油！💖</p>
      </div>

      {/* Score card */}
      <div className="bg-white rounded-3xl p-6 shadow-md w-full max-w-sm mb-6 animate-bounce-in" style={{ animationDelay: '0.3s' }}>
        <div className="text-5xl font-extrabold text-center text-purple-600 mb-1">{pct}%</div>
        <p className="text-center text-gray-400 text-sm mb-5">本次得分</p>
        <div className="flex justify-around">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">{score}</div>
            <div className="text-xs text-gray-400 mt-0.5">答对</div>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">{total - score}</div>
            <div className="text-xs text-gray-400 mt-0.5">答错</div>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">{total}</div>
            <div className="text-xs text-gray-400 mt-0.5">总题数</div>
          </div>
        </div>
      </div>

      {/* Coins earned */}
      {coinsEarned > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-6 py-3 mb-4 text-center animate-bounce-in" style={{ animationDelay: '0.25s' }}>
          <p className="text-sm text-yellow-600">获得金块</p>
          <p className="text-3xl font-extrabold text-yellow-500">💛 ×{coinsEarned}</p>
          <p className="text-xs text-yellow-500 mt-0.5">去喂给宠物让它成长吧！</p>
        </div>
      )}

      {/* Sticker reveal */}
      <div
        className={`w-full max-w-sm mb-6 transition-all duration-500 ${
          showSticker ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <p className="text-center text-sm text-gray-500 mb-3">🎁 获得贴画！</p>
        <div
          className={`mx-auto rounded-3xl p-6 text-white text-center shadow-xl bg-gradient-to-br ${sticker.gradient} ${
            showSticker ? 'animate-sticker-reveal' : ''
          }`}
          style={{ maxWidth: 220 }}
        >
          <div className="text-6xl mb-2">{sticker.emoji}</div>
          <div className="font-extrabold text-lg">{sticker.name}</div>
          <div className="text-sm opacity-80 mt-0.5">{sticker.desc}</div>
          <div className="mt-2 inline-block bg-white/25 rounded-full px-3 py-0.5 text-xs font-bold">
            {RARITY_LABEL[sticker.rarity]} ✦
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-sm mb-2">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 py-3 bg-white text-gray-700 rounded-2xl font-semibold shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Home size={16} />首页
        </button>
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold shadow-md"
        >
          <RotateCcw size={16} />再来
        </button>
        {onPet && (
          <button
            onClick={onPet}
            className="flex items-center justify-center gap-1.5 py-3 bg-yellow-50 text-yellow-700 rounded-2xl font-semibold shadow-sm hover:bg-yellow-100 transition-colors border border-yellow-200"
          >
            🐾 喂宠物
          </button>
        )}
        {onStickerBook && (
          <button
            onClick={onStickerBook}
            className="flex items-center justify-center gap-1.5 py-3 bg-white text-purple-600 rounded-2xl font-semibold shadow-sm hover:bg-purple-50 transition-colors"
          >
            <BookOpen size={16} />贴画册
          </button>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { getTitleProgress } from '../utils/titles';
import { getLearnedWords } from '../utils/storage';
import { WORDS } from '../data/words';
import { playLevelUp } from '../utils/sound';

interface Props {
  compact?: boolean;
}

export function TitleBadge({ compact = false }: Props) {
  const learnedCount = getLearnedWords(WORDS).length;
  const { current, next, pct, needed } = getTitleProgress(learnedCount);
  const prevTitleId = useRef(current.id);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (prevTitleId.current !== current.id && learnedCount > 0) {
      setShowLevelUp(true);
      playLevelUp();
      const t = setTimeout(() => setShowLevelUp(false), 3000);
      return () => clearTimeout(t);
    }
    prevTitleId.current = current.id;
  }, [current.id, learnedCount]);

  // Compact mode: a small pill for navigation areas
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 shadow-sm">
        <span className="text-lg">{current.emoji}</span>
        <span className="text-xs font-bold text-gray-700">{current.name}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Level-up notification */}
      {showLevelUp && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 animate-bounce-in whitespace-nowrap">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            🎉 升级啦！解锁「{current.name}」！
          </span>
        </div>
      )}

      {/* Card */}
      <div
        className="rounded-3xl overflow-hidden shadow-md"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)' }}
      >
        <div className="px-5 py-4 flex items-center gap-4">
          {/* Emoji */}
          <div
            className="shrink-0 flex items-center justify-center rounded-2xl"
            style={{
              width: 72, height: 72,
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(4px)',
              fontSize: 44,
            }}
          >
            {current.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/60 mb-0.5">当前头衔</p>
            <h3 className="text-xl font-extrabold text-white leading-tight truncate">
              {current.name}
            </h3>
            <p className="text-xs text-white/70 mt-0.5">{current.desc}</p>
            <div className="mt-1.5 inline-flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-0.5">
              <span className="text-xs text-white/90 font-semibold">✨ {current.power}</span>
            </div>
          </div>
        </div>

        {/* Progress to next */}
        {next ? (
          <div className="px-5 pb-4">
            <div className="flex justify-between text-xs text-white/60 mb-1.5">
              <span>距离「{next.emoji} {next.name}」</span>
              <span>还差 {needed} 个单词</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
                }}
              />
            </div>
          </div>
        ) : (
          <div className="px-5 pb-4 text-center text-sm font-bold text-white/80">
            👑 最高头衔！你是单词女王！
          </div>
        )}
      </div>
    </div>
  );
}

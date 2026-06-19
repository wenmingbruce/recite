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
  const prevCountRef = useRef(learnedCount);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    const prev = prevCountRef.current;
    const prevTitle = getTitleProgress(prev).current;
    if (prevTitle.id !== current.id && learnedCount > 0) {
      setShowLevelUp(true);
      playLevelUp();
      setTimeout(() => setShowLevelUp(false), 3000);
    }
    prevCountRef.current = learnedCount;
  }, [learnedCount, current.id]);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${current.bgColor} border border-white/60`}>
        <span className="text-lg">{current.emoji}</span>
        <span className={`text-xs font-bold ${current.textColor}`}>{current.name}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Level up animation */}
      {showLevelUp && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap animate-bounce-in">
          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            🎉 升级啦！{current.name}
          </span>
        </div>
      )}

      <div className={`rounded-3xl p-5 bg-gradient-to-br ${current.gradient} text-white shadow-md`}>
        {/* Animal & Title */}
        <div className="flex items-center gap-4">
          <div className="text-6xl drop-shadow-md">{current.emoji}</div>
          <div>
            <p className="text-xs opacity-80 mb-0.5">当前头衔</p>
            <h3 className="text-xl font-extrabold leading-tight">{current.name}</h3>
            <p className="text-xs opacity-80 mt-0.5">{current.desc}</p>
            <p className="text-xs mt-1 bg-white/20 rounded-full px-2 py-0.5 inline-block">
              ✨ {current.power}
            </p>
          </div>
        </div>

        {/* Progress to next */}
        {next && (
          <div className="mt-4">
            <div className="flex justify-between text-xs opacity-80 mb-1.5">
              <span>距离「{next.name} {next.emoji}」</span>
              <span>还需掌握 {needed} 个单词</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
        {!next && (
          <div className="mt-3 text-center text-sm font-bold opacity-90">
            👑 已达到最高头衔，你是最棒的！
          </div>
        )}
      </div>
    </div>
  );
}

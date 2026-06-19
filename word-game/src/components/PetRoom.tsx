import { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  getPet, feedPet, getPetStage, getLevelProgress,
  PET_STAGES, type FeedResult,
} from '../utils/pet';
import { PetDisplay } from './PetDisplay';
import { playLevelUp, playCorrectHit } from '../utils/sound';

interface Props { onBack: () => void; }

function GoldIcon({ size = 18 }: { size?: number }) {
  return (
    <span style={{ fontSize: size, lineHeight: 1 }}>💛</span>
  );
}

export function PetRoom({ onBack }: Props) {
  const [pet, setPet] = useState(() => getPet());
  const [isEating, setIsEating] = useState(false);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [feedMsg, setFeedMsg] = useState<string | null>(null);
  const [floatingCoins, setFloatingCoins] = useState<number[]>([]);

  const stage = getPetStage(pet.level);
  const progress = getLevelProgress(pet);
  const nextStage = pet.level < 5 ? PET_STAGES[pet.level + 1] : null;

  const handleFeed = useCallback(() => {
    const result: FeedResult = feedPet(1);
    if (!result.success) {
      setFeedMsg(result.reason ?? '喂食失败');
      setTimeout(() => setFeedMsg(null), 2000);
      return;
    }

    setPet(result.pet);
    setIsEating(true);
    playCorrectHit();

    // Floating coin animation
    const id = Date.now();
    setFloatingCoins(prev => [...prev, id]);
    setTimeout(() => setFloatingCoins(prev => prev.filter(x => x !== id)), 1000);

    setTimeout(() => setIsEating(false), 900);

    if (result.leveledUp) {
      setTimeout(() => {
        setIsLevelingUp(true);
        playLevelUp();
        setFeedMsg(`🎉 进化了！变成了「${PET_STAGES[result.newLevel].name}」！`);
        setTimeout(() => { setIsLevelingUp(false); setFeedMsg(null); }, 3500);
      }, 400);
    }
  }, []);

  const feedCost = 1;
  const canFeed = pet.coins >= feedCost && pet.level < 5;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/60">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">我的宠物</h1>
        {/* Coin display */}
        <div className="ml-auto flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1.5">
          <GoldIcon size={18} />
          <span className="text-sm font-bold text-yellow-700">{pet.coins}</span>
          <span className="text-xs text-yellow-500">金块</span>
        </div>
      </div>

      {/* Pet stage name */}
      <div className="text-center mb-2">
        <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-sm">
          {stage.title}
        </span>
      </div>

      {/* Pet display area */}
      <div className="bg-gradient-to-b from-sky-100 via-green-50 to-green-100 rounded-3xl p-6 shadow-sm mb-4 relative overflow-hidden">
        {/* Sky dots */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/40"
            style={{ width: 6+i*3, height: 6+i*3, top: `${10+i*8}%`, left: `${5+i*12}%`, opacity: 0.6 }} />
        ))}
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-green-200/60 rounded-b-3xl" />

        {/* Floating coin animations */}
        {floatingCoins.map(id => (
          <div key={id} className="absolute animate-float-up pointer-events-none z-20"
            style={{ top: '30%', left: '50%', fontSize: 28 }}>
            💛
          </div>
        ))}

        {/* Feed message */}
        {feedMsg && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap animate-bounce-in">
            <span className="bg-white text-purple-700 font-bold text-sm px-4 py-1.5 rounded-full shadow-lg">
              {feedMsg}
            </span>
          </div>
        )}

        {/* The pet */}
        <div className="flex justify-center items-end" style={{ minHeight: 220 }}>
          <PetDisplay
            level={pet.level}
            isEating={isEating}
            isLevelingUp={isLevelingUp}
            size={130}
          />
        </div>
      </div>

      {/* Pet info card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-bold text-gray-800 text-lg">{pet.name}</p>
            <p className="text-sm text-gray-500">{stage.desc}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-1 rounded-lg">
              {stage.ability}
            </p>
          </div>
        </div>

        {/* XP progress */}
        {nextStage ? (
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>成长进度 → {nextStage.name}</span>
              <span>还需 {stage.xpToNext! - Math.round(progress * stage.xpToNext!)} 金块</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-sm font-bold text-yellow-600">
            👑 已达最终形态！
          </div>
        )}
      </div>

      {/* Feed button */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-gray-700">喂食</p>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <GoldIcon size={16} />
            <span>每次消耗 {feedCost} 金块</span>
          </div>
        </div>

        <button
          onClick={handleFeed}
          disabled={!canFeed}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            canFeed
              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {pet.level >= 5 ? '👑 已达最高形态' : canFeed ? '💛 喂食！' : `金块不足（还差 ${feedCost - pet.coins}）`}
        </button>

        {!canFeed && pet.level < 5 && (
          <p className="text-center text-xs text-gray-400 mt-2">
            去背单词赚金块吧！答对1题=1金块，满分额外+5💛
          </p>
        )}
      </div>

      {/* All stages preview */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="font-bold text-gray-700 mb-3">成长路线</p>
        <div className="flex justify-between items-end gap-1">
          {PET_STAGES.map((s, i) => (
            <div key={i} className={`flex-1 flex flex-col items-center gap-1 ${i > pet.level ? 'opacity-35 grayscale' : ''}`}>
              <div className={`text-2xl ${i === pet.level ? 'animate-bounce-in' : ''}`}>
                {['🥚','🐾','🦄','✨','🌈','👑'][i]}
              </div>
              <div className={`text-xs text-center font-medium leading-tight ${i === pet.level ? 'text-purple-600' : 'text-gray-400'}`}>
                {s.name.split('').slice(0, 3).join('')}
              </div>
              {i === pet.level && (
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  getPet, feedPet, getPetStage, getLevelProgress,
  PET_STAGES, type FeedResult,
} from '../utils/pet';
import { PetDisplay } from './PetDisplay';
import { playLevelUp, playCorrectHit } from '../utils/sound';
import petLv1 from '../assets/pet_lv1.png';
import petLv2 from '../assets/pet_lv2.png';
import petLv3 from '../assets/pet_lv3.png';

const STAGE_IMGS = [null, petLv1, petLv2, petLv3] as const;

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
        <div className="flex items-end justify-between gap-1">
          {PET_STAGES.map((s, i) => {
            const unlocked = i <= pet.level;
            const isCurrent = i === pet.level;
            const img = STAGE_IMGS[i as 0|1|2|3];

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                {/* Stage image or silhouette */}
                <div style={{ position: 'relative', width: 60, height: 60 }}>
                  {i === 0 ? (
                    /* Egg */
                    <div style={{
                      width: 54, height: 54, margin: '0 auto',
                      background: unlocked
                        ? 'radial-gradient(ellipse at 38% 30%,#fff9f0 0%,#fde8c8 55%,#f5c98e 100%)'
                        : 'radial-gradient(ellipse, #c0c0c0 0%, #888 100%)',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: isCurrent ? '0 0 0 2.5px #a855f7' : 'none',
                      opacity: unlocked ? 1 : 0.4,
                    }}>
                      <span style={{ fontSize: 22, filter: unlocked ? 'none' : 'brightness(0) opacity(0.5)' }}>
                        {unlocked ? '🥚' : '🥚'}
                      </span>
                    </div>
                  ) : (
                    /* Pet image or silhouette */
                    <div style={{
                      width: 60, height: 60,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative',
                    }}>
                      <img
                        src={img!}
                        alt={s.name}
                        style={{
                          width: 54, height: 54,
                          objectFit: 'contain',
                          /* Silhouette for locked, full color for unlocked */
                          filter: unlocked
                            ? isCurrent
                              ? 'drop-shadow(0 0 6px rgba(168,85,247,0.7))'
                              : 'none'
                            : 'brightness(0) opacity(0.22)',
                          transition: 'filter 0.4s',
                        }}
                      />
                      {/* Current level indicator ring */}
                      {isCurrent && (
                        <div style={{
                          position: 'absolute', inset: -3,
                          borderRadius: '50%',
                          border: '2.5px solid #a855f7',
                          boxShadow: '0 0 8px rgba(168,85,247,0.5)',
                          pointerEvents: 'none',
                        }} />
                      )}
                      {/* Lock icon for still locked */}
                      {!unlocked && (
                        <div style={{
                          position: 'absolute', bottom: 2, right: 2,
                          fontSize: 14, lineHeight: 1,
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                        }}>🔒</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div style={{
                  fontSize: 10, fontWeight: 700, textAlign: 'center', lineHeight: 1.2,
                  color: isCurrent ? '#7c3aed' : unlocked ? '#374151' : '#9ca3af',
                }}>
                  {unlocked ? s.name : '???'}
                </div>

                {/* Cost to next */}
                {i < PET_STAGES.length - 1 && !unlocked && (
                  <div style={{ fontSize: 10, color: '#d1d5db' }}>100💛</div>
                )}

                {/* Current dot */}
                {isCurrent && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#7c3aed', boxShadow: '0 0 6px rgba(124,58,237,0.6)',
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full border-2 border-purple-400" />
            <span className="text-xs text-gray-500">当前</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🔒</span>
            <span className="text-xs text-gray-500">未解锁（显示轮廓）</span>
          </div>
        </div>
      </div>
    </div>
  );
}

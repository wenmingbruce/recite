import { useState, useCallback, useRef } from 'react';
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

// Theme colors per level (bg gradient, ring color, text color)
const LEVEL_THEME = [
  { bg: 'from-amber-50 via-yellow-50 to-amber-50',    ring: '#f59e0b', glow: 'rgba(251,191,36,0.25)' },
  { bg: 'from-pink-50 via-rose-50 to-purple-50',       ring: '#ec4899', glow: 'rgba(236,72,153,0.22)' },
  { bg: 'from-blue-50 via-indigo-50 to-purple-50',     ring: '#6366f1', glow: 'rgba(99,102,241,0.25)' },
  { bg: 'from-yellow-50 via-amber-50 to-orange-50',    ring: '#f59e0b', glow: 'rgba(245,158,11,0.30)' },
];

interface Props { onBack: () => void; }

function GoldIcon({ size = 18 }: { size?: number }) {
  return <span style={{ fontSize: size, lineHeight: 1 }}>💛</span>;
}

export function PetRoom({ onBack }: Props) {
  const [pet, setPet]           = useState(() => getPet());
  const [isEating, setIsEating] = useState(false);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [feedMsg, setFeedMsg]   = useState<string | null>(null);
  const [floatingCoins, setFloatingCoins] = useState<number[]>([]);

  // Preview state — which stage is shown in the main display
  const [previewLevel, setPreviewLevel] = useState<number>(() => { const p = getPet(); return p.level; });
  const [transitioning, setTransitioning] = useState(false);
  const [spotlightOn, setSpotlightOn]   = useState(false);
  const transTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const stage       = getPetStage(previewLevel);
  const actualStage = getPetStage(pet.level);
  const progress    = getLevelProgress(pet);
  const nextStage   = pet.level < 3 ? PET_STAGES[pet.level + 1] : null;
  const isPreviewing = previewLevel !== pet.level;
  const previewLocked = previewLevel > pet.level;
  const theme = LEVEL_THEME[Math.max(0, previewLevel)];

  // ── Click stage in bottom row ──────────────────────────────────────────────
  const handleSelectStage = (lvl: number) => {
    if (lvl === previewLevel) return;
    clearTimeout(transTimer.current);

    // Quick transition: scale out → in
    setTransitioning(true);
    setSpotlightOn(true);
    setTimeout(() => {
      setPreviewLevel(lvl);
      setTransitioning(false);
    }, 220);
    transTimer.current = setTimeout(() => setSpotlightOn(false), 600);
  };

  // ── Feed pet ───────────────────────────────────────────────────────────────
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
    const id = Date.now();
    setFloatingCoins(prev => [...prev, id]);
    setTimeout(() => setFloatingCoins(prev => prev.filter(x => x !== id)), 1000);
    setTimeout(() => setIsEating(false), 900);

    if (result.leveledUp) {
      setTimeout(() => {
        setIsLevelingUp(true);
        setPreviewLevel(result.newLevel);
        playLevelUp();
        setFeedMsg(`🎉 进化了！变成了「${PET_STAGES[result.newLevel].name}」！`);
        setTimeout(() => { setIsLevelingUp(false); setFeedMsg(null); }, 3500);
      }, 400);
    }
  }, []);

  const feedCost = 1;
  const canFeed  = pet.coins >= feedCost && pet.level < 3;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/60">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">我的宠物</h1>
        <div className="ml-auto flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1.5">
          <GoldIcon size={18} />
          <span className="text-sm font-bold text-yellow-700">{pet.coins}</span>
          <span className="text-xs text-yellow-500">金块</span>
        </div>
      </div>

      {/* Stage title */}
      <div className="text-center mb-2">
        <span className={`inline-block text-white text-sm font-bold px-4 py-1 rounded-full shadow-sm transition-all duration-300 ${
          previewLevel === 0 ? 'bg-amber-400' :
          previewLevel === 1 ? 'bg-gradient-to-r from-pink-400 to-purple-400' :
          previewLevel === 2 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                               'bg-gradient-to-r from-amber-400 to-orange-500'
        }`}>
          {stage.title}
          {previewLocked && ' 🔒'}
          {isPreviewing && !previewLocked && ' ✅'}
        </span>
      </div>

      {/* ── Main pet display area ── */}
      <div
        className={`rounded-3xl p-4 shadow-sm mb-4 relative overflow-hidden transition-all duration-500 bg-gradient-to-b ${theme.bg}`}
        style={{ minHeight: 260 }}
      >
        {/* Animated background glow pulse */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 24,
          background: `radial-gradient(ellipse at center, ${theme.glow} 0%, transparent 70%)`,
          animation: spotlightOn ? 'none' : 'petGlow 3s ease-in-out infinite alternate',
          opacity: spotlightOn ? 1 : 0.7,
          transition: 'opacity 0.3s',
        }} />

        {/* Spotlight burst on transition */}
        {spotlightOn && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 24,
            background: `radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, transparent 65%)`,
            animation: 'petGlow 0.5s ease-out forwards',
            pointerEvents: 'none', zIndex: 5,
          }} />
        )}

        {/* Sky dots */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/30"
            style={{ width: 6+i*4, height: 6+i*4, top: `${8+i*10}%`, left: `${4+i*14}%`, opacity: 0.5 }} />
        ))}

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-green-200/40 rounded-b-3xl" />

        {/* Floating coins */}
        {floatingCoins.map(id => (
          <div key={id} className="absolute animate-float-up pointer-events-none z-20"
            style={{ top: '30%', left: '50%', fontSize: 28 }}>💛</div>
        ))}

        {/* Feed message */}
        {feedMsg && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap animate-bounce-in">
            <span className="bg-white text-purple-700 font-bold text-sm px-4 py-1.5 rounded-full shadow-lg">
              {feedMsg}
            </span>
          </div>
        )}

        {/* Locked overlay when previewing locked stage */}
        {previewLocked && (
          <div className="absolute inset-0 rounded-3xl z-10 flex flex-col items-center justify-end pb-6"
            style={{ background: 'rgba(0,0,0,0.08)' }}>
            <div className="bg-white/90 rounded-2xl px-4 py-2 shadow text-center">
              <p className="text-sm font-bold text-gray-700">🔒 还未解锁</p>
              <p className="text-xs text-gray-500 mt-0.5">
                还需 {(stage.xpRequired - pet.xp)} 金块
              </p>
            </div>
          </div>
        )}

        {/* Pet */}
        <div
          className="flex justify-center items-end"
          style={{
            minHeight: 220,
            transform: transitioning ? 'scale(0.65)' : 'scale(1)',
            opacity: transitioning ? 0 : 1,
            transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease',
          }}
        >
          <PetDisplay
            level={previewLevel}
            isEating={isEating && !isPreviewing}
            isLevelingUp={isLevelingUp}
            size={135}
          />
        </div>
      </div>

      {/* Pet info */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-bold text-gray-800 text-lg">{pet.name}</p>
            <p className="text-sm text-gray-500">{actualStage.desc}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-1 rounded-lg">
              {actualStage.ability}
            </p>
          </div>
        </div>
        {nextStage ? (
          <>
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>成长进度 → {nextStage.name}</span>
              <span>还需 {actualStage.xpToNext! - Math.round(progress * actualStage.xpToNext!)} 金块</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-center text-sm font-bold text-yellow-600">👑 已达最终形态！</p>
        )}
      </div>

      {/* Feed button */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-gray-700">喂食</p>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <GoldIcon size={16} /><span>每次消耗 {feedCost} 金块</span>
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
          {pet.level >= 3 ? '👑 已达最高形态' : canFeed ? '💛 喂食！' : `金块不足（还差 ${feedCost - pet.coins}）`}
        </button>
        {!canFeed && pet.level < 3 && (
          <p className="text-center text-xs text-gray-400 mt-2">
            去背单词赚金块！答对1题=1金块，满分额外+5💛
          </p>
        )}
      </div>

      {/* ── Stage gallery — click to preview ── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="font-bold text-gray-700 mb-1">成长路线</p>
        <p className="text-xs text-gray-400 mb-3">点击查看各形态 ↓</p>

        <div className="flex items-end justify-between gap-2">
          {PET_STAGES.map((s, i) => {
            const unlocked    = i <= pet.level;
            const isCurrent   = i === pet.level;
            const isPreviewed = i === previewLevel;
            const img         = STAGE_IMGS[i as 0|1|2|3];

            return (
              <button
                key={i}
                onClick={() => handleSelectStage(i)}
                className={`flex-1 flex flex-col items-center gap-1.5 rounded-2xl py-2 px-1 transition-all duration-200 ${
                  isPreviewed
                    ? 'bg-purple-50 ring-2 ring-purple-400 scale-105 shadow-md'
                    : 'hover:bg-gray-50 active:scale-95'
                }`}
              >
                {/* Image / silhouette */}
                <div style={{ position: 'relative', width: 54, height: 54 }}>
                  {i === 0 ? (
                    <div style={{
                      width: 50, height: 50, margin: '0 auto',
                      background: unlocked
                        ? 'radial-gradient(ellipse at 38% 30%,#fff9f0 0%,#fde8c8 55%,#f5c98e 100%)'
                        : 'radial-gradient(ellipse,#d1d5db 0%,#9ca3af 100%)',
                      borderRadius: '50% 50% 50% 50%/60% 60% 40% 40%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: unlocked ? 1 : 0.35,
                      boxShadow: isPreviewed ? '0 0 10px rgba(168,85,247,0.5)' : 'none',
                    }}>
                      <span style={{ fontSize: 20 }}>🥚</span>
                    </div>
                  ) : (
                    <>
                      <img
                        src={img!}
                        alt={s.name}
                        style={{
                          width: 54, height: 54,
                          objectFit: 'contain',
                          filter: unlocked
                            ? isPreviewed
                              ? 'drop-shadow(0 0 8px rgba(168,85,247,0.8))'
                              : 'none'
                            : 'brightness(0) opacity(0.2)',
                          transition: 'filter 0.3s, transform 0.2s',
                          transform: isPreviewed ? 'scale(1.08)' : 'scale(1)',
                        }}
                      />
                      {!unlocked && (
                        <div style={{
                          position: 'absolute', bottom: 0, right: 0,
                          fontSize: 13, lineHeight: 1,
                        }}>🔒</div>
                      )}
                    </>
                  )}

                  {/* Selected ring */}
                  {isPreviewed && (
                    <div style={{
                      position: 'absolute', inset: -4,
                      borderRadius: '50%',
                      border: '2px solid #a855f7',
                      boxShadow: '0 0 8px rgba(168,85,247,0.5)',
                      pointerEvents: 'none',
                      animation: 'petGlow 1.5s ease-in-out infinite alternate',
                    }} />
                  )}
                  {/* Current dot */}
                  {isCurrent && !isPreviewed && (
                    <div style={{
                      position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#7c3aed',
                    }} />
                  )}
                </div>

                {/* Name */}
                <div style={{
                  fontSize: 10, fontWeight: 700, textAlign: 'center', lineHeight: 1.2,
                  color: isPreviewed ? '#7c3aed' : unlocked ? '#374151' : '#9ca3af',
                }}>
                  {unlocked ? s.name : '???'}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-3">
          💡 已解锁的形态点击即可预览 · 未解锁只显示轮廓
        </p>
      </div>
    </div>
  );
}

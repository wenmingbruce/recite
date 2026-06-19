/** CSS-only pet creature — 6 growth stages */

interface Props {
  level: number;       // 0-5
  isEating?: boolean;
  isLevelingUp?: boolean;
  size?: number;       // base size in px (default 140)
}

const STAGE_COLORS = [
  // level 0 (egg) – handled separately
  null,
  // level 1 – soft pink/cream
  { body: '#fff5ee', fur: '#ffe4d6', accent: '#ffb3ba', blush: '#ffc0cb', horn: null,    glow: 'rgba(255,180,186,0.4)' },
  // level 2 – lavender
  { body: '#f5f0ff', fur: '#e8d8ff', accent: '#c3a0ff', blush: '#d8b4fe', horn: '#ffd700', glow: 'rgba(195,160,255,0.5)' },
  // level 3 – sky blue
  { body: '#eef6ff', fur: '#bfdbfe', accent: '#60a5fa', blush: '#93c5fd', horn: '#fff176', glow: 'rgba(96,165,250,0.5)' },
  // level 4 – mint green
  { body: '#f0fdf4', fur: '#bbf7d0', accent: '#4ade80', blush: '#86efac', horn: '#fbbf24', glow: 'rgba(74,222,128,0.5)' },
  // level 5 – rainbow/gold
  { body: '#fffbeb', fur: '#fde68a', accent: '#f59e0b', blush: '#fcd34d', horn: '#fff',    glow: 'rgba(251,191,36,0.6)' },
];

export function PetDisplay({ level, isEating = false, isLevelingUp = false, size = 140 }: Props) {
  const s = size;

  if (level === 0) return <EggPet size={s} isEating={isEating} />;

  const c = STAGE_COLORS[Math.min(level, 5)]!;

  return (
    <div
      className={`relative select-none ${isLevelingUp ? 'animate-bounce-in' : ''}`}
      style={{ width: s * 1.8, height: s * 1.8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Outer glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, ${c.glow} 0%, transparent 65%)`,
        borderRadius: '50%',
        animation: 'petGlow 2.5s ease-in-out infinite alternate',
      }} />

      {/* Level 5 rainbow ring */}
      {level >= 5 && (
        <div style={{
          position: 'absolute',
          width: s * 1.4, height: s * 1.4,
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #f87171, #fb923c, #facc15, #4ade80, #60a5fa, #a78bfa, #f87171)',
          opacity: 0.35,
          animation: 'spinRainbow 3s linear infinite',
        }} />
      )}

      {/* Level 4+ sparkles */}
      {level >= 4 && ['✨','⭐','✨'].map((e, i) => (
        <span key={i} style={{
          position: 'absolute',
          fontSize: s * 0.16,
          top: `${[5, 0, 8][i]}%`,
          left: `${[5, 50, 82][i]}%`,
          animation: `floatSpark ${1.2 + i * 0.4}s ease-in-out infinite alternate`,
          filter: 'drop-shadow(0 0 4px #ffd700)',
        }}>{e}</span>
      ))}

      {/* Wings — level 3+ */}
      {level >= 3 && (
        <>
          <Wing side="left" color={c.accent} size={s} level={level} />
          <Wing side="right" color={c.accent} size={s} level={level} />
        </>
      )}

      {/* Main body */}
      <div style={{ position: 'relative', width: s, height: s }}>
        {/* Ears */}
        <Ear side="left" colors={c} size={s} />
        <Ear side="right" colors={c} size={s} />

        {/* Horn — level 2+ */}
        {level >= 2 && c.horn && (
          <div style={{
            position: 'absolute',
            top: -s * 0.3, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: `${s * 0.07}px solid transparent`,
            borderRight: `${s * 0.07}px solid transparent`,
            borderBottom: `${s * 0.28}px solid ${c.horn}`,
            filter: `drop-shadow(0 0 8px ${c.horn})`,
            zIndex: 2,
          }}>
            {/* Horn shine */}
            <div style={{
              position: 'absolute',
              top: s * 0.04, left: -s * 0.02,
              width: 3, height: s * 0.12,
              background: 'rgba(255,255,255,0.7)',
              borderRadius: 2,
              transform: 'rotate(-8deg)',
            }} />
          </div>
        )}

        {/* Body circle */}
        <div style={{
          width: s, height: s,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 38% 30%, white 0%, ${c.body} 45%, ${c.fur} 100%)`,
          boxShadow: [
            `inset -${s*0.06}px -${s*0.05}px ${s*0.12}px rgba(0,0,0,0.08)`,
            `inset ${s*0.03}px ${s*0.03}px ${s*0.07}px rgba(255,255,255,0.9)`,
            `0 ${s*0.05}px ${s*0.15}px rgba(0,0,0,0.12)`,
          ].join(', '),
          position: 'relative',
          overflow: 'hidden',
          animation: isEating ? 'petEat 0.3s ease-in-out 3' : 'petBob 3s ease-in-out infinite',
        }}>
          {/* Fur texture overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            borderRadius: '50%',
          }} />

          {/* Eyes */}
          <Eye side="left" colors={c} size={s} isEating={isEating} />
          <Eye side="right" colors={c} size={s} isEating={isEating} />

          {/* Blush */}
          <div style={{
            position: 'absolute', top: '50%', left: '10%',
            width: s * 0.22, height: s * 0.13,
            background: c.blush, borderRadius: '50%', opacity: 0.5,
          }} />
          <div style={{
            position: 'absolute', top: '50%', right: '10%',
            width: s * 0.22, height: s * 0.13,
            background: c.blush, borderRadius: '50%', opacity: 0.5,
          }} />

          {/* Mouth */}
          <div style={{
            position: 'absolute',
            top: isEating ? '60%' : '58%',
            left: '50%', transform: 'translateX(-50%)',
            width: isEating ? s * 0.32 : s * 0.22,
            height: isEating ? s * 0.18 : s * 0.1,
            borderBottom: isEating ? 'none' : `2.5px solid ${c.accent}cc`,
            borderRadius: isEating ? `${s*0.05}px` : '0 0 50% 50%',
            background: isEating ? c.accent : 'none',
            transition: 'all 0.2s',
          }} />

          {/* Little paws at bottom */}
          <div style={{
            position: 'absolute', bottom: s * 0.04,
            left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: s * 0.12,
          }}>
            {[0,1].map(i => (
              <div key={i} style={{
                width: s * 0.2, height: s * 0.12,
                background: c.fur,
                borderRadius: '50%',
                boxShadow: `inset 0 -2px 4px ${c.accent}40`,
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Eating coin effect */}
      {isEating && (
        <div style={{
          position: 'absolute', top: '10%', right: '20%',
          fontSize: s * 0.25,
          animation: 'coinFloat 0.8s ease-out forwards',
        }}>💛</div>
      )}
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

interface ColorSet {
  body: string; fur: string; accent: string; blush: string; horn: string | null; glow: string;
}

function Ear({ side, colors: c, size: s }: { side: 'left' | 'right'; colors: ColorSet; size: number }) {
  const isLeft = side === 'left';
  return (
    <div style={{
      position: 'absolute',
      top: -s * 0.2,
      [isLeft ? 'left' : 'right']: s * 0.1,
      width: s * 0.3, height: s * 0.35,
      background: `linear-gradient(${isLeft ? 145 : 35}deg, ${c.body}, ${c.fur})`,
      borderRadius: '50% 50% 35% 35%',
      boxShadow: `inset ${isLeft ? '-' : ''}2px -3px 6px rgba(0,0,0,0.08)`,
      zIndex: 1,
    }}>
      <div style={{
        position: 'absolute', inset: '20% 20% 30%',
        background: c.blush, borderRadius: '50%', opacity: 0.55,
      }} />
    </div>
  );
}

function Eye({ side, colors: c, size: s, isEating }: { side: 'left'|'right'; colors: ColorSet; size: number; isEating: boolean }) {
  const isLeft = side === 'left';
  return (
    <div style={{
      position: 'absolute',
      top: '32%',
      [isLeft ? 'left' : 'right']: '18%',
      width: s * 0.15, height: isEating ? s * 0.05 : s * 0.15,
      background: '#1e293b',
      borderRadius: '50%',
      boxShadow: `0 0 0 ${s*0.025}px white, 0 0 0 ${s*0.04}px ${c.accent}60`,
      transition: 'height 0.15s',
    }}>
      {!isEating && (
        <div style={{
          position: 'absolute', top: '15%', left: '15%',
          width: '35%', height: '35%',
          background: 'white', borderRadius: '50%',
        }} />
      )}
    </div>
  );
}

function Wing({ side, color, size: s, level }: { side: 'left'|'right'; color: string; size: number; level: number }) {
  const isLeft = side === 'left';
  const wingScale = level >= 4 ? 1.35 : level >= 3 ? 1 : 0.8;
  return (
    <div style={{
      position: 'absolute',
      top: '35%',
      [isLeft ? 'left' : 'right']: `${-s * 0.38 * wingScale}px`,
      width: s * 0.45 * wingScale,
      height: s * 0.55 * wingScale,
      background: `linear-gradient(${isLeft ? 135 : 225}deg, ${color}cc 0%, ${color}44 60%, transparent 100%)`,
      borderRadius: isLeft ? '80% 20% 20% 70%' : '20% 80% 70% 20%',
      transform: `rotate(${isLeft ? -18 : 18}deg)`,
      filter: 'blur(0.5px)',
      opacity: 0.85,
      animation: `wingFlap ${2 + (isLeft ? 0 : 0.15)}s ease-in-out infinite alternate`,
    }} />
  );
}

function EggPet({ size: s, isEating }: { size: number; isEating: boolean }) {
  return (
    <div style={{
      position: 'relative', width: s * 1.3, height: s * 1.4,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      {/* Egg body */}
      <div style={{
        width: s, height: s * 1.25,
        background: 'radial-gradient(ellipse at 38% 30%, #fff9f0 0%, #fde8c8 60%, #f5c98e 100%)',
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        boxShadow: 'inset -8px -8px 16px rgba(0,0,0,0.07), inset 4px 4px 10px rgba(255,255,255,0.8), 0 8px 20px rgba(0,0,0,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 4,
        animation: isEating ? 'eggWiggle 0.4s ease-in-out 2' : 'petBob 3s ease-in-out infinite',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Shine */}
        <div style={{
          position: 'absolute', top: '10%', left: '20%',
          width: '25%', height: '18%',
          background: 'rgba(255,255,255,0.65)',
          borderRadius: '50%', transform: 'rotate(-30deg)',
        }} />
        <span style={{ fontSize: s * 0.28 }}>❓</span>
        <span style={{ fontSize: s * 0.12, color: '#c8a065', fontWeight: 700, letterSpacing: 1 }}>???</span>
      </div>

      {/* Small crack hints at later stages */}
      <div style={{ height: 8 }} />
    </div>
  );
}

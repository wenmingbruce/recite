/**
 * Pet display — one image, three increasingly spectacular visual stages.
 * Level 0: Egg
 * Level 1: 魔法小猫 — soft pink glow, gentle float
 * Level 2: 星光精灵 — blue/purple glow, orbiting stars, translucent wings
 * Level 3: 彩虹女王 — rainbow ring, golden crown, full particle burst
 */
import petImg from '../assets/pet.png';

interface Props {
  level: number;
  isEating?: boolean;
  isLevelingUp?: boolean;
  size?: number;
}

export function PetDisplay({ level, isEating = false, isLevelingUp = false, size = 140 }: Props) {
  const lvl = Math.min(level, 3);

  if (lvl === 0) return <EggDisplay size={size} isEating={isEating} />;

  const imgScale = [0, 0.72, 0.9, 1.08][lvl];
  const imgSize  = size * imgScale;

  return (
    <div style={{
      position: 'relative',
      width: size * 1.8,
      height: size * 1.8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* ── Level 3: Rotating rainbow outer ring ── */}
      {lvl === 3 && (
        <div style={{
          position: 'absolute',
          width: imgSize * 1.65,
          height: imgSize * 1.65,
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #f87171 0%, #fb923c 15%, #facc15 30%, #4ade80 45%, #60a5fa 60%, #a78bfa 75%, #f472b6 90%, #f87171 100%)',
          animation: 'spinRainbow 3.5s linear infinite',
          opacity: 0.45,
        }} />
      )}

      {/* ── Level 3: Inner gold shimmer ring ── */}
      {lvl === 3 && (
        <div style={{
          position: 'absolute',
          width: imgSize * 1.35,
          height: imgSize * 1.35,
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #fde68a, #f59e0b, #fde68a, #fbbf24, #fde68a)',
          animation: 'spinRainbow 2s linear infinite reverse',
          opacity: 0.35,
        }} />
      )}

      {/* ── Level 2+: Ambient glow ── */}
      {lvl >= 2 && (
        <div style={{
          position: 'absolute',
          width: imgSize * 1.7,
          height: imgSize * 1.7,
          borderRadius: '50%',
          background: lvl === 3
            ? 'radial-gradient(ellipse, rgba(255,215,0,0.55) 0%, rgba(167,139,250,0.3) 50%, transparent 75%)'
            : 'radial-gradient(ellipse, rgba(139,92,246,0.5) 0%, rgba(96,165,250,0.25) 55%, transparent 75%)',
          animation: 'petGlow 2s ease-in-out infinite alternate',
        }} />
      )}

      {/* ── Level 1: Soft pink glow ── */}
      {lvl === 1 && (
        <div style={{
          position: 'absolute',
          width: imgSize * 1.5,
          height: imgSize * 1.5,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(249,168,212,0.55) 0%, rgba(216,180,254,0.2) 55%, transparent 75%)',
          animation: 'petGlow 2.8s ease-in-out infinite alternate',
        }} />
      )}

      {/* ── Level 2+: Translucent wings ── */}
      {lvl >= 2 && (
        <>
          <div style={{
            position: 'absolute',
            left: size * 0.04,
            top: '38%',
            width: imgSize * 0.7,
            height: imgSize * 0.75,
            background: lvl === 3
              ? 'linear-gradient(135deg, rgba(250,204,21,0.65) 0%, rgba(167,139,250,0.45) 50%, transparent 100%)'
              : 'linear-gradient(135deg, rgba(96,165,250,0.6) 0%, rgba(167,139,250,0.35) 60%, transparent 100%)',
            borderRadius: '80% 20% 20% 70%',
            transform: 'rotate(-22deg)',
            filter: 'blur(1.5px)',
            animation: 'wingFlap 2s ease-in-out infinite alternate',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute',
            right: size * 0.04,
            top: '38%',
            width: imgSize * 0.7,
            height: imgSize * 0.75,
            background: lvl === 3
              ? 'linear-gradient(225deg, rgba(250,204,21,0.65) 0%, rgba(167,139,250,0.45) 50%, transparent 100%)'
              : 'linear-gradient(225deg, rgba(96,165,250,0.6) 0%, rgba(167,139,250,0.35) 60%, transparent 100%)',
            borderRadius: '20% 80% 70% 20%',
            transform: 'rotate(22deg)',
            filter: 'blur(1.5px)',
            animation: 'wingFlap 2.15s ease-in-out infinite alternate',
            zIndex: 0,
          }} />
        </>
      )}

      {/* ── Level 2+: Orbiting sparkle stars ── */}
      {lvl >= 2 && (['✨','⭐','💫','✨'] as const).map((e, i) => (
        <span key={i} style={{
          position: 'absolute',
          fontSize: lvl === 3 ? size * 0.15 : size * 0.12,
          top:  `${[5,  2,  72, 68][i]}%`,
          left: `${[8, 70,  8, 72][i]}%`,
          animation: `floatSpark ${1.0 + i * 0.35}s ease-in-out infinite alternate`,
          filter: lvl === 3 ? 'drop-shadow(0 0 6px #ffd700)' : 'drop-shadow(0 0 4px #a78bfa)',
          zIndex: 4,
        }}>{e}</span>
      ))}

      {/* ── Level 3: Crown overlay ── */}
      {lvl === 3 && (
        <div style={{
          position: 'absolute',
          top: `calc(50% - ${imgSize * 0.5 + size * 0.17}px)`,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: size * 0.22,
          filter: 'drop-shadow(0 0 8px rgba(255,200,0,0.9))',
          zIndex: 5,
          animation: 'floatSpark 1.5s ease-in-out infinite alternate',
        }}>👑</div>
      )}

      {/* ── Level 3: Ground sparkle particles ── */}
      {lvl === 3 && ['🌟','✨','🌟'].map((e, i) => (
        <span key={`gs${i}`} style={{
          position: 'absolute',
          bottom: `${8 + i * 3}%`,
          left: `${15 + i * 28}%`,
          fontSize: size * 0.1,
          animation: `floatSpark ${1.3 + i * 0.3}s ease-in-out infinite alternate`,
          filter: 'drop-shadow(0 0 4px #ffd700)',
          zIndex: 4,
        }}>{e}</span>
      ))}

      {/* ── Pet image ── */}
      <img
        src={petImg}
        alt="pet"
        style={{
          width: imgSize,
          height: imgSize,
          objectFit: 'contain',
          position: 'relative',
          zIndex: 2,
          animation: isEating
            ? 'petEat 0.35s ease-in-out 3'
            : isLevelingUp
            ? 'bounceIn 0.6s ease-out'
            : 'petBob 3s ease-in-out infinite',
          filter: lvl === 3
            ? 'drop-shadow(0 0 16px rgba(255,200,50,0.9)) drop-shadow(0 0 32px rgba(167,139,250,0.5))'
            : lvl === 2
            ? 'drop-shadow(0 0 10px rgba(96,165,250,0.75)) drop-shadow(0 0 20px rgba(167,139,250,0.45))'
            : 'drop-shadow(0 0 6px rgba(249,168,212,0.65)) drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
          transition: 'filter 0.5s, width 0.5s, height 0.5s',
        }}
      />

      {/* ── Eating coin burst ── */}
      {isEating && (
        <div style={{
          position: 'absolute', top: '12%', right: '18%',
          fontSize: size * 0.22,
          animation: 'coinFloat 0.9s ease-out forwards',
          zIndex: 6,
        }}>💛</div>
      )}
    </div>
  );
}

// ── Egg ──────────────────────────────────────────────────────────────────────
function EggDisplay({ size: s, isEating }: { size: number; isEating: boolean }) {
  return (
    <div style={{
      position: 'relative', width: s * 1.5, height: s * 1.5,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Soft egg glow */}
      <div style={{
        position: 'absolute', inset: '10%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,235,180,0.5) 0%, transparent 70%)',
        animation: 'petGlow 3s ease-in-out infinite alternate',
      }} />
      <div style={{
        width: s * 0.72, height: s * 0.88,
        background: 'radial-gradient(ellipse at 38% 30%, #fff9f0 0%, #fde8c8 55%, #f5c98e 100%)',
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        boxShadow: [
          'inset -8px -8px 18px rgba(0,0,0,0.07)',
          'inset 5px 5px 12px rgba(255,255,255,0.85)',
          '0 8px 24px rgba(0,0,0,0.1)',
        ].join(', '),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 5,
        animation: isEating ? 'eggWiggle 0.4s ease-in-out 3' : 'petBob 3s ease-in-out infinite',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Shine */}
        <div style={{
          position: 'absolute', top: '10%', left: '20%',
          width: '26%', height: '18%',
          background: 'rgba(255,255,255,0.7)',
          borderRadius: '50%', transform: 'rotate(-30deg)',
        }} />
        <span style={{ fontSize: s * 0.28, filter: 'drop-shadow(0 2px 4px rgba(200,160,80,0.4))' }}>❓</span>
        <span style={{ fontSize: s * 0.11, color: '#b8904a', fontWeight: 800, letterSpacing: 2, opacity: 0.75 }}>???</span>
      </div>
    </div>
  );
}

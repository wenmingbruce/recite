/**
 * Pet display — uses level-specific images with safe CSS effects.
 * No conic-gradient (poor Safari support). Uses drop-shadow + radial glow + simple rings.
 */
import petLv1 from '../assets/pet_lv1.png';
import petLv2 from '../assets/pet_lv2.png';
import petLv3 from '../assets/pet_lv3.png';

const PET_IMGS: Record<number, string> = { 1: petLv1, 2: petLv2, 3: petLv3 };

interface Props {
  level: number;
  isEating?: boolean;
  isLevelingUp?: boolean;
  size?: number;
}

export function PetDisplay({ level, isEating = false, isLevelingUp = false, size = 140 }: Props) {
  const lvl = Math.min(Math.max(0, level), 3);

  if (lvl === 0) return <EggDisplay size={size} isEating={isEating} />;

  const img = PET_IMGS[lvl];
  if (!img) return <EggDisplay size={size} isEating={isEating} />;

  const scaleArr = [0, 0.78, 0.90, 1.04];
  const imgSize = size * (scaleArr[lvl] ?? 0.78);
  const container = size * 1.8;

  return (
    <div style={{ position: 'relative', width: container, height: container,
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* ── Ambient glow (all levels) ── */}
      <div style={{
        position: 'absolute',
        width: imgSize * 1.55,
        height: imgSize * 1.55,
        borderRadius: '50%',
        background:
          lvl === 3 ? 'radial-gradient(ellipse, rgba(255,215,0,0.45) 0%, rgba(255,140,0,0.2) 45%, transparent 72%)'
          : lvl === 2 ? 'radial-gradient(ellipse, rgba(100,149,237,0.45) 0%, rgba(147,112,219,0.22) 50%, transparent 72%)'
          : 'radial-gradient(ellipse, rgba(255,182,193,0.55) 0%, rgba(216,180,254,0.2) 55%, transparent 75%)',
        animation: 'petGlow 2.5s ease-in-out infinite alternate',
      }} />

      {/* ── Level 3: Rotating colored ring (no conic-gradient) ── */}
      {lvl === 3 && (
        <>
          <div style={{
            position: 'absolute',
            width: imgSize * 1.5,
            height: imgSize * 1.5,
            borderRadius: '50%',
            border: `${Math.max(4, imgSize * 0.05)}px solid transparent`,
            background: `linear-gradient(white,white) padding-box,
                         linear-gradient(var(--a,0turn), #f87171, #fb923c, #facc15, #4ade80, #60a5fa, #a78bfa, #f472b6, #f87171) border-box`,
            animation: 'spinRainbow 3.5s linear infinite',
            opacity: 0.7,
          }} />
          <div style={{
            position: 'absolute',
            width: imgSize * 1.28,
            height: imgSize * 1.28,
            borderRadius: '50%',
            border: `${Math.max(3, imgSize * 0.04)}px solid rgba(255,215,0,0.55)`,
            animation: 'spinRainbow 2.2s linear infinite reverse',
            boxShadow: '0 0 12px rgba(255,200,0,0.5)',
          }} />
        </>
      )}

      {/* ── Level 2+: Wings ── */}
      {lvl >= 2 && [
        { isLeft: true },
        { isLeft: false },
      ].map(({ isLeft }) => (
        <div key={isLeft ? 'l' : 'r'} style={{
          position: 'absolute',
          top: '36%',
          ...(isLeft ? { left: size * 0.01 } : { right: size * 0.01 }),
          width: imgSize * 0.62,
          height: imgSize * 0.7,
          background: lvl === 3
            ? `linear-gradient(${isLeft ? 135 : 225}deg, rgba(255,215,0,0.6) 0%, rgba(255,165,0,0.35) 50%, transparent 100%)`
            : `linear-gradient(${isLeft ? 135 : 225}deg, rgba(100,149,237,0.6) 0%, rgba(147,112,219,0.35) 55%, transparent 100%)`,
          borderRadius: isLeft ? '80% 20% 20% 70%' : '20% 80% 70% 20%',
          transform: `rotate(${isLeft ? -20 : 20}deg)`,
          filter: 'blur(1.5px)',
          animation: `wingFlap ${isLeft ? 2.0 : 2.15}s ease-in-out infinite alternate`,
          zIndex: 0,
        }} />
      ))}

      {/* ── Level 2+: Sparkle stars ── */}
      {lvl >= 2 && (['✨','⭐','💫','✨'] as const).map((e, i) => (
        <span key={i} style={{
          position: 'absolute',
          fontSize: lvl === 3 ? size * 0.14 : size * 0.11,
          top:  ['6%', '2%', '70%', '68%'][i],
          left: ['8%', '70%', '8%', '72%'][i],
          animation: `floatSpark ${1.0 + i * 0.35}s ease-in-out infinite alternate`,
          filter: lvl === 3
            ? 'drop-shadow(0 0 5px rgba(255,200,0,0.9))'
            : 'drop-shadow(0 0 4px rgba(147,112,219,0.8))',
          zIndex: 4,
        }}>{e}</span>
      ))}

      {/* ── Level 3: Crown ── */}
      {lvl === 3 && (
        <div style={{
          position: 'absolute',
          top: Math.max(0, container * 0.5 - imgSize * 0.5 - size * 0.2),
          left: '50%', transform: 'translateX(-50%)',
          fontSize: Math.max(16, size * 0.2),
          filter: 'drop-shadow(0 0 8px rgba(255,200,0,0.9))',
          zIndex: 5,
          animation: 'floatSpark 1.5s ease-in-out infinite alternate',
        }}>👑</div>
      )}

      {/* ── Level 3: Ground sparkles ── */}
      {lvl === 3 && ['🌟','✨','🌟'].map((e, i) => (
        <span key={`g${i}`} style={{
          position: 'absolute',
          bottom: `${7 + i * 3}%`,
          left: `${14 + i * 28}%`,
          fontSize: size * 0.09,
          animation: `floatSpark ${1.3 + i * 0.3}s ease-in-out infinite alternate`,
          filter: 'drop-shadow(0 0 4px rgba(255,200,0,0.8))',
          zIndex: 4,
        }}>{e}</span>
      ))}

      {/* ── Pet image ── */}
      <img
        src={img}
        alt={`pet lv${lvl}`}
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
          filter:
            lvl === 3 ? 'drop-shadow(0 0 14px rgba(255,200,50,0.85)) drop-shadow(0 0 28px rgba(255,140,0,0.4))'
            : lvl === 2 ? 'drop-shadow(0 0 9px rgba(100,149,237,0.75)) drop-shadow(0 0 18px rgba(147,112,219,0.4))'
            : 'drop-shadow(0 0 7px rgba(255,182,193,0.75)) drop-shadow(0 2px 6px rgba(0,0,0,0.1))',
          transition: 'filter 0.4s',
        }}
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
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
    <div style={{ position: 'relative', width: s * 1.5, height: s * 1.5,
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        position: 'absolute', inset: '10%', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,235,180,0.5) 0%, transparent 70%)',
        animation: 'petGlow 3s ease-in-out infinite alternate',
      }} />
      <div style={{
        width: s * 0.72, height: s * 0.88,
        background: 'radial-gradient(ellipse at 38% 30%, #fff9f0 0%, #fde8c8 55%, #f5c98e 100%)',
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        boxShadow: 'inset -8px -8px 18px rgba(0,0,0,0.07), inset 5px 5px 12px rgba(255,255,255,0.85), 0 8px 24px rgba(0,0,0,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 5,
        animation: isEating ? 'eggWiggle 0.4s ease-in-out 3' : 'petBob 3s ease-in-out infinite',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '10%', left: '20%', width: '26%', height: '18%',
          background: 'rgba(255,255,255,0.7)', borderRadius: '50%', transform: 'rotate(-30deg)',
        }} />
        <span style={{ fontSize: s * 0.28, filter: 'drop-shadow(0 2px 4px rgba(200,160,80,0.4))' }}>❓</span>
        <span style={{ fontSize: s * 0.11, color: '#b8904a', fontWeight: 800, letterSpacing: 2, opacity: 0.75 }}>???</span>
      </div>
    </div>
  );
}

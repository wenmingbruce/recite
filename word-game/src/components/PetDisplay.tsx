/** Pet display component — uses real pet image with CSS stage effects */
import petImg from '../assets/pet.png';

interface Props {
  level: number;
  isEating?: boolean;
  isLevelingUp?: boolean;
  size?: number;
}

// Glow colors per stage
const STAGE_GLOW = [
  'rgba(255,220,150,0.0)',   // 0 egg — no glow
  'rgba(255,200,200,0.5)',   // 1 baby pink
  'rgba(180,140,255,0.55)', // 2 lavender
  'rgba(100,180,255,0.55)', // 3 sky blue
  'rgba(100,230,150,0.55)', // 4 mint
  'rgba(255,220,80,0.65)',  // 5 golden
];

const STAGE_SCALE = [0.55, 0.68, 0.82, 0.94, 1.08, 1.22];

export function PetDisplay({ level, isEating = false, isLevelingUp = false, size = 140 }: Props) {
  const lvl = Math.min(level, 5);
  const glow = STAGE_GLOW[lvl];
  const scale = STAGE_SCALE[lvl];
  const imgSize = size * scale;

  if (level === 0) {
    return <EggDisplay size={size} isEating={isEating} />;
  }

  return (
    <div
      style={{
        position: 'relative',
        width: size * 1.6,
        height: size * 1.6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        width: imgSize * 1.5,
        height: imgSize * 1.5,
        borderRadius: '50%',
        background: `radial-gradient(ellipse at center, ${glow} 0%, transparent 70%)`,
        animation: 'petGlow 2.5s ease-in-out infinite alternate',
      }} />

      {/* Level 5 rainbow ring */}
      {lvl >= 5 && (
        <div style={{
          position: 'absolute',
          width: imgSize * 1.2,
          height: imgSize * 1.2,
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #f87171, #fb923c, #facc15, #4ade80, #60a5fa, #a78bfa, #f87171)',
          opacity: 0.3,
          animation: 'spinRainbow 3s linear infinite',
        }} />
      )}

      {/* Level 4+ sparkles */}
      {lvl >= 4 && ['✨','⭐','✨'].map((e, i) => (
        <span key={i} style={{
          position: 'absolute',
          fontSize: size * 0.14,
          top: `${[8, 2, 10][i]}%`,
          left: `${[6, 48, 80][i]}%`,
          animation: `floatSpark ${1.2 + i * 0.4}s ease-in-out infinite alternate`,
          filter: 'drop-shadow(0 0 4px #ffd700)',
          zIndex: 3,
        }}>{e}</span>
      ))}

      {/* Wings for level 3+ */}
      {lvl >= 3 && (
        <>
          <div style={{
            position: 'absolute',
            left: size * 0.02,
            top: '40%',
            width: imgSize * 0.55,
            height: imgSize * 0.65,
            background: 'linear-gradient(135deg, rgba(96,165,250,0.7) 0%, rgba(167,139,250,0.4) 60%, transparent 100%)',
            borderRadius: '80% 20% 20% 70%',
            transform: 'rotate(-20deg)',
            filter: 'blur(1px)',
            animation: 'wingFlap 2s ease-in-out infinite alternate',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute',
            right: size * 0.02,
            top: '40%',
            width: imgSize * 0.55,
            height: imgSize * 0.65,
            background: 'linear-gradient(225deg, rgba(96,165,250,0.7) 0%, rgba(167,139,250,0.4) 60%, transparent 100%)',
            borderRadius: '20% 80% 70% 20%',
            transform: 'rotate(20deg)',
            filter: 'blur(1px)',
            animation: 'wingFlap 2.15s ease-in-out infinite alternate',
            zIndex: 0,
          }} />
        </>
      )}

      {/* Pet image */}
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
            ? 'petEat 0.3s ease-in-out 3'
            : isLevelingUp
            ? 'bounceIn 0.5s ease-out'
            : 'petBob 3s ease-in-out infinite',
          filter: lvl >= 5
            ? 'drop-shadow(0 0 12px rgba(255,200,50,0.8))'
            : lvl >= 3
            ? 'drop-shadow(0 0 8px rgba(100,180,255,0.6))'
            : 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))',
          transform: isLevelingUp ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s, filter 0.3s',
        }}
      />

      {/* Eating coin burst */}
      {isEating && (
        <div style={{
          position: 'absolute', top: '15%', right: '20%',
          fontSize: size * 0.2,
          animation: 'coinFloat 0.8s ease-out forwards',
          zIndex: 4,
        }}>💛</div>
      )}
    </div>
  );
}

// ── Egg stage ────────────────────────────────────────────────────────────────
function EggDisplay({ size: s, isEating }: { size: number; isEating: boolean }) {
  return (
    <div style={{
      position: 'relative', width: s * 1.4, height: s * 1.5,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: s * 0.75, height: s * 0.92,
        background: 'radial-gradient(ellipse at 38% 30%, #fff9f0 0%, #fde8c8 60%, #f5c98e 100%)',
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        boxShadow: 'inset -8px -8px 16px rgba(0,0,0,0.07), inset 4px 4px 10px rgba(255,255,255,0.8), 0 8px 20px rgba(0,0,0,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 4,
        animation: isEating ? 'eggWiggle 0.4s ease-in-out 2' : 'petBob 3s ease-in-out infinite',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '10%', left: '20%',
          width: '25%', height: '18%',
          background: 'rgba(255,255,255,0.65)',
          borderRadius: '50%', transform: 'rotate(-30deg)',
        }} />
        <span style={{ fontSize: s * 0.26 }}>❓</span>
        <span style={{ fontSize: s * 0.11, color: '#c8a065', fontWeight: 700, letterSpacing: 1 }}>???</span>
      </div>
    </div>
  );
}

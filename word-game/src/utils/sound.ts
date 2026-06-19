let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function note(
  frequency: number,
  startTime: number,
  duration: number,
  volume = 0.3,
  type: OscillatorType = 'sine'
) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

/** 打中正确地鼠：欢快的上行音阶 */
export function playCorrectHit() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    // 明亮的上行四音
    [523, 659, 784, 1047].forEach((freq, i) => note(freq, t + i * 0.08, 0.25, 0.35, 'sine'));
    // 叮一声尾音
    note(1568, t + 0.35, 0.4, 0.2, 'sine');
  } catch { /* ignore */ }
}

/** 打错地鼠：夸张的滑落音 */
export function playWrongHit() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.35);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t);
    osc.stop(t + 0.4);
  } catch { /* ignore */ }
}

/** 地鼠出现：轻快的弹起声 */
export function playMoleAppear() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    note(440, t, 0.08, 0.15, 'sine');
    note(660, t + 0.07, 0.1, 0.12, 'sine');
  } catch { /* ignore */ }
}

/** 游戏结束：欢呼或失落 */
export function playGameOver(win: boolean) {
  try {
    const c = getCtx();
    const t = c.currentTime;
    if (win) {
      // 胜利号角
      [523, 659, 784, 659, 784, 1047].forEach((f, i) =>
        note(f, t + i * 0.12, 0.2, 0.3, 'square')
      );
    } else {
      // 失落下行
      [392, 330, 262, 196].forEach((f, i) =>
        note(f, t + i * 0.18, 0.25, 0.25, 'sine')
      );
    }
  } catch { /* ignore */ }
}

/** 升级头衔：魔法音效 */
export function playLevelUp() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) =>
      note(f, t + i * 0.1, 0.3, 0.25, 'sine')
    );
  } catch { /* ignore */ }
}

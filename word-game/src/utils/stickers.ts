export interface StickerDef {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  gradient: string;
}

export interface EarnedSticker {
  defId: string;
  earnedAt: number;
  score: number;
  total: number;
}

export const STICKER_DEFS: StickerDef[] = [
  { id: 'shooting_star',  emoji: '🌠', name: '流星许愿',   desc: '完美答题！',     rarity: 'legendary', gradient: 'from-indigo-400 to-purple-600' },
  { id: 'crown',          emoji: '👑', name: '王冠荣耀',   desc: '满分传说！',     rarity: 'legendary', gradient: 'from-yellow-300 to-amber-500' },
  { id: 'diamond',        emoji: '💎', name: '钻石之心',   desc: '闪耀无比！',     rarity: 'epic',      gradient: 'from-cyan-300 to-blue-500' },
  { id: 'unicorn',        emoji: '🦄', name: '独角兽',     desc: '梦幻之力！',     rarity: 'epic',      gradient: 'from-purple-300 to-pink-400' },
  { id: 'rocket',         emoji: '🚀', name: '小火箭',     desc: '速度之星！',     rarity: 'rare',      gradient: 'from-blue-400 to-indigo-500' },
  { id: 'fire',           emoji: '🔥', name: '热情之火',   desc: '斗志满满！',     rarity: 'rare',      gradient: 'from-orange-400 to-red-500' },
  { id: 'butterfly',      emoji: '🦋', name: '蝴蝶飞舞',   desc: '翩翩起舞！',     rarity: 'rare',      gradient: 'from-sky-300 to-teal-400' },
  { id: 'rainbow',        emoji: '🌈', name: '彩虹之约',   desc: '坚持到底！',     rarity: 'common',    gradient: 'from-rose-300 to-orange-400' },
  { id: 'flower',         emoji: '🌸', name: '樱花朵朵',   desc: '努力盛开！',     rarity: 'common',    gradient: 'from-pink-300 to-rose-400' },
  { id: 'star',           emoji: '⭐', name: '闪亮小星',   desc: '你很棒！',       rarity: 'common',    gradient: 'from-yellow-300 to-amber-400' },
  { id: 'heart',          emoji: '💖', name: '爱心加油',   desc: '满满正能量！',   rarity: 'common',    gradient: 'from-pink-400 to-rose-500' },
  { id: 'magic_wand',     emoji: '🪄', name: '魔法棒',     desc: '奇迹发生了！',   rarity: 'rare',      gradient: 'from-violet-400 to-purple-500' },
];

const RARITY_WEIGHTS: Record<StickerDef['rarity'], number> = {
  legendary: 1,
  epic: 3,
  rare: 6,
  common: 10,
};

/** Pick a sticker based on score percentage */
export function pickSticker(score: number, total: number): StickerDef {
  const pct = total > 0 ? score / total : 0;
  let pool: StickerDef[];

  if (pct === 1) {
    pool = STICKER_DEFS.filter(s => s.rarity === 'legendary' || s.rarity === 'epic');
  } else if (pct >= 0.8) {
    pool = STICKER_DEFS.filter(s => s.rarity !== 'legendary');
  } else if (pct >= 0.6) {
    pool = STICKER_DEFS.filter(s => s.rarity === 'common' || s.rarity === 'rare');
  } else {
    pool = STICKER_DEFS.filter(s => s.rarity === 'common');
  }

  // weighted random
  const totalWeight = pool.reduce((s, d) => s + RARITY_WEIGHTS[d.rarity], 0);
  let r = Math.random() * totalWeight;
  for (const def of pool) {
    r -= RARITY_WEIGHTS[def.rarity];
    if (r <= 0) return def;
  }
  return pool[pool.length - 1];
}

const KEY = 'pep5_stickers';

export function getStickerCollection(): EarnedSticker[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as EarnedSticker[];
  } catch { return []; }
}

export function addSticker(s: EarnedSticker): void {
  const col = getStickerCollection();
  col.unshift(s);
  localStorage.setItem(KEY, JSON.stringify(col.slice(0, 200)));
}

export function getStickerCounts(): Record<string, number> {
  return getStickerCollection().reduce<Record<string, number>>((acc, s) => {
    acc[s.defId] = (acc[s.defId] ?? 0) + 1;
    return acc;
  }, {});
}

export const RARITY_LABEL: Record<StickerDef['rarity'], string> = {
  legendary: '传说',
  epic: '史诗',
  rare: '稀有',
  common: '普通',
};

export const RARITY_COLOR: Record<StickerDef['rarity'], string> = {
  legendary: 'text-yellow-500',
  epic: 'text-purple-500',
  rare: 'text-blue-500',
  common: 'text-gray-500',
};

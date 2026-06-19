// ── Pet stage definitions ────────────────────────────────────────────────────

export interface PetStage {
  level: number;
  name: string;
  title: string;        // display title
  xpRequired: number;   // total XP to reach this level (0 for level 0)
  xpToNext: number | null; // XP needed to reach NEXT level (null = max)
  desc: string;
  ability: string;
}

export const PET_STAGES: PetStage[] = [
  {
    level: 0, name: '神秘之蛋', title: '🥚 神秘之蛋',
    xpRequired: 0, xpToNext: 15,
    desc: '一颗神秘的蛋，在等待被唤醒…',
    ability: '用金块喂食让它孵化！',
  },
  {
    level: 1, name: '雪球宝宝', title: '🐾 雪球宝宝',
    xpRequired: 15, xpToNext: 35,
    desc: '圆滚滚软乎乎，超级可爱！',
    ability: '初级萌力：每日额外+1金块',
  },
  {
    level: 2, name: '独角猫咪', title: '🦄 独角猫咪',
    xpRequired: 50, xpToNext: 60,
    desc: '长出了闪亮的小角，魔法满满！',
    ability: '魔法之眼：答对连击额外奖励',
  },
  {
    level: 3, name: '月光精灵', title: '✨ 月光精灵',
    xpRequired: 110, xpToNext: 100,
    desc: '翅膀展开，可以飞翔在月光下！',
    ability: '月光祝福：满分额外+8金块',
  },
  {
    level: 4, name: '彩虹守护', title: '🌈 彩虹守护',
    xpRequired: 210, xpToNext: 180,
    desc: '七彩光芒，守护每一个单词！',
    ability: '彩虹加成：学习时长双倍统计',
  },
  {
    level: 5, name: '神圣天使', title: '👑 神圣天使',
    xpRequired: 390, xpToNext: null,
    desc: '最终形态！传说中的守护天使！',
    ability: '神圣守护：所有奖励翻倍！',
  },
];

// ── Pet state ────────────────────────────────────────────────────────────────

export interface PetState {
  xp: number;           // total XP ever invested
  level: number;        // current stage 0-5
  coins: number;        // current gold coins
  totalCoins: number;   // total ever earned
  name: string;
  lastFedAt: number;
  fedToday: number;     // times fed today
  fedTodayDate: string; // date string for reset
}

const KEY = 'pep5_pet';

export function getPet(): PetState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as PetState;
  } catch { /* ignore */ }
  return {
    xp: 0, level: 0, coins: 0, totalCoins: 0,
    name: '小雪球', lastFedAt: 0,
    fedToday: 0, fedTodayDate: '',
  };
}

function savePet(p: PetState) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

function todayKey() { return new Date().toISOString().slice(0, 10); }

// ── Coin operations ──────────────────────────────────────────────────────────

/** Award gold coins; returns new coin total */
export function awardCoins(amount: number): PetState {
  const p = getPet();
  const updated: PetState = {
    ...p,
    coins: p.coins + amount,
    totalCoins: p.totalCoins + amount,
  };
  savePet(updated);
  return updated;
}

/** Calculate coins earned for a game session */
export function calcCoins(score: number, total: number): number {
  if (total === 0) return 0;
  const base = score;                          // 1 coin per correct answer
  const perfectBonus = score === total ? 5 : 0;
  return base + perfectBonus;
}

// ── Feeding ──────────────────────────────────────────────────────────────────

export interface FeedResult {
  success: boolean;
  reason?: string;         // why failed
  leveledUp: boolean;
  newLevel: number;
  xpGained: number;
  pet: PetState;
}

/** Feed the pet one time (costs `cost` coins, gains `cost` XP) */
export function feedPet(cost = 1): FeedResult {
  const p = getPet();

  if (p.level >= 5) {
    return { success: false, reason: '已达最高等级！', leveledUp: false, newLevel: p.level, xpGained: 0, pet: p };
  }
  if (p.coins < cost) {
    return { success: false, reason: '金块不足！快去背单词赚金块吧！', leveledUp: false, newLevel: p.level, xpGained: 0, pet: p };
  }

  const today = todayKey();
  const fedToday = p.fedTodayDate === today ? p.fedToday : 0;

  const newXp   = p.xp + cost;
  const current = PET_STAGES[p.level];
  const nextLvl = p.level + 1;

  let newLevel = p.level;
  let leveledUp = false;

  if (current.xpToNext !== null && newXp >= (current.xpRequired + current.xpToNext)) {
    newLevel = Math.min(nextLvl, 5);
    leveledUp = true;
  }

  const updated: PetState = {
    ...p,
    xp: newXp,
    level: newLevel,
    coins: p.coins - cost,
    lastFedAt: Date.now(),
    fedToday: fedToday + 1,
    fedTodayDate: today,
  };
  savePet(updated);

  return { success: true, leveledUp, newLevel, xpGained: cost, pet: updated };
}

/** Current stage definition for the pet */
export function getPetStage(level: number): PetStage {
  return PET_STAGES[Math.min(level, PET_STAGES.length - 1)];
}

/** XP progress within current level (0-1) */
export function getLevelProgress(p: PetState): number {
  const stage = getPetStage(p.level);
  if (!stage.xpToNext) return 1;
  const invested = p.xp - stage.xpRequired;
  return Math.min(invested / stage.xpToNext, 1);
}

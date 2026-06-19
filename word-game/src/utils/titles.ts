export interface Title {
  minWords: number;
  id: string;
  name: string;
  emoji: string;
  animal: string;
  gradient: string;
  textColor: string;
  bgColor: string;
  desc: string;
  power: string; // 能力描述，趣味性
}

export const TITLES: Title[] = [
  {
    minWords: 0,
    id: 'chick',
    name: '小鸡宝宝',
    emoji: '🐣',
    animal: '小鸡',
    gradient: 'from-yellow-300 to-amber-400',
    textColor: 'text-amber-800',
    bgColor: 'bg-amber-50',
    desc: '刚刚破壳，踏上学习之旅！',
    power: '萌新力 +100',
  },
  {
    minWords: 8,
    id: 'bunny',
    name: '棉花糖兔',
    emoji: '🐰',
    animal: '小兔',
    gradient: 'from-pink-300 to-rose-400',
    textColor: 'text-rose-800',
    bgColor: 'bg-rose-50',
    desc: '软乎乎，甜蜜蜜，单词记得牢！',
    power: '可爱力 +200',
  },
  {
    minWords: 20,
    id: 'cat',
    name: '奶茶猫咪',
    emoji: '🐱',
    animal: '猫咪',
    gradient: 'from-purple-300 to-violet-400',
    textColor: 'text-violet-800',
    bgColor: 'bg-violet-50',
    desc: '慵懒又聪明，单词难不倒！',
    power: '智慧力 +300',
  },
  {
    minWords: 35,
    id: 'fox',
    name: '小狐狸精灵',
    emoji: '🦊',
    animal: '狐狸',
    gradient: 'from-orange-300 to-red-400',
    textColor: 'text-orange-800',
    bgColor: 'bg-orange-50',
    desc: '机灵狡黠，单词都是小菜一碟！',
    power: '机智力 +400',
  },
  {
    minWords: 50,
    id: 'panda',
    name: '熊猫公主',
    emoji: '🐼',
    animal: '熊猫',
    gradient: 'from-emerald-300 to-teal-400',
    textColor: 'text-teal-800',
    bgColor: 'bg-teal-50',
    desc: '优雅高贵，英语学霸！',
    power: '优雅力 +500',
  },
  {
    minWords: 65,
    id: 'unicorn',
    name: '独角兽骑士',
    emoji: '🦄',
    animal: '独角兽',
    gradient: 'from-indigo-300 to-purple-400',
    textColor: 'text-indigo-800',
    bgColor: 'bg-indigo-50',
    desc: '神奇梦幻，踏虹而来！',
    power: '魔法力 +600',
  },
  {
    minWords: 80,
    id: 'butterfly',
    name: '蝴蝶仙子',
    emoji: '🦋',
    animal: '蝴蝶',
    gradient: 'from-sky-300 to-blue-400',
    textColor: 'text-blue-800',
    bgColor: 'bg-blue-50',
    desc: '翩翩起舞，美丽如诗！',
    power: '灵动力 +700',
  },
  {
    minWords: 92,
    id: 'dragon',
    name: '彩虹小龙',
    emoji: '🐲',
    animal: '彩虹龙',
    gradient: 'from-red-400 to-rose-500',
    textColor: 'text-red-800',
    bgColor: 'bg-red-50',
    desc: '龙腾九天，无所不知！',
    power: '霸气力 +800',
  },
  {
    minWords: 100,
    id: 'queen',
    name: '单词女王',
    emoji: '👑',
    animal: '女王',
    gradient: 'from-yellow-400 to-amber-500',
    textColor: 'text-yellow-900',
    bgColor: 'bg-yellow-50',
    desc: '全部掌握！英语女王驾到！',
    power: '无限力量 ∞',
  },
];

export function getCurrentTitle(learnedCount: number): Title {
  let result = TITLES[0];
  for (const t of TITLES) {
    if (learnedCount >= t.minWords) result = t;
    else break;
  }
  return result;
}

export function getNextTitle(learnedCount: number): Title | null {
  for (const t of TITLES) {
    if (learnedCount < t.minWords) return t;
  }
  return null;
}

export function getTitleProgress(learnedCount: number): {
  current: Title;
  next: Title | null;
  pct: number;
  needed: number;
} {
  const current = getCurrentTitle(learnedCount);
  const next = getNextTitle(learnedCount);
  if (!next) return { current, next: null, pct: 100, needed: 0 };
  const range = next.minWords - current.minWords;
  const done = learnedCount - current.minWords;
  return {
    current,
    next,
    pct: Math.round((done / range) * 100),
    needed: next.minWords - learnedCount,
  };
}

// 物品链定义 — 咖啡 / 甜点 / 旅行 三大主题
const CHAINS = {
  coffee: {
    name: '咖啡',
    color: '#8B5E3C',
    bg: 'linear-gradient(145deg, #D4A574, #8B5E3C)',
    items: [
      { emoji: '🫘', name: '咖啡豆' },
      { emoji: '☕', name: '浓缩咖啡' },
      { emoji: '🥤', name: '拿铁' },
      { emoji: '🧋', name: '特调咖啡' },
      { emoji: '👑', name: '皇家咖啡' },
    ],
  },
  pastry: {
    name: '甜点',
    color: '#E8879B',
    bg: 'linear-gradient(145deg, #FFD6E0, #E8879B)',
    items: [
      { emoji: '🌾', name: '面粉' },
      { emoji: '🍪', name: '曲奇' },
      { emoji: '🧁', name: '纸杯蛋糕' },
      { emoji: '🎂', name: '庆典蛋糕' },
      { emoji: '💎', name: '钻石蛋糕' },
    ],
  },
  travel: {
    name: '旅行',
    color: '#7B9FD4',
    bg: 'linear-gradient(145deg, #B8D4F0, #7B9FD4)',
    items: [
      { emoji: '🎫', name: '车票' },
      { emoji: '📮', name: '明信片' },
      { emoji: '🧳', name: '行李箱' },
      { emoji: '✈️', name: '飞机票' },
      { emoji: '🌍', name: '环球旅行' },
    ],
  },
};

const SPAWNERS = {
  coffee_machine: {
    emoji: '☕',
    name: '咖啡机',
    chain: 'coffee',
    energyCost: 1,
    bg: 'linear-gradient(145deg, #C4956A, #6B4226)',
  },
  oven: {
    emoji: '🍳',
    name: '甜点烤箱',
    chain: 'pastry',
    energyCost: 1,
    bg: 'linear-gradient(145deg, #FFB6C8, #D4687A)',
  },
  travel_desk: {
    emoji: '🗺️',
    name: '旅行柜台',
    chain: 'travel',
    energyCost: 1,
    bg: 'linear-gradient(145deg, #9BB8E8, #5A7FB5)',
  },
};

const COLS = 7;
const ROWS = 9;

const NPCS = [
  { name: '莉莉', avatar: '👩🏻', color: '#FFB6C1' },
  { name: '苏菲', avatar: '👩🏼', color: '#DDA0DD' },
  { name: '艾拉', avatar: '👩🏻‍🦰', color: '#F0B27A' },
  { name: '米娅', avatar: '👩🏽', color: '#85C1E9' },
  { name: '安娜', avatar: '👱‍♀️', color: '#A9DFBF' },
  { name: '夏洛特', avatar: '👩‍🦱', color: '#F1948A' },
];

const STORY_LINES = [
  '谢谢你！这家咖啡馆越来越温馨了～',
  '太棒了！我已经等不及下次来了！',
  '你的手艺真是越来越好了呢！',
  '这个味道，让我想起了旅行的美好回忆～',
  '闺蜜们一定会爱上这里的！',
  '每一口都是幸福的味道 ✨',
];

function getItemInfo(chainId, level) {
  const chain = CHAINS[chainId];
  if (!chain || level < 1 || level > chain.items.length) return null;
  return { ...chain.items[level - 1], chainId, level, chainName: chain.name, bg: chain.bg };
}

function itemKey(chainId, level) {
  return `${chainId}:${level}`;
}

function canMerge(a, b) {
  if (!a || !b || a.spawner || b.spawner) return false;
  return a.chainId === b.chainId && a.level === b.level;
}

function getMergeResult(a) {
  const maxLevel = CHAINS[a.chainId].items.length;
  if (a.level >= maxLevel) return null;
  return { chainId: a.chainId, level: a.level + 1 };
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

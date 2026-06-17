const STORAGE_KEY = 'sweet_journey_merge_v1';

function createInitialBoard() {
  const grid = new Array(COLS * ROWS).fill(null);

  // 放置生成器
  grid[0] = { spawner: 'coffee_machine', id: randomId() };
  grid[COLS] = { spawner: 'oven', id: randomId() };
  grid[COLS * 2] = { spawner: 'travel_desk', id: randomId() };

  // 初始物品
  const starters = [
    { chainId: 'coffee', level: 1, r: 1, c: 1 },
    { chainId: 'coffee', level: 1, r: 1, c: 2 },
    { chainId: 'pastry', level: 1, r: 2, c: 1 },
    { chainId: 'pastry', level: 2, r: 2, c: 2 },
    { chainId: 'travel', level: 1, r: 3, c: 1 },
    { chainId: 'coffee', level: 2, r: 1, c: 3 },
  ];
  starters.forEach(({ chainId, level, r, c }) => {
    const idx = r * COLS + c;
    if (!grid[idx]) grid[idx] = { chainId, level, id: randomId() };
  });

  return grid;
}

function generateOrder(playerLevel) {
  const npc = NPCS[Math.floor(Math.random() * NPCS.length)];
  const chains = Object.keys(CHAINS);
  const numItems = Math.random() < 0.4 ? 2 : 1;
  const requirements = [];

  for (let i = 0; i < numItems; i++) {
    const chainId = chains[Math.floor(Math.random() * chains.length)];
    const maxLv = Math.min(CHAINS[chainId].items.length, 2 + Math.floor(playerLevel / 2));
    const level = 1 + Math.floor(Math.random() * maxLv);
    requirements.push({ chainId, level });
  }

  const reward = 15 + requirements.reduce((s, r) => s + r.level * 10, 0) + Math.floor(Math.random() * 20);
  const xp = 5 + requirements.reduce((s, r) => s + r.level * 3, 0);

  return {
    id: randomId(),
    npc,
    requirements,
    reward,
    xp,
    story: STORY_LINES[Math.floor(Math.random() * STORY_LINES.length)],
  };
}

function createDefaultState() {
  return {
    grid: createInitialBoard(),
    coins: 200,
    gems: 10,
    energy: 50,
    maxEnergy: 50,
    level: 1,
    xp: 0,
    xpToNext: 50,
    orders: [generateOrder(1), generateOrder(1), generateOrder(1)],
    completedOrders: 0,
    cafeName: '甜蜜旅程咖啡馆',
    decorLevel: 1,
    lastEnergyTick: Date.now(),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Load failed', e);
  }
  return createDefaultState();
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function regenEnergy(state) {
  const now = Date.now();
  const elapsed = now - (state.lastEnergyTick || now);
  const gained = Math.floor(elapsed / (3 * 60 * 1000));
  if (gained > 0) {
    state.energy = Math.min(state.maxEnergy, state.energy + gained);
    state.lastEnergyTick = now - (elapsed % (3 * 60 * 1000));
    saveState(state);
  }
}

function idx(r, c) {
  return r * COLS + c;
}

function rc(i) {
  return { r: Math.floor(i / COLS), c: i % COLS };
}

function isValidCell(r, c) {
  return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}

function findEmptyCell(grid) {
  const empties = grid.map((v, i) => (v ? null : i)).filter((v) => v !== null);
  if (empties.length === 0) return -1;
  return empties[Math.floor(Math.random() * empties.length)];
}

/** 从母体出发，按固定顺序（右→下→左→上→对角）寻找最近空格，喷发更有规律 */
function findSpawnCellNear(grid, spawnerIdx) {
  const { r: sr, c: sc } = rc(spawnerIdx);
  const visited = new Set([spawnerIdx]);
  const queue = [];
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];

  for (const [dr, dc] of directions) {
    const nr = sr + dr;
    const nc = sc + dc;
    if (isValidCell(nr, nc)) queue.push(idx(nr, nc));
  }

  while (queue.length > 0) {
    const i = queue.shift();
    if (visited.has(i)) continue;
    visited.add(i);

    if (!grid[i]) return i;

    const { r, c } = rc(i);
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (isValidCell(nr, nc)) {
        const ni = idx(nr, nc);
        if (!visited.has(ni)) queue.push(ni);
      }
    }
  }
  return -1;
}

function countItem(grid, chainId, level) {
  return grid.filter((item) => item && !item.spawner && item.chainId === chainId && item.level === level).length;
}

function removeItems(grid, chainId, level, count) {
  let removed = 0;
  for (let i = 0; i < grid.length && removed < count; i++) {
    if (grid[i] && !grid[i].spawner && grid[i].chainId === chainId && grid[i].level === level) {
      grid[i] = null;
      removed++;
    }
  }
}

function canFulfillOrder(grid, order) {
  return order.requirements.every((req) => countItem(grid, req.chainId, req.level) >= 1);
}

function fulfillOrder(state, orderIndex) {
  const order = state.orders[orderIndex];
  if (!order || !canFulfillOrder(state.grid, order)) return false;

  order.requirements.forEach((req) => removeItems(state.grid, req.chainId, req.level, 1));

  state.coins += order.reward;
  state.xp += order.xp;
  state.completedOrders++;

  while (state.xp >= state.xpToNext) {
    state.xp -= state.xpToNext;
    state.level++;
    state.xpToNext = 50 + state.level * 25;
    state.maxEnergy += 5;
    state.energy = state.maxEnergy;
  }

  state.orders[orderIndex] = generateOrder(state.level);
  saveState(state);
  return order;
}

function tapSpawner(state, cellIndex) {
  const item = state.grid[cellIndex];
  if (!item || !item.spawner) return null;

  const spawner = SPAWNERS[item.spawner];
  if (state.energy < spawner.energyCost) return { error: 'energy' };

  const emptyIdx = findSpawnCellNear(state.grid, cellIndex);
  if (emptyIdx === -1) return { error: 'full' };

  state.energy -= spawner.energyCost;
  state.grid[emptyIdx] = { chainId: spawner.chain, level: 1, id: randomId() };
  saveState(state);
  return { spawned: emptyIdx, fromIdx: cellIndex };
}

function moveOrMerge(state, fromIdx, toIdx) {
  if (fromIdx === toIdx) return { type: 'none' };
  const from = state.grid[fromIdx];
  const to = state.grid[toIdx];
  if (!from || from.spawner) return { type: 'none' };

  if (!to) {
    state.grid[toIdx] = from;
    state.grid[fromIdx] = null;
    saveState(state);
    return { type: 'move', toIdx };
  }

  if (to.spawner) return { type: 'none' };

  if (canMerge(from, to)) {
    const result = getMergeResult(from);
    if (result) {
      state.grid[toIdx] = { ...result, id: randomId() };
      state.grid[fromIdx] = null;
      saveState(state);
      return { type: 'merge', toIdx, result };
    }
    return { type: 'max' };
  }

  if (from.chainId === to.chainId && from.level === to.level) {
    return { type: 'none' };
  }

  state.grid[fromIdx] = to;
  state.grid[toIdx] = from;
  saveState(state);
  return { type: 'swap', toIdx };
}

function sellItem(state, cellIndex) {
  const item = state.grid[cellIndex];
  if (!item || item.spawner) return 0;
  const value = item.level * 3;
  state.grid[cellIndex] = null;
  state.coins += value;
  saveState(state);
  return value;
}

function resetGame() {
  localStorage.removeItem(STORAGE_KEY);
}

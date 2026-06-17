let state = loadState();
let dragState = null;
let hoverCell = null;

const DRAG_THRESHOLD = 8;
const boardEl = () => document.getElementById('board');
const ordersEl = () => document.getElementById('orders-panel');

document.addEventListener('DOMContentLoaded', () => {
  regenEnergy(state);
  renderAll();
  bindEvents();
  setInterval(() => {
    regenEnergy(state);
    updateHUD();
  }, 30000);
});

function bindEvents() {
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm('确定要重新开始吗？所有进度将丢失。')) {
      resetGame();
      state = loadState();
      renderAll();
      showToast('已重新开始 ✨');
    }
  });
}

function renderAll() {
  renderHUD();
  renderBoard();
  renderOrders();
  renderDecor();
}

function renderHUD() {
  document.getElementById('coins').textContent = state.coins;
  document.getElementById('gems').textContent = state.gems;
  document.getElementById('energy').textContent = `${state.energy}/${state.maxEnergy}`;
  document.getElementById('player-level').textContent = state.level;
  const xpPct = Math.round((state.xp / state.xpToNext) * 100);
  document.getElementById('xp-bar').style.width = xpPct + '%';
  document.getElementById('xp-text').textContent = `${state.xp}/${state.xpToNext}`;
  document.getElementById('cafe-name').textContent = state.cafeName;
}

function updateHUD() {
  document.getElementById('energy').textContent = `${state.energy}/${state.maxEnergy}`;
}

function renderDecor() {
  const dl = state.decorLevel;
  document.getElementById('decor-flowers').style.opacity = Math.min(1, dl * 0.2);
  document.getElementById('decor-lights').style.opacity = Math.min(1, dl * 0.15 + 0.2);
}

function buildItemHTML(item, cellIdx) {
  if (item.spawner) {
    const sp = SPAWNERS[item.spawner];
    return `
      <div class="item spawner spawner-${item.spawner}" data-idx="${cellIdx}">
        <div class="spawner-glow"></div>
        <div class="item-body">
          <span class="item-emoji">${sp.emoji}</span>
        </div>
        <span class="spawner-label">${sp.name}</span>
        <div class="spawner-ring"></div>
      </div>`;
  }

  const info = getItemInfo(item.chainId, item.level);
  return `
    <div class="item piece chain-${item.chainId} lv-${item.level}" data-idx="${cellIdx}" style="--chain-color:${CHAINS[item.chainId].color}">
      <div class="item-shine"></div>
      <div class="item-body">
        <span class="item-emoji">${info.emoji}</span>
      </div>
      <span class="item-level-badge">${item.level}</span>
    </div>`;
}

function renderBoard() {
  const el = boardEl();
  el.innerHTML = '';
  el.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

  state.grid.forEach((item, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.idx = i;
    if (item) {
      cell.innerHTML = buildItemHTML(item, i);
      if (item.spawner) {
        cell.classList.add('cell-spawner');
        cell.querySelector('.item').addEventListener('click', () => onSpawnerTap(i));
      } else {
        bindDrag(cell.querySelector('.item'), i);
      }
    }
    el.appendChild(cell);
  });
}

function getCellEl(idx) {
  return boardEl().querySelector(`.cell[data-idx="${idx}"]`);
}

function bindDrag(el, idx) {
  el.addEventListener('mousedown', (e) => initDrag(e, idx));
  el.addEventListener('touchstart', (e) => initDrag(e, idx), { passive: false });
}

function initDrag(e, idx) {
  const item = state.grid[idx];
  if (!item || item.spawner) return;

  const startPt = getPoint(e);
  const info = getItemInfo(item.chainId, item.level);
  const sourceCell = getCellEl(idx);
  const sourceItem = sourceCell?.querySelector('.item');

  dragState = {
    idx,
    startX: startPt.x,
    startY: startPt.y,
    active: false,
    info,
    sourceCell,
    sourceItem,
  };

  const move = (ev) => {
    if (!dragState) return;
    const pt = getPoint(ev);
    const dx = pt.x - dragState.startX;
    const dy = pt.y - dragState.startY;

    if (!dragState.active) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      startDragVisual(pt);
    }

    ev.preventDefault();
    updateDragVisual(pt);
    updateDropHighlight(pt);
  };

  const end = (ev) => {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', end);
    document.removeEventListener('touchmove', move);
    document.removeEventListener('touchend', end);

    if (!dragState) return;

    if (dragState.active) {
      const pt = getPoint(ev);
      finishDrag(pt);
    }
    cleanupDrag();
  };

  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', end);
  document.addEventListener('touchmove', move, { passive: false });
  document.addEventListener('touchend', end);
}

function startDragVisual(pt) {
  dragState.active = true;
  const { info, sourceItem } = dragState;

  sourceItem.classList.add('dragging-source');

  dragState.ghost = document.createElement('div');
  dragState.ghost.className = `drag-ghost piece chain-${info.chainId} lv-${info.level}`;
  dragState.ghost.innerHTML = `
    <div class="item-shine"></div>
    <div class="item-body"><span class="item-emoji">${info.emoji}</span></div>`;
  document.body.appendChild(dragState.ghost);

  dragState.ghost.style.left = pt.x - 28 + 'px';
  dragState.ghost.style.top = pt.y - 28 + 'px';
}

function updateDragVisual(pt) {
  if (!dragState?.ghost) return;
  dragState.ghost.style.left = pt.x - 28 + 'px';
  dragState.ghost.style.top = pt.y - 28 + 'px';
}

function updateDropHighlight(pt) {
  clearDropHighlights();
  if (!dragState) return;

  if (dragState.ghost) dragState.ghost.style.visibility = 'hidden';
  const targets = document.elementsFromPoint(pt.x, pt.y);
  if (dragState.ghost) dragState.ghost.style.visibility = 'visible';

  const cell = targets.find((el) => el.classList?.contains('cell') || el.closest?.('.cell'))?.closest?.('.cell') ||
    targets.find((el) => el.classList?.contains('cell'));
  if (!cell) return;

  const toIdx = parseInt(cell.dataset.idx);
  const from = state.grid[dragState.idx];
  const to = state.grid[toIdx];

  if (toIdx === dragState.idx) return;

  if (!to) {
    cell.classList.add('drop-empty');
  } else if (!to.spawner && canMerge(from, to)) {
    cell.classList.add('drop-merge');
  } else if (!to.spawner) {
    cell.classList.add('drop-swap');
  }
}

function clearDropHighlights() {
  boardEl().querySelectorAll('.cell').forEach((c) => {
    c.classList.remove('drop-empty', 'drop-merge', 'drop-swap');
  });
}

function finishDrag(pt) {
  if (dragState?.ghost) dragState.ghost.style.visibility = 'hidden';
  const targets = document.elementsFromPoint(pt.x, pt.y);
  if (dragState?.ghost) dragState.ghost.style.visibility = 'visible';

  const cell = targets.find((el) => el.closest?.('.cell'))?.closest?.('.cell');
  if (!cell || !dragState) {
    bounceBack();
    return;
  }

  const fromIdx = dragState.idx;
  const toIdx = parseInt(cell.dataset.idx);
  if (fromIdx === toIdx) {
    bounceBack();
    return;
  }

  const result = moveOrMerge(state, fromIdx, toIdx);

  if (result.type === 'merge') {
    playMergeEffect(toIdx, result.result);
    if (result.result.level >= 3) spawnMergeParticles(toIdx);
  } else if (result.type === 'move') {
    playMoveEffect(fromIdx, toIdx);
  } else if (result.type === 'swap') {
    playSwapEffect(fromIdx, toIdx);
  } else if (result.type === 'max') {
    shakeCell(toIdx);
  } else {
    bounceBack();
    return;
  }

  syncBoard();
  renderOrders();
  updateHUD();
}

function bounceBack() {
  dragState?.sourceItem?.classList.add('bounce-back');
  setTimeout(() => dragState?.sourceItem?.classList.remove('bounce-back'), 300);
}

function cleanupDrag() {
  clearDropHighlights();
  dragState?.ghost?.remove();
  dragState?.sourceItem?.classList.remove('dragging-source');
  dragState = null;
  hoverCell = null;
}

function syncBoard() {
  state.grid.forEach((item, i) => {
    const cell = getCellEl(i);
    if (!cell) return;
    cell.className = 'cell';
    if (item?.spawner) cell.classList.add('cell-spawner');
    cell.innerHTML = item ? buildItemHTML(item, i) : '';
    if (item && !item.spawner) {
      bindDrag(cell.querySelector('.item'), i);
    } else if (item?.spawner) {
      cell.querySelector('.item').addEventListener('click', () => onSpawnerTap(i));
    }
  });
}

function getPoint(e) {
  if (e.touches?.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  if (e.changedTouches?.length) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function onSpawnerTap(idx) {
  const spCell = getCellEl(idx);
  const spItem = spCell?.querySelector('.item');
  spItem?.classList.add('spawner-tap');

  const result = tapSpawner(state, idx);
  setTimeout(() => spItem?.classList.remove('spawner-tap'), 350);

  if (!result) return;
  if (result.error === 'energy') {
    showToast('体力不足 ⚡');
    shakeCell(idx);
    return;
  }
  if (result.error === 'full') {
    showToast('棋盘已满');
    shakeCell(idx);
    return;
  }

  playSpawnFly(result.fromIdx, result.spawned);
  updateHUD();
  setTimeout(() => {
    syncBoard();
    renderOrders();
  }, 540);
}

function playSpawnFly(fromIdx, toIdx) {
  const fromCell = getCellEl(fromIdx);
  const toCell = getCellEl(toIdx);
  if (!fromCell || !toCell) return;

  const item = state.grid[toIdx];
  const info = getItemInfo(item.chainId, item.level);
  const fromRect = fromCell.getBoundingClientRect();
  const toRect = toCell.getBoundingClientRect();

  const flyer = document.createElement('div');
  flyer.className = `spawn-flyer piece chain-${item.chainId} lv-1`;
  flyer.innerHTML = `<div class="item-body"><span class="item-emoji">${info.emoji}</span></div>`;

  const sx = fromRect.left + fromRect.width / 2;
  const sy = fromRect.top + fromRect.height / 2;
  const ex = toRect.left + toRect.width / 2;
  const ey = toRect.top + toRect.height / 2;
  const arc = Math.min(60, Math.abs(ey - sy) * 0.4 + 20);

  flyer.style.left = sx - 24 + 'px';
  flyer.style.top = sy - 24 + 'px';
  document.body.appendChild(flyer);

  const duration = 520;
  const start = performance.now();

  function animate(now) {
    const t = Math.min(1, (now - start) / duration);
    const ease = 1 - Math.pow(1 - t, 3);
    const x = sx + (ex - sx) * ease - 24;
    const y = sy + (ey - sy) * ease - arc * Math.sin(Math.PI * t) - 24;
    const scale = 0.5 + 0.5 * ease;
    flyer.style.left = x + 'px';
    flyer.style.top = y + 'px';
    flyer.style.transform = `scale(${scale})`;
    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      flyer.remove();
      toCell.classList.remove('spawn-target');
      toCell.classList.add('spawn-landed');
      setTimeout(() => toCell.classList.remove('spawn-landed'), 400);
    }
  }

  toCell.classList.add('spawn-target');
  requestAnimationFrame(animate);
}

function playMergeEffect(idx, result) {
  const cell = getCellEl(idx);
  if (!cell) return;
  cell.classList.add('merge-burst');
  setTimeout(() => cell.classList.remove('merge-burst'), 500);
}

function playMoveEffect(fromIdx, toIdx) {
  getCellEl(toIdx)?.classList.add('move-land');
  setTimeout(() => getCellEl(toIdx)?.classList.remove('move-land'), 250);
}

function playSwapEffect(a, b) {
  [a, b].forEach((i) => {
    getCellEl(i)?.classList.add('swap-flash');
    setTimeout(() => getCellEl(i)?.classList.remove('swap-flash'), 250);
  });
}

function shakeCell(idx) {
  getCellEl(idx)?.classList.add('shake');
  setTimeout(() => getCellEl(idx)?.classList.remove('shake'), 400);
}

function spawnMergeParticles(idx) {
  const cell = getCellEl(idx);
  if (!cell) return;
  const rect = cell.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'merge-particle';
    const angle = (i / 8) * Math.PI * 2;
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    p.style.setProperty('--dx', Math.cos(angle) * 36 + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * 36 + 'px');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
}

function renderOrders() {
  const el = ordersEl();
  el.innerHTML = state.orders
    .map((order, i) => {
      const ready = canFulfillOrder(state.grid, order);
      return `
      <div class="order-card ${ready ? 'ready' : ''}" data-idx="${i}" ${ready ? `onclick="deliverOrder(${i})"` : ''}>
        <div class="order-npc" style="background:${order.npc.color}">${order.npc.avatar}</div>
        <div class="order-req-stack">
          ${order.requirements
            .map((req) => {
              const info = getItemInfo(req.chainId, req.level);
              const have = countItem(state.grid, req.chainId, req.level) >= 1;
              return `<div class="order-req ${have ? 'have' : ''}" title="${info.name}">
                <span>${info.emoji}</span>
              </div>`;
            })
            .join('')}
        </div>
        <div class="order-coin">🪙${order.reward}</div>
        ${ready ? '<div class="order-ready-badge">✓</div>' : ''}
      </div>`;
    })
    .join('');
}

function deliverOrder(idx) {
  const card = ordersEl().querySelector(`.order-card[data-idx="${idx}"]`);
  if (!card || !canFulfillOrder(state.grid, state.orders[idx])) return;

  const order = fulfillOrder(state, idx);
  if (!order) return;

  const coinEl = document.querySelector('.hud-item.coins');
  flyCoins(card, coinEl, order.reward);
  flyXp(card, order.xp);

  card.classList.add('order-complete');
  setTimeout(() => {
    if (state.completedOrders % 3 === 0) {
      state.decorLevel++;
      state.gems += 2;
      saveState(state);
      showToast('咖啡馆升级了！💎+2');
    }
    renderHUD();
    syncBoard();
    renderOrders();
    renderDecor();
  }, 450);
}

function flyCoins(fromEl, toEl, amount) {
  if (!fromEl || !toEl) return;
  const from = fromEl.getBoundingClientRect();
  const to = toEl.getBoundingClientRect();

  const floater = document.createElement('div');
  floater.className = 'coin-float';
  floater.textContent = `+${amount} 🪙`;
  floater.style.left = from.left + from.width / 2 + 'px';
  floater.style.top = from.top + 'px';
  document.body.appendChild(floater);

  const coin = document.createElement('div');
  coin.className = 'coin-fly';
  coin.textContent = '🪙';
  coin.style.left = from.left + from.width / 2 + 'px';
  coin.style.top = from.top + from.height / 2 + 'px';
  document.body.appendChild(coin);

  requestAnimationFrame(() => {
    coin.style.left = to.left + 16 + 'px';
    coin.style.top = to.top + 8 + 'px';
    coin.style.transform = 'scale(0.5)';
    coin.style.opacity = '0.6';
  });

  toEl.classList.add('coin-pulse');
  setTimeout(() => {
    floater.remove();
    coin.remove();
    toEl.classList.remove('coin-pulse');
    renderHUD();
  }, 700);
}

function flyXp(fromEl, amount) {
  const floater = document.createElement('div');
  floater.className = 'xp-float';
  floater.textContent = `+${amount} XP`;
  const rect = fromEl.getBoundingClientRect();
  floater.style.left = rect.left + rect.width / 2 + 'px';
  floater.style.top = rect.top + 10 + 'px';
  document.body.appendChild(floater);
  setTimeout(() => floater.remove(), 900);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}

window.deliverOrder = deliverOrder;

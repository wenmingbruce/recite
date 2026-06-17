let state = loadState();
let dragFrom = null;
let dragGhost = null;
let selectedCell = null;
let particles = [];

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

function renderBoard() {
  const el = boardEl();
  el.innerHTML = '';
  el.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

  state.grid.forEach((item, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.idx = i;
    const { r, c } = rc(i);

    if (item) {
      if (item.spawner) {
        const sp = SPAWNERS[item.spawner];
        cell.classList.add('cell-spawner');
        cell.innerHTML = `
          <div class="item spawner" style="background:${sp.bg}">
            <span class="item-emoji">${sp.emoji}</span>
            <span class="spawner-label">${sp.name}</span>
          </div>`;
        cell.addEventListener('click', () => onSpawnerTap(i));
      } else {
        const info = getItemInfo(item.chainId, item.level);
        cell.innerHTML = `
          <div class="item" style="background:${info.bg}" data-idx="${i}">
            <span class="item-emoji">${info.emoji}</span>
            <span class="item-level">${info.level}</span>
          </div>`;
        bindDrag(cell.querySelector('.item'), i);
      }
    }

    if (selectedCell === i) cell.classList.add('selected');
    el.appendChild(cell);
  });
}

function bindDrag(el, idx) {
  el.addEventListener('mousedown', (e) => startDrag(e, idx));
  el.addEventListener('touchstart', (e) => startDrag(e, idx), { passive: false });
}

function startDrag(e, idx) {
  e.preventDefault();
  dragFrom = idx;
  const item = state.grid[idx];
  if (!item || item.spawner) return;

  const info = getItemInfo(item.chainId, item.level);
  dragGhost = document.createElement('div');
  dragGhost.className = 'drag-ghost';
  dragGhost.innerHTML = `<span>${info.emoji}</span>`;
  document.body.appendChild(dragGhost);

  const move = (ev) => {
    const pt = getPoint(ev);
    dragGhost.style.left = pt.x - 30 + 'px';
    dragGhost.style.top = pt.y - 30 + 'px';
  };

  const end = (ev) => {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', end);
    document.removeEventListener('touchmove', move);
    document.removeEventListener('touchend', end);
    if (dragGhost) dragGhost.remove();
    dragGhost = null;

    const pt = getPoint(ev);
    const target = document.elementFromPoint(pt.x, pt.y);
    const cell = target?.closest('.cell');
    if (cell) {
      const toIdx = parseInt(cell.dataset.idx);
      handleDrop(idx, toIdx);
    }
    dragFrom = null;
  };

  move(e);
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', end);
  document.addEventListener('touchmove', move, { passive: false });
  document.addEventListener('touchend', end);
}

function getPoint(e) {
  if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  if (e.changedTouches && e.changedTouches.length) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function handleDrop(fromIdx, toIdx) {
  const result = moveOrMerge(state, fromIdx, toIdx);
  if (result.type === 'merge') {
    playMergeEffect(toIdx);
    showToast('合并成功！✨');
    const info = getItemInfo(result.result.chainId, result.result.level);
    if (info.level >= 3) spawnParticles(toIdx, '✨');
  } else if (result.type === 'max') {
    showToast('已经是最高等级了～');
  }
  renderAll();
}

function onSpawnerTap(idx) {
  const result = tapSpawner(state, idx);
  if (!result) return;
  if (result.error === 'energy') {
    showToast('体力不足，稍等恢复哦～');
    return;
  }
  if (result.error === 'full') {
    showToast('棋盘满了，先合并一些物品吧！');
    return;
  }
  playSpawnEffect(result.spawned);
  renderAll();
}

function renderOrders() {
  const el = ordersEl();
  el.innerHTML = state.orders
    .map(
      (order, i) => `
    <div class="order-card ${canFulfillOrder(state.grid, order) ? 'ready' : ''}" data-idx="${i}">
      <div class="order-npc" style="background:${order.npc.color}">${order.npc.avatar}</div>
      <div class="order-body">
        <div class="order-name">${order.npc.name} 的订单</div>
        <div class="order-items">
          ${order.requirements
            .map((req) => {
              const info = getItemInfo(req.chainId, req.level);
              const have = countItem(state.grid, req.chainId, req.level);
              return `<div class="order-req ${have >= 1 ? 'have' : ''}" title="${info.name}">
                <span>${info.emoji}</span>
              </div>`;
            })
            .join('')}
        </div>
        <div class="order-reward">🪙 ${order.reward} · ⭐ ${order.xp} XP</div>
      </div>
      <button class="btn-deliver" ${canFulfillOrder(state.grid, order) ? '' : 'disabled'} onclick="deliverOrder(${i})">
        ${canFulfillOrder(state.grid, order) ? '交付 ✓' : '未完成'}
      </button>
    </div>`
    )
    .join('');
}

function deliverOrder(idx) {
  const order = fulfillOrder(state, idx);
  if (!order) return;

  showStoryModal(order);
  if (state.completedOrders % 3 === 0) {
    state.decorLevel++;
    state.gems += 2;
    saveState(state);
  }
  renderAll();
}

function showStoryModal(order) {
  const modal = document.getElementById('story-modal');
  document.getElementById('story-avatar').textContent = order.npc.avatar;
  document.getElementById('story-avatar').style.background = order.npc.color;
  document.getElementById('story-name').textContent = order.npc.name;
  document.getElementById('story-text').textContent = order.story;
  document.getElementById('story-reward').textContent = `+${order.reward} 🪙  +${order.xp} XP`;
  modal.classList.add('show');
}

function closeStoryModal() {
  document.getElementById('story-modal').classList.remove('show');
}

function playMergeEffect(idx) {
  const cell = boardEl().children[idx];
  if (cell) {
    cell.classList.add('merge-pop');
    setTimeout(() => cell.classList.remove('merge-pop'), 400);
  }
}

function playSpawnEffect(idx) {
  const cell = boardEl().children[idx];
  if (cell) {
    cell.classList.add('spawn-pop');
    setTimeout(() => cell.classList.remove('spawn-pop'), 400);
  }
}

function spawnParticles(idx, emoji) {
  const cell = boardEl().children[idx];
  if (!cell) return;
  const rect = cell.getBoundingClientRect();
  for (let i = 0; i < 5; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emoji;
    p.style.left = rect.left + rect.width / 2 + 'px';
    p.style.top = rect.top + rect.height / 2 + 'px';
    p.style.setProperty('--dx', (Math.random() - 0.5) * 80 + 'px');
    p.style.setProperty('--dy', -30 - Math.random() * 50 + 'px');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// 全局供 HTML onclick 使用
window.deliverOrder = deliverOrder;
window.closeStoryModal = closeStoryModal;

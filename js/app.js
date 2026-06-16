let appData = loadData();
let currentMode = null;
let currentQueue = [];
let currentIndex = 0;
let sessionCorrect = 0;
let sessionWrong = 0;
let timerInterval = null;
let sessionSeconds = 0;
let showingAnswer = false;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  bindEvents();
  renderHome();
});

function initApp() {
  updateDashboard();
}

function bindEvents() {
  $$('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });

  $('#btn-start-learn').addEventListener('click', () => startMode('learn'));
  $('#btn-start-review').addEventListener('click', () => startMode('review'));
  $('#btn-start-challenge').addEventListener('click', () => startMode('challenge'));
  $('#btn-start-wrong').addEventListener('click', () => startMode('wrong'));
  $('#btn-start-wrong-from-book').addEventListener('click', () => startMode('wrong'));

  $('#btn-check').addEventListener('click', checkAnswer);
  $('#btn-show-answer').addEventListener('click', showAnswer);
  $('#btn-next').addEventListener('click', nextWord);
  $('#btn-hint').addEventListener('click', showHint);
  $('#btn-exit-session').addEventListener('click', exitSession);

  $('#answer-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (showingAnswer) nextWord();
      else checkAnswer();
    }
  });

  $$('.unit-checkbox').forEach((cb) => {
    cb.addEventListener('change', () => {
      appData.settings.selectedUnits = [];
      $$('.unit-checkbox:checked').forEach((c) => {
        appData.settings.selectedUnits.push(parseInt(c.value));
      });
      saveData(appData);
      updateDashboard();
    });
  });

  $('#btn-reset').addEventListener('click', () => {
    if (confirm('确定要重置所有学习数据吗？此操作不可恢复！')) {
      resetAllData();
      appData = loadData();
      navigate('home');
      updateDashboard();
      showToast('数据已重置');
    }
  });

  $('#challenge-size').addEventListener('change', (e) => {
    appData.settings.challengeSize = parseInt(e.target.value);
    saveData(appData);
  });
}

function navigate(page) {
  $$('.page').forEach((p) => p.classList.remove('active'));
  $(`#page-${page}`).classList.add('active');
  $$('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.page === page));

  if (page === 'home') updateDashboard();
  if (page === 'stats') renderStats();
  if (page === 'wrongbook') renderWrongBook();
  if (page === 'settings') renderSettings();
}

function updateDashboard() {
  const filtered = getFilteredWords(appData);
  const due = getDueWords(appData);
  const wrong = appData.wrongBook.filter((w) => !w.resolved);
  const mastered = filtered.filter((w) => appData.words[w.id].mastered).length;
  const curve = getForgettingCurveData(appData);

  $('#stat-total').textContent = filtered.length;
  $('#stat-mastered').textContent = mastered;
  $('#stat-due').textContent = due.length;
  $('#stat-wrong').textContent = wrong.length;
  $('#stat-time').textContent = formatTime(appData.stats.totalStudyTime);

  const pct = filtered.length ? Math.round((mastered / filtered.length) * 100) : 0;
  $('#progress-fill').style.width = pct + '%';
  $('#progress-text').textContent = `已掌握 ${pct}%`;

  renderCurveChart(curve);

  const reviewCount = getReviewQueue(appData).length;
  $('#review-badge').textContent = reviewCount;
  $('#review-badge').style.display = reviewCount > 0 ? 'inline-flex' : 'none';
}

function renderCurveChart(buckets) {
  const total = Object.values(buckets).reduce((a, b) => a + b, 0) || 1;
  const labels = { new: '未学', learning: '学习中', reviewing: '复习中', mastered: '已掌握' };
  const colors = { new: '#94a3b8', learning: '#f59e0b', reviewing: '#3b82f6', mastered: '#22c55e' };

  const container = $('#curve-chart');
  container.innerHTML = Object.entries(buckets)
    .map(
      ([key, val]) => `
    <div class="curve-bar-item">
      <div class="curve-bar" style="height:${Math.max(8, (val / total) * 100)}%;background:${colors[key]}"></div>
      <span class="curve-label">${labels[key]}</span>
      <span class="curve-count">${val}</span>
    </div>`
    )
    .join('');
}

function startMode(mode) {
  currentMode = mode;
  currentIndex = 0;
  sessionCorrect = 0;
  sessionWrong = 0;
  showingAnswer = false;
  startSession(appData);

  switch (mode) {
    case 'learn':
      currentQueue = shuffle(getNewWords(appData, 15));
      if (currentQueue.length === 0) {
        currentQueue = shuffle(
          getFilteredWords(appData).filter((w) => !appData.words[w.id].mastered).slice(0, 15)
        );
      }
      break;
    case 'review':
      currentQueue = getReviewQueue(appData);
      if (currentQueue.length === 0) {
        showToast('暂无需要复习的词语，太棒了！');
        return;
      }
      break;
    case 'challenge':
      const size = appData.settings.challengeSize || 20;
      currentQueue = shuffle(getFilteredWords(appData)).slice(0, size);
      break;
    case 'wrong':
      currentQueue = appData.wrongBook
        .filter((w) => !w.resolved)
        .map((w) => ({ ...VOCABULARY[w.id], id: w.id }));
      if (currentQueue.length === 0) {
        showToast('错题本为空，继续保持！');
        return;
      }
      break;
  }

  if (currentQueue.length === 0) {
    showToast('没有可练习的词语，请检查单元选择');
    return;
  }

  sessionSeconds = 0;
  startTimer();
  navigate('game');
  renderGameUI();
  showWord();
}

function renderGameUI() {
  const modeNames = { learn: '📖 学习模式', review: '🔄 记忆复习', challenge: '⚔️ 终极考验', wrong: '📝 错题攻克' };
  $('#game-mode-title').textContent = modeNames[currentMode];
  $('#session-correct').textContent = '0';
  $('#session-wrong').textContent = '0';
  $('#btn-show-answer').style.display = currentMode === 'challenge' ? 'none' : 'inline-flex';
}

function showWord() {
  showingAnswer = false;
  const word = currentQueue[currentIndex];
  const ws = appData.words[word.id];

  $('#game-pinyin').textContent = word.pinyin;
  $('#game-unit').textContent = UNIT_NAMES[word.unit] || `第${word.unit}单元`;
  $('#answer-input').value = '';
  $('#answer-input').disabled = false;
  $('#answer-input').focus();
  $('#answer-feedback').className = 'answer-feedback hidden';
  $('#answer-feedback').textContent = '';
  $('#correct-answer-display').classList.add('hidden');
  $('#btn-check').style.display = 'inline-flex';
  $('#btn-next').style.display = 'none';
  $('#btn-hint').style.display = 'inline-flex';

  const strength = getMemoryStrength(ws);
  $('#memory-bar').style.width = strength + '%';
  $('#memory-text').textContent = `记忆强度 ${strength}%`;

  $('#game-progress').textContent = `${currentIndex + 1} / ${currentQueue.length}`;

  if (currentMode === 'review') {
    $('#review-info').textContent = getNextReviewText(ws);
    $('#review-info').style.display = 'block';
  } else {
    $('#review-info').style.display = 'none';
  }
}

function checkAnswer() {
  const word = currentQueue[currentIndex];
  const input = $('#answer-input').value.trim();
  if (!input) {
    showToast('请先输入答案哦');
    return;
  }

  const isCorrect = normalize(input) === normalize(word.word);
  const feedback = $('#answer-feedback');
  feedback.classList.remove('hidden', 'correct', 'wrong');

  if (isCorrect) {
    feedback.classList.add('correct');
    feedback.innerHTML = '🎉 太棒了，答对了！';
    sessionCorrect++;
    $('#session-correct').textContent = sessionCorrect;
    playSound('correct');

    if (currentMode === 'review') {
      updateSRS(appData.words[word.id], 4);
    } else if (currentMode === 'wrong') {
      updateSRS(appData.words[word.id], 3);
      const wb = appData.wrongBook.find((w) => w.id === word.id);
      if (wb) wb.resolved = true;
    } else {
      updateSRS(appData.words[word.id], 3);
    }
    recordAnswer(appData, word.id, true, currentMode);
  } else {
    feedback.classList.add('wrong');
    feedback.innerHTML = `❌ 答错了，正确答案是：<strong>${word.word}</strong>`;
    sessionWrong++;
    $('#session-wrong').textContent = sessionWrong;
    playSound('wrong');

    updateSRS(appData.words[word.id], 0);
    recordAnswer(appData, word.id, false, currentMode);

    $('#correct-answer-display').textContent = word.word;
    $('#correct-answer-display').classList.remove('hidden');
  }

  saveData(appData);
  $('#answer-input').disabled = true;
  $('#btn-check').style.display = 'none';
  $('#btn-next').style.display = 'inline-flex';
  $('#btn-hint').style.display = 'none';
  showingAnswer = true;
}

function showAnswer() {
  const word = currentQueue[currentIndex];
  $('#correct-answer-display').textContent = word.word;
  $('#correct-answer-display').classList.remove('hidden');
  const feedback = $('#answer-feedback');
  feedback.classList.remove('hidden', 'correct', 'wrong');
  feedback.classList.add('wrong');
  feedback.innerHTML = `正确答案是：<strong>${word.word}</strong>`;
  $('#answer-input').disabled = true;
  $('#btn-check').style.display = 'none';
  $('#btn-next').style.display = 'inline-flex';
  showingAnswer = true;

  updateSRS(appData.words[word.id], 1);
  recordAnswer(appData, word.id, false, currentMode);
  saveData(appData);
}

function showHint() {
  const word = currentQueue[currentIndex];
  showToast(`提示：${word.hint}`);
}

function nextWord() {
  currentIndex++;
  if (currentIndex >= currentQueue.length) {
    endGameSession();
    return;
  }
  showWord();
}

function endGameSession() {
  stopTimer();
  endSession(appData);

  const total = sessionCorrect + sessionWrong;
  const accuracy = total ? Math.round((sessionCorrect / total) * 100) : 0;

  $('#result-correct').textContent = sessionCorrect;
  $('#result-wrong').textContent = sessionWrong;
  $('#result-accuracy').textContent = accuracy + '%';
  $('#result-time').textContent = formatTime(sessionSeconds);

  let stars = 1;
  if (accuracy >= 60) stars = 2;
  if (accuracy >= 80) stars = 3;
  if (accuracy >= 95) stars = 4;
  if (accuracy === 100) stars = 5;

  $('#result-stars').textContent = '⭐'.repeat(stars);

  let message = '';
  if (accuracy === 100) message = '完美！全部正确，你真棒！';
  else if (accuracy >= 80) message = '非常出色！继续加油！';
  else if (accuracy >= 60) message = '不错哦，再多练习几次！';
  else message = '别灰心，多复习错题本就会进步！';

  $('#result-message').textContent = message;
  navigate('result');
}

function exitSession() {
  if (confirm('确定要退出当前练习吗？')) {
    stopTimer();
    endSession(appData);
    navigate('home');
  }
}

function renderStats() {
  const filtered = getFilteredWords(appData);
  const total = filtered.length;
  const mastered = filtered.filter((w) => appData.words[w.id].mastered).length;
  const totalAnswers = appData.stats.totalCorrect + appData.stats.totalWrong;
  const accuracy = totalAnswers ? Math.round((appData.stats.totalCorrect / totalAnswers) * 100) : 0;

  $('#stats-total-words').textContent = total;
  $('#stats-mastered').textContent = mastered;
  $('#stats-total-time').textContent = formatTime(appData.stats.totalStudyTime);
  $('#stats-sessions').textContent = appData.stats.totalSessions;
  $('#stats-accuracy').textContent = accuracy + '%';
  $('#stats-correct').textContent = appData.stats.totalCorrect;
  $('#stats-wrong').textContent = appData.stats.totalWrong;

  renderUnitStats();
  renderDailyChart();
  renderCurveChart(getForgettingCurveData(appData));
}

function renderUnitStats() {
  const container = $('#unit-stats');
  const units = [...new Set(VOCABULARY.map((v) => v.unit))];
  container.innerHTML = units
    .map((unit) => {
      const unitWords = VOCABULARY.filter((v) => v.unit === unit);
      const studied = unitWords.filter((v) => {
        const ws = appData.words[VOCABULARY.indexOf(v)];
        return ws.correctCount > 0 || ws.wrongCount > 0;
      }).length;
      const mastered = unitWords.filter((v) => appData.words[VOCABULARY.indexOf(v)].mastered).length;
      const pct = unitWords.length ? Math.round((mastered / unitWords.length) * 100) : 0;
      return `
      <div class="unit-stat-card">
        <div class="unit-stat-header">
          <span>第${unit}单元</span>
          <span>${mastered}/${unitWords.length}</span>
        </div>
        <div class="unit-stat-bar"><div class="unit-stat-fill" style="width:${pct}%"></div></div>
        <div class="unit-stat-detail">已学 ${studied} 个 · 掌握 ${pct}%</div>
      </div>`;
    })
    .join('');
}

function renderDailyChart() {
  const records = appData.stats.dailyRecords;
  const days = Object.keys(records).sort().slice(-7);
  const container = $('#daily-chart');
  if (days.length === 0) {
    container.innerHTML = '<p class="empty-hint">暂无学习记录，开始练习吧！</p>';
    return;
  }
  const maxTime = Math.max(...days.map((d) => records[d].time), 1);
  container.innerHTML = days
    .map((day) => {
      const r = records[day];
      const h = Math.round((r.time / maxTime) * 100);
      const label = day.slice(5);
      return `
      <div class="daily-bar-item">
        <div class="daily-bar" style="height:${Math.max(4, h)}%">
          <span class="daily-time">${formatTimeShort(r.time)}</span>
        </div>
        <span class="daily-label">${label}</span>
        <span class="daily-detail">✓${r.correct} ✗${r.wrong}</span>
      </div>`;
    })
    .join('');
}

function renderWrongBook() {
  const container = $('#wrongbook-list');
  const items = appData.wrongBook.filter((w) => !w.resolved);

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎊</div>
        <p>错题本空空如也，你真厉害！</p>
      </div>`;
    return;
  }

  items.sort((a, b) => b.count - a.count || b.lastWrong - a.lastWrong);
  container.innerHTML = items
    .map((item) => {
      const vocab = VOCABULARY[item.id];
      const ws = appData.words[item.id];
      return `
      <div class="wrong-item">
        <div class="wrong-pinyin">${vocab.pinyin}</div>
        <div class="wrong-word">${vocab.word}</div>
        <div class="wrong-meta">
          <span>错误 ${item.count} 次</span>
          <span>记忆 ${getMemoryStrength(ws)}%</span>
        </div>
        <div class="wrong-unit">${UNIT_NAMES[vocab.unit]}</div>
      </div>`;
    })
    .join('');
}

function renderSettings() {
  $$('.unit-checkbox').forEach((cb) => {
    cb.checked = appData.settings.selectedUnits.includes(parseInt(cb.value));
  });
  $('#challenge-size').value = appData.settings.challengeSize || 20;
}

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    sessionSeconds++;
    $('#session-timer').textContent = formatTime(sessionSeconds);
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function normalize(str) {
  return str.replace(/\s+/g, '').toLowerCase();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}时${m}分${s}秒`;
  if (m > 0) return `${m}分${s}秒`;
  return `${s}秒`;
}

function formatTimeShort(seconds) {
  if (seconds < 60) return `${seconds}秒`;
  return `${Math.floor(seconds / 60)}分`;
}

function showToast(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'correct') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    /* audio not available */
  }
}

function renderHome() {
  updateDashboard();
}

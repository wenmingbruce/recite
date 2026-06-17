// 基于艾宾浩斯遗忘曲线的间隔重复算法 (SM-2 简化版)
const SRS_INTERVALS = [1, 2, 4, 7, 15, 30, 60]; // 天数

function updateSRS(wordState, quality) {
  // quality: 0=完全不会, 1=困难, 2=一般, 3=良好, 4=简单, 5=完美
  if (quality < 3) {
    wordState.repetitions = 0;
    wordState.interval = 0;
    wordState.nextReview = Date.now() + 10 * 60 * 1000; // 10分钟后复习
    wordState.mastered = false;
  } else {
    if (wordState.repetitions < SRS_INTERVALS.length) {
      wordState.interval = SRS_INTERVALS[wordState.repetitions];
    } else {
      wordState.interval = Math.round(wordState.interval * wordState.easeFactor);
    }
    wordState.repetitions++;
    wordState.easeFactor = Math.max(
      1.3,
      wordState.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
    wordState.nextReview = Date.now() + wordState.interval * 24 * 60 * 60 * 1000;
    if (wordState.repetitions >= 4) wordState.mastered = true;
  }
  return wordState;
}

function getDueWords(data) {
  const now = Date.now();
  const filtered = getFilteredWords(data);
  return filtered
    .filter((w) => {
      const ws = data.words[w.id];
      return ws.nextReview <= now && !ws.mastered;
    })
    .sort((a, b) => data.words[a.id].nextReview - data.words[b.id].nextReview);
}

function getNewWords(data, limit = 10) {
  const filtered = getFilteredWords(data);
  return filtered
    .filter((w) => data.words[w.id].repetitions === 0 && data.words[w.id].correctCount === 0)
    .slice(0, limit);
}

function getReviewQueue(data) {
  const due = getDueWords(data);
  const wrong = data.wrongBook
    .filter((w) => !w.resolved)
    .map((w) => VOCABULARY[w.id])
    .filter(Boolean)
    .map((v, _, arr) => {
      const idx = VOCABULARY.indexOf(v);
      return { ...v, id: idx, priority: 'wrong' };
    });

  const dueMapped = due.map((w) => ({ ...w, priority: 'due' }));

  const seen = new Set();
  const queue = [];
  [...wrong, ...dueMapped].forEach((w) => {
    if (!seen.has(w.id)) {
      seen.add(w.id);
      queue.push(w);
    }
  });
  return queue;
}

function getMemoryStrength(wordState) {
  if (wordState.repetitions === 0) return 0;
  const maxRep = 6;
  return Math.min(100, Math.round((wordState.repetitions / maxRep) * 100));
}

function getNextReviewText(wordState) {
  const now = Date.now();
  const diff = wordState.nextReview - now;
  if (diff <= 0) return '现在复习';
  const hours = Math.round(diff / (60 * 60 * 1000));
  if (hours < 24) return `${hours}小时后`;
  const days = Math.round(hours / 24);
  return `${days}天后`;
}

function getForgettingCurveData(data) {
  const filtered = getFilteredWords(data);
  const buckets = { new: 0, learning: 0, reviewing: 0, mastered: 0 };
  filtered.forEach((w) => {
    const ws = data.words[w.id];
    if (ws.repetitions === 0 && ws.correctCount === 0) buckets.new++;
    else if (ws.mastered) buckets.mastered++;
    else if (ws.repetitions < 3) buckets.learning++;
    else buckets.reviewing++;
  });
  return buckets;
}

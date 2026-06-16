const STORAGE_KEY = 'pinyin_game_data_v1';

function getDefaultWordState(id) {
  return {
    id,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now(),
    correctCount: 0,
    wrongCount: 0,
    lastReview: null,
    mastered: false,
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (!data.settings.inputMode) data.settings.inputMode = 'choice';
      return data;
    }
  } catch (e) {
    console.warn('Failed to load data', e);
  }
  return createDefaultData();
}

function createDefaultData() {
  const words = {};
  VOCABULARY.forEach((item, idx) => {
    words[idx] = getDefaultWordState(idx);
  });
  return {
    words,
    wrongBook: [],
    stats: {
      totalStudyTime: 0,
      totalSessions: 0,
      totalCorrect: 0,
      totalWrong: 0,
      dailyRecords: {},
      unitProgress: {},
    },
    settings: {
      selectedUnits: [1, 2, 3, 4, 5, 6, 7, 8],
      challengeSize: 20,
      inputMode: 'choice', // choice | tiles | type
    },
    sessionStart: null,
  };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function startSession(data) {
  data.sessionStart = Date.now();
}

function endSession(data) {
  if (data.sessionStart) {
    const elapsed = Math.round((Date.now() - data.sessionStart) / 1000);
    data.stats.totalStudyTime += elapsed;
    data.stats.totalSessions += 1;
    const today = getTodayKey();
    if (!data.stats.dailyRecords[today]) {
      data.stats.dailyRecords[today] = { time: 0, correct: 0, wrong: 0, words: 0 };
    }
    data.stats.dailyRecords[today].time += elapsed;
    data.sessionStart = null;
    saveData(data);
  }
}

function recordAnswer(data, wordId, isCorrect, mode) {
  const ws = data.words[wordId];
  const today = getTodayKey();
  if (!data.stats.dailyRecords[today]) {
    data.stats.dailyRecords[today] = { time: 0, correct: 0, wrong: 0, words: 0 };
  }
  const daily = data.stats.dailyRecords[today];

  if (isCorrect) {
    ws.correctCount++;
    data.stats.totalCorrect++;
    daily.correct++;
  } else {
    ws.wrongCount++;
    data.stats.totalWrong++;
    daily.wrong++;
    addToWrongBook(data, wordId);
  }

  daily.words++;
  ws.lastReview = Date.now();

  const unit = VOCABULARY[wordId].unit;
  if (!data.stats.unitProgress[unit]) {
    data.stats.unitProgress[unit] = { correct: 0, wrong: 0, studied: 0 };
  }
  data.stats.unitProgress[unit].studied++;
  if (isCorrect) data.stats.unitProgress[unit].correct++;
  else data.stats.unitProgress[unit].wrong++;

  saveData(data);
}

function addToWrongBook(data, wordId) {
  const existing = data.wrongBook.find((w) => w.id === wordId);
  if (existing) {
    existing.count++;
    existing.lastWrong = Date.now();
  } else {
    data.wrongBook.push({ id: wordId, count: 1, lastWrong: Date.now(), resolved: false });
  }
}

function removeFromWrongBook(data, wordId) {
  data.wrongBook = data.wrongBook.filter((w) => w.id !== wordId);
  saveData(data);
}

function getFilteredWords(data) {
  const units = new Set(data.settings.selectedUnits);
  return VOCABULARY.map((v, idx) => ({ ...v, id: idx }))
    .filter((v) => units.has(v.unit));
}

function resetAllData() {
  localStorage.removeItem(STORAGE_KEY);
}

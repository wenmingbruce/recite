import type { Word } from '../data/wordbooks';

export interface WordProgress {
  wordId: string;
  // SM-2 algorithm fields
  easinessFactor: number;
  interval: number;       // days until next review
  repetitions: number;    // number of successful reviews in a row
  nextReview: number;     // timestamp (ms)
  lastReview: number;     // timestamp (ms)
  isLearned: boolean;
  wrongCount: number;
  correctCount: number;
}

export interface WrongEntry {
  wordId: string;
  wrongAt: number;
  wrongAnswer: string;
  correctAnswer: string;
  resolvedAt?: number;
}

export interface DailyStats {
  date: string;           // YYYY-MM-DD
  studyMinutes: number;
  wordsLearned: number;
  wordsReviewed: number;
  sessionsCount: number;
}

export interface StudySession {
  startTime: number;
  endTime?: number;
}

const KEYS = {
  progress: 'pep5_word_progress',
  wrong: 'pep5_wrong_entries',
  dailyStats: 'pep5_daily_stats',
  activeSession: 'pep5_active_session',
};

function load<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- Word Progress ----------

export function getAllProgress(): Record<string, WordProgress> {
  return load<Record<string, WordProgress>>(KEYS.progress, {});
}

export function getWordProgress(wordId: string): WordProgress {
  const all = getAllProgress();
  if (all[wordId]) return all[wordId];
  return {
    wordId,
    easinessFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: Date.now(),
    lastReview: 0,
    isLearned: false,
    wrongCount: 0,
    correctCount: 0,
  };
}

/**
 * SM-2 spaced repetition update.
 * quality: 0-5 (0-2 = fail, 3-5 = pass)
 */
export function updateWordProgress(wordId: string, quality: number): WordProgress {
  const p = getWordProgress(wordId);
  const now = Date.now();

  let { easinessFactor, interval, repetitions } = p;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easinessFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easinessFactor = Math.max(
    1.3,
    easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextReview = now + interval * 24 * 60 * 60 * 1000;
  const isLearned = repetitions >= 3;

  const updated: WordProgress = {
    ...p,
    easinessFactor,
    interval,
    repetitions,
    nextReview,
    lastReview: now,
    isLearned,
    wrongCount: quality < 3 ? p.wrongCount + 1 : p.wrongCount,
    correctCount: quality >= 3 ? p.correctCount + 1 : p.correctCount,
  };

  const all = getAllProgress();
  all[wordId] = updated;
  save(KEYS.progress, all);
  return updated;
}

export function getDueWords(words: Word[]): Word[] {
  const now = Date.now();
  const all = getAllProgress();
  return words.filter(w => {
    const p = all[w.id];
    if (!p) return true;
    return p.nextReview <= now;
  });
}

export function getLearnedWords(words: Word[]): Word[] {
  const all = getAllProgress();
  return words.filter(w => all[w.id]?.isLearned);
}

// ---------- Wrong Entries ----------

export function getWrongEntries(): WrongEntry[] {
  return load<WrongEntry[]>(KEYS.wrong, []);
}

export function addWrongEntry(
  wordId: string,
  wrongAnswer: string,
  correctAnswer: string
): void {
  const entries = getWrongEntries();
  entries.unshift({ wordId, wrongAt: Date.now(), wrongAnswer, correctAnswer });
  save(KEYS.wrong, entries.slice(0, 500));
}

export function resolveWrongEntry(wordId: string): void {
  const entries = getWrongEntries();
  const updated = entries.map(e =>
    e.wordId === wordId && !e.resolvedAt ? { ...e, resolvedAt: Date.now() } : e
  );
  save(KEYS.wrong, updated);
}

export function getUnresolvedWrong(): WrongEntry[] {
  return getWrongEntries().filter(e => !e.resolvedAt);
}

// ---------- Daily Stats ----------

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getAllDailyStats(): DailyStats[] {
  return load<DailyStats[]>(KEYS.dailyStats, []);
}

export function getTodayStats(): DailyStats {
  const all = getAllDailyStats();
  const today = getTodayKey();
  return all.find(s => s.date === today) ?? {
    date: today,
    studyMinutes: 0,
    wordsLearned: 0,
    wordsReviewed: 0,
    sessionsCount: 0,
  };
}

export function updateDailyStats(delta: Partial<Omit<DailyStats, 'date'>>): void {
  const all = getAllDailyStats();
  const today = getTodayKey();
  const idx = all.findIndex(s => s.date === today);
  const current = idx >= 0 ? all[idx] : {
    date: today, studyMinutes: 0, wordsLearned: 0, wordsReviewed: 0, sessionsCount: 0,
  };
  const updated = {
    ...current,
    studyMinutes: current.studyMinutes + (delta.studyMinutes ?? 0),
    wordsLearned: current.wordsLearned + (delta.wordsLearned ?? 0),
    wordsReviewed: current.wordsReviewed + (delta.wordsReviewed ?? 0),
    sessionsCount: current.sessionsCount + (delta.sessionsCount ?? 0),
  };
  if (idx >= 0) all[idx] = updated;
  else all.push(updated);
  save(KEYS.dailyStats, all.slice(-60));
}

// ---------- Session Tracking ----------

export function startSession(): void {
  save(KEYS.activeSession, { startTime: Date.now() });
  updateDailyStats({ sessionsCount: 1 });
}

export function endSession(): void {
  const session = load<StudySession | null>(KEYS.activeSession, null);
  if (!session) return;
  const minutes = Math.round((Date.now() - session.startTime) / 60000);
  updateDailyStats({ studyMinutes: Math.max(1, minutes) });
  localStorage.removeItem(KEYS.activeSession);
}

import { useState } from 'react';
import { BookOpen, BarChart2, AlertCircle, List, Zap, Brain, Sparkles } from 'lucide-react';
import { getDueWords, getLearnedWords, getTodayStats } from '../utils/storage';
import { getPet, getPetStage } from '../utils/pet';
import { PetDisplay } from './PetDisplay';
import { TitleBadge } from './TitleBadge';
import { WORD_BOOKS, type Word } from '../data/wordbooks';
import type { GameConfig, GameMode, GameFilter } from '../App';
import { WHACK_SPEEDS } from '../App';

interface Props {
  activeWords: Word[];
  selectedGrade: number;
  selectedSemester: 1 | 2;
  onChangeBook: (grade: number, semester: 1 | 2) => void;
  whackDuration: number;
  onChangeWhackDuration: (ms: number) => void;
  onStartGame: (config: GameConfig) => void;
  onShowWrong: () => void;
  onShowStats: () => void;
  onShowWordList: () => void;
  onShowStickers: () => void;
  onShowPet: () => void;
}

const MODES: { id: GameMode; label: string; icon: string; desc: string }[] = [
  { id: 'choice', label: '选择题', icon: '🎯', desc: '四选一' },
  { id: 'spell',  label: '拼写',   icon: '✏️', desc: '键盘输入' },
  { id: 'match',  label: '配对',   icon: '🔗', desc: '连线匹配' },
  { id: 'whack',  label: '打地鼠', icon: '🔨', desc: '快准狠！' },
];

const GRADE_LABELS = ['一', '二', '三', '四'];

export function Home({
  activeWords,
  selectedGrade, selectedSemester, onChangeBook,
  whackDuration, onChangeWhackDuration,
  onStartGame, onShowWrong, onShowStats, onShowWordList, onShowStickers, onShowPet,
}: Props) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('choice');
  const [selectedFilter, setSelectedFilter] = useState<GameFilter>('due');
  const [selectedUnit, setSelectedUnit] = useState<string>('');

  const todayStats = getTodayStats();
  const dueWords = getDueWords(activeWords);
  const learnedWords = getLearnedWords(activeWords);
  const dueCount = dueWords.length;
  const pet = getPet();
  const petStage = getPetStage(pet.level);
  const progressPct = activeWords.length > 0
    ? Math.round((learnedWords.length / activeWords.length) * 100)
    : 0;

  // Units for current active book
  const units = [...new Set(activeWords.map(w => w.unit))];

  const handleStart = () => {
    const unitKey = selectedFilter === 'unit' && selectedUnit
      ? selectedUnit
      : selectedFilter === 'unit' && units.length > 0
        ? units[0]
        : undefined;
    onStartGame({ mode: selectedMode, filter: selectedFilter, unitKey });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-5xl mb-1">🌟</div>
        <h1 className="text-3xl font-bold text-purple-700 mb-0.5">单词星球</h1>
        <p className="text-gray-400 text-sm">人教版小学英语</p>
      </div>

      {/* ── Pet preview ── */}
      <button
        onClick={onShowPet}
        className="w-full bg-gradient-to-r from-amber-50 to-yellow-50 border border-yellow-200 rounded-2xl p-3 shadow-sm mb-4 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
      >
        <div className="shrink-0">
          <PetDisplay level={pet.level} size={48} />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 text-sm">{pet.name}</span>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-semibold">{petStage.name}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-lg">💛</span>
            <span className="text-sm font-bold text-yellow-600">{pet.coins} 金块</span>
            <span className="text-xs text-gray-400 ml-1">答题赚金块 → 喂给宠物成长</span>
          </div>
        </div>
        <span className="text-gray-400 text-sm">›</span>
      </button>

      {/* ── Word Book Selector ── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-700">📚 当前单词书</span>
          <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">
            {activeWords.length} 个单词
          </span>
        </div>
        {/* Grade rows */}
        <div className="space-y-2">
          {[1, 2, 3, 4].map(grade => (
            <div key={grade} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-14 shrink-0">{GRADE_LABELS[grade - 1]}年级</span>
              {([1, 2] as const).map(sem => {
                const book = WORD_BOOKS.find(b => b.grade === grade && b.semester === sem);
                const isActive = selectedGrade === grade && selectedSemester === sem;
                return (
                  <button
                    key={sem}
                    onClick={() => { onChangeBook(grade, sem); setSelectedUnit(''); }}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700'
                    }`}
                  >
                    {sem === 1 ? '上册' : '下册'}
                    {book && (
                      <span className={`ml-1 ${isActive ? 'opacity-70' : 'text-gray-400'}`}>
                        ({book.words.length})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Title Badge */}
      <div className="mb-4">
        <TitleBadge />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">{learnedWords.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">已掌握</div>
          <div className="text-xs text-gray-400">/ {activeWords.length}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-orange-500">{dueCount}</div>
          <div className="text-xs text-gray-500 mt-0.5">待复习</div>
          <div className="text-xs text-gray-400">今天</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-green-600">{todayStats.studyMinutes}</div>
          <div className="text-xs text-gray-500 mt-0.5">分钟</div>
          <div className="text-xs text-gray-400">今日学习</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-600 font-medium">本册进度</span>
          <span className="text-purple-600 font-bold">{progressPct}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Game config */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <h2 className="font-bold text-gray-700 mb-3">开始学习</h2>

        {/* Mode 2×2 */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">游戏模式</p>
          <div className="grid grid-cols-2 gap-2">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                className={`p-3 rounded-xl border-2 text-center transition-all relative overflow-hidden ${
                  selectedMode === m.id
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-100 hover:border-purple-200'
                }`}
              >
                {m.id === 'whack' && (
                  <span className="absolute top-1 right-1 text-xs bg-red-400 text-white px-1 rounded font-bold">
                    NEW
                  </span>
                )}
                <div className="text-xl">{m.icon}</div>
                <div className="text-xs font-semibold text-gray-700">{m.label}</div>
                <div className="text-xs text-gray-400">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">单词范围</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'due' as GameFilter,   label: '今日复习', icon: <Zap size={15}/>,        count: dueCount },
              { id: 'unit' as GameFilter,  label: '按单元',   icon: <BookOpen size={15}/>,   count: null },
              { id: 'wrong' as GameFilter, label: '错题本',   icon: <AlertCircle size={15}/>, count: null },
            ]).map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  selectedFilter === f.id
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-gray-100 hover:border-orange-200'
                }`}
              >
                <div className={`flex justify-center mb-1 ${selectedFilter === f.id ? 'text-orange-500' : 'text-gray-400'}`}>
                  {f.icon}
                </div>
                <div className="text-xs font-semibold text-gray-700">{f.label}</div>
                {f.count !== null && (
                  <div className="text-xs text-orange-400 font-bold">{f.count} 个</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Whack speed picker — only shown for whack mode */}
        {selectedMode === 'whack' && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">🔨 地鼠出现时长</p>
            <div className="flex gap-1.5 flex-wrap">
              {WHACK_SPEEDS.map(s => (
                <button
                  key={s.ms}
                  onClick={() => onChangeWhackDuration(s.ms)}
                  className={`flex-1 min-w-0 py-2 px-1 rounded-xl text-xs font-semibold transition-all ${
                    whackDuration === s.ms
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700'
                  }`}
                >
                  <div>{s.label}</div>
                  <div className={`text-xs mt-0.5 ${whackDuration === s.ms ? 'opacity-70' : 'text-gray-400'}`}>
                    {s.ms / 1000}秒
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Unit picker */}
        {selectedFilter === 'unit' && units.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">选择单元</p>
            <div className="flex flex-wrap gap-2">
              {units.map(u => (
                <button
                  key={u}
                  onClick={() => setSelectedUnit(u)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    (selectedUnit || units[0]) === u
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={activeWords.length === 0}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
        >
          🚀 开始学习
        </button>
      </div>

      {/* Bottom nav */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: '错题本', icon: <AlertCircle size={20} className="text-red-400"/>,     onClick: onShowWrong,    hover: 'hover:bg-red-50' },
          { label: '统计',   icon: <BarChart2  size={20} className="text-blue-400"/>,     onClick: onShowStats,    hover: 'hover:bg-blue-50' },
          { label: '单词表', icon: <List       size={20} className="text-green-400"/>,    onClick: onShowWordList, hover: 'hover:bg-green-50' },
          { label: '贴画册', icon: <Sparkles   size={20} className="text-purple-400"/>,   onClick: onShowStickers, hover: 'hover:bg-purple-50' },
          // pet handled separately above
        ].map(item => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`bg-white rounded-2xl py-3 px-1 shadow-sm flex flex-col items-center gap-1 ${item.hover} transition-colors`}
          >
            {item.icon}
            <span className="text-xs font-semibold text-gray-600">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Memory curve tip */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4">
        <div className="flex items-start gap-2">
          <Brain size={18} className="text-purple-500 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-purple-700">艾宾浩斯记忆曲线 </span>
            根据答题情况智能安排复习时间，答对越多、间隔越长，帮你高效记住单词！
          </p>
        </div>
      </div>
    </div>
  );
}

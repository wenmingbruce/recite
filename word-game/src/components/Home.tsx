import { useState } from 'react';
import { BookOpen, BarChart2, AlertCircle, List, Zap, Brain } from 'lucide-react';
import { WORDS } from '../data/words';
import { getDueWords, getLearnedWords, getTodayStats, getAllProgress } from '../utils/storage';
import { TitleBadge } from './TitleBadge';
import type { GameConfig, GameMode, GameFilter } from '../App';

interface Props {
  onStartGame: (config: GameConfig) => void;
  onShowWrong: () => void;
  onShowStats: () => void;
  onShowWordList: () => void;
}

const UNITS = [
  { key: '1-Unit 1', label: '上册 Unit 1 - 老师' },
  { key: '1-Unit 2', label: '上册 Unit 2 - 星期' },
  { key: '1-Unit 3', label: '上册 Unit 3 - 食物' },
  { key: '1-Unit 4', label: '上册 Unit 4 - 家务' },
  { key: '1-Unit 5', label: '上册 Unit 5 - 动物' },
  { key: '1-Unit 6', label: '上册 Unit 6 - 自然' },
  { key: '2-Unit 1', label: '下册 Unit 1 - 未来职业' },
  { key: '2-Unit 2', label: '下册 Unit 2 - 日常活动' },
  { key: '2-Unit 3', label: '下册 Unit 3 - 天气' },
  { key: '2-Unit 4', label: '下册 Unit 4 - 月份生日' },
  { key: '2-Unit 5', label: '下册 Unit 5 - 地点' },
  { key: '2-Unit 6', label: '下册 Unit 6 - 交通方向' },
];

const MODES: { id: GameMode; label: string; icon: string; desc: string }[] = [
  { id: 'choice', label: '选择题', icon: '🎯', desc: '四选一' },
  { id: 'spell',  label: '拼写',   icon: '✏️', desc: '键盘输入' },
  { id: 'match',  label: '配对',   icon: '🔗', desc: '连线匹配' },
  { id: 'whack',  label: '打地鼠', icon: '🔨', desc: '快准狠！' },
];

export function Home({ onStartGame, onShowWrong, onShowStats, onShowWordList }: Props) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('choice');
  const [selectedFilter, setSelectedFilter] = useState<GameFilter>('due');
  const [selectedUnit, setSelectedUnit] = useState<string>(UNITS[0].key);

  const todayStats = getTodayStats();
  const dueWords = getDueWords(WORDS);
  const learnedWords = getLearnedWords(WORDS);
  const allProgress = getAllProgress();
  const startedCount = Object.keys(allProgress).length;
  const dueCount = dueWords.length;
  const progressPct = Math.round((learnedWords.length / WORDS.length) * 100);

  const handleStart = () => {
    onStartGame({
      mode: selectedMode,
      filter: selectedFilter,
      unitKey: selectedFilter === 'unit' ? selectedUnit : undefined,
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="text-5xl mb-1">🌟</div>
        <h1 className="text-3xl font-bold text-purple-700 mb-0.5">单词星球</h1>
        <p className="text-gray-400 text-sm">人教版 · 小学5年级英语</p>
      </div>

      {/* Title Badge */}
      <div className="mb-5">
        <TitleBadge />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">{learnedWords.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">已掌握</div>
          <div className="text-xs text-gray-400">/ {WORDS.length} 个</div>
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
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 font-medium">总体进度</span>
          <span className="text-purple-600 font-bold">{progressPct}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1.5">
          已接触 {startedCount} 个 · 掌握 {learnedWords.length} 个 · 共 {WORDS.length} 个
        </div>
      </div>

      {/* Game Config */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
        <h2 className="font-bold text-gray-700 mb-3">开始学习</h2>

        {/* Mode selection – 2×2 grid */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">游戏模式</p>
          <div className="grid grid-cols-2 gap-2">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  selectedMode === m.id
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-100 hover:border-purple-200'
                } ${m.id === 'whack' ? 'relative overflow-hidden' : ''}`}
              >
                {m.id === 'whack' && (
                  <span className="absolute top-1 right-1 text-xs bg-red-400 text-white px-1 rounded font-bold">NEW</span>
                )}
                <div className="text-xl">{m.icon}</div>
                <div className="text-xs font-semibold text-gray-700">{m.label}</div>
                <div className="text-xs text-gray-400">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter selection */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">单词范围</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'due' as GameFilter,   label: '今日复习', icon: <Zap size={15}/>,      count: dueCount },
              { id: 'unit' as GameFilter,  label: '按单元',   icon: <BookOpen size={15}/>, count: null },
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

        {selectedFilter === 'unit' && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">选择单元</p>
            <select
              value={selectedUnit}
              onChange={e => setSelectedUnit(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-purple-400"
            >
              {UNITS.map(u => (
                <option key={u.key} value={u.key}>{u.label}</option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleStart}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          🚀 开始学习
        </button>
      </div>

      {/* Bottom nav */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <button
          onClick={onShowWrong}
          className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-1 hover:bg-red-50 transition-colors"
        >
          <AlertCircle size={22} className="text-red-400" />
          <span className="text-xs font-semibold text-gray-600">错题本</span>
        </button>
        <button
          onClick={onShowStats}
          className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-1 hover:bg-blue-50 transition-colors"
        >
          <BarChart2 size={22} className="text-blue-400" />
          <span className="text-xs font-semibold text-gray-600">学习统计</span>
        </button>
        <button
          onClick={onShowWordList}
          className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-1 hover:bg-green-50 transition-colors"
        >
          <List size={22} className="text-green-400" />
          <span className="text-xs font-semibold text-gray-600">单词表</span>
        </button>
      </div>

      {/* Memory curve tip */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4">
        <div className="flex items-start gap-2">
          <Brain size={18} className="text-purple-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-purple-700 mb-1">艾宾浩斯记忆曲线</p>
            <p className="text-xs text-gray-600">
              系统根据答题表现智能安排复习时间。答对越多，下次复习间隔越长，帮你高效记住单词！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

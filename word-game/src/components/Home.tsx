import { useState } from 'react';
import { BookOpen, BarChart2, AlertCircle, List, Star, Zap, Brain } from 'lucide-react';
import { WORDS } from '../data/words';
import { getDueWords, getLearnedWords, getTodayStats, getAllProgress } from '../utils/storage';
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

export function Home({ onStartGame, onShowWrong, onShowStats, onShowWordList }: Props) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('choice');
  const [selectedFilter, setSelectedFilter] = useState<GameFilter>('due');
  const [selectedUnit, setSelectedUnit] = useState<string>(UNITS[0].key);

  const todayStats = getTodayStats();
  const dueWords = getDueWords(WORDS);
  const learnedWords = getLearnedWords(WORDS);
  const allProgress = getAllProgress();
  const startedCount = Object.keys(allProgress).length;

  const handleStart = () => {
    onStartGame({
      mode: selectedMode,
      filter: selectedFilter,
      unitKey: selectedFilter === 'unit' ? selectedUnit : undefined,
    });
  };

  const dueCount = dueWords.length;
  const progressPct = Math.round((learnedWords.length / WORDS.length) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">🌟</div>
        <h1 className="text-3xl font-bold text-purple-700 mb-1">单词星球</h1>
        <p className="text-gray-500 text-sm">人教版 · 小学5年级英语</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">{learnedWords.length}</div>
          <div className="text-xs text-gray-500 mt-1">已掌握</div>
          <div className="text-xs text-gray-400">{WORDS.length}个单词</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-orange-500">{dueCount}</div>
          <div className="text-xs text-gray-500 mt-1">待复习</div>
          <div className="text-xs text-gray-400">今天</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-green-600">{todayStats.studyMinutes}</div>
          <div className="text-xs text-gray-500 mt-1">分钟</div>
          <div className="text-xs text-gray-400">今日学习</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
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
        <div className="text-xs text-gray-400 mt-1">
          已接触 {startedCount} 个，掌握 {learnedWords.length} 个，共 {WORDS.length} 个
        </div>
      </div>

      {/* Game Config */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
        <h2 className="font-bold text-gray-700 mb-3">开始学习</h2>

        {/* Mode Selection */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">游戏模式</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'choice', label: '选择题', icon: '🎯', desc: '四选一' },
              { id: 'spell', label: '拼写', icon: '✏️', desc: '键盘输入' },
              { id: 'match', label: '配对', icon: '🔗', desc: '连线匹配' },
            ] as const).map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  selectedMode === m.id
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-100 hover:border-purple-200'
                }`}
              >
                <div className="text-xl">{m.icon}</div>
                <div className="text-xs font-semibold text-gray-700">{m.label}</div>
                <div className="text-xs text-gray-400">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Selection */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">单词范围</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'due', label: '今日复习', icon: <Zap size={16} />, count: dueCount },
              { id: 'unit', label: '按单元', icon: <BookOpen size={16} />, count: null },
              { id: 'wrong', label: '错题本', icon: <AlertCircle size={16} />, count: null },
            ] as const).map(f => (
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

        {/* Unit Selector */}
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

      {/* Bottom Nav */}
      <div className="grid grid-cols-3 gap-3">
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

      {/* Memory Curve Tips */}
      <div className="mt-5 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4">
        <div className="flex items-start gap-2">
          <Brain size={18} className="text-purple-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-purple-700 mb-1">艾宾浩斯记忆曲线</p>
            <p className="text-xs text-gray-600">系统会根据你的答题情况，智能安排每个单词的复习时间。答对越多，下次复习间隔越长！</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className={i < Math.ceil(progressPct / 20) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
        ))}
      </div>
    </div>
  );
}

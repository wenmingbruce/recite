import { ArrowLeft, Clock, BookOpen, TrendingUp, Flame, Calendar } from 'lucide-react';
import { getAllDailyStats, getAllProgress } from '../utils/storage';
import { ALL_WORDS, type Word } from '../data/wordbooks';

interface Props {
  onBack: () => void;
  activeWords?: Word[];
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

function getDayLabel(dateStr: string): string {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const d = new Date(dateStr + 'T00:00:00');
  return `周${days[d.getDay()]}`;
}

export function Statistics({ onBack, activeWords }: Props) {
  const WORDS = activeWords && activeWords.length > 0 ? activeWords : ALL_WORDS;
  const allStats = getAllDailyStats();
  const allProgress = getAllProgress();
  const last7 = getLast7Days();

  const statsMap = Object.fromEntries(allStats.map(s => [s.date, s]));

  const totalMinutes = allStats.reduce((s, d) => s + d.studyMinutes, 0);
  const totalReviewed = allStats.reduce((s, d) => s + d.wordsReviewed, 0);
  const learnedCount = Object.values(allProgress).filter(p => p.isLearned).length;

  // Streak calculation
  let streak = 0;
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (statsMap[key]?.wordsReviewed > 0) streak++;
    else if (i < 6) break;
  }

  // Chart data for last 7 days
  const chartData = last7.map(date => ({
    date,
    label: getDayLabel(date),
    minutes: statsMap[date]?.studyMinutes ?? 0,
    words: statsMap[date]?.wordsReviewed ?? 0,
  }));

  const maxMinutes = Math.max(...chartData.map(d => d.minutes), 1);
  const maxWords = Math.max(...chartData.map(d => d.words), 1);

  // Unit progress — derive from active word list
  const units = [...new Set(WORDS.map(w => w.unit))];
  const unitStats = units.map(unit => {
    const unitWords = WORDS.filter(w => w.unit === unit);
    const learnedInUnit = unitWords.filter(w => allProgress[w.id]?.isLearned).length;
    return { label: unit, total: unitWords.length, learned: learnedInUnit };
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/60">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">学习统计</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 text-white">
          <Clock size={20} className="opacity-80 mb-2" />
          <div className="text-3xl font-bold">{totalMinutes}</div>
          <div className="text-sm opacity-80">总学习分钟</div>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-4 text-white">
          <BookOpen size={20} className="opacity-80 mb-2" />
          <div className="text-3xl font-bold">{learnedCount}</div>
          <div className="text-sm opacity-80">已掌握单词</div>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-4 text-white">
          <Flame size={20} className="opacity-80 mb-2" />
          <div className="text-3xl font-bold">{streak}</div>
          <div className="text-sm opacity-80">连续学习天数</div>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-4 text-white">
          <TrendingUp size={20} className="opacity-80 mb-2" />
          <div className="text-3xl font-bold">{totalReviewed}</div>
          <div className="text-sm opacity-80">累计复习次数</div>
        </div>
      </div>

      {/* 7-Day Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Calendar size={16} />
          近7天学习时长（分钟）
        </h2>
        <div className="flex items-end gap-2 h-28">
          {chartData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs text-gray-400">{d.minutes > 0 ? d.minutes : ''}</div>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-blue-400 to-blue-300 transition-all duration-500 min-h-[4px]"
                style={{ height: `${(d.minutes / maxMinutes) * 88}px` }}
              />
              <div className="text-xs text-gray-400">{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Words Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <h2 className="font-bold text-gray-700 mb-4">近7天复习单词数</h2>
        <div className="flex items-end gap-2 h-28">
          {chartData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs text-gray-400">{d.words > 0 ? d.words : ''}</div>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-purple-400 to-pink-300 transition-all duration-500 min-h-[4px]"
                style={{ height: `${(d.words / maxWords) * 88}px` }}
              />
              <div className="text-xs text-gray-400">{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Unit Progress */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <h2 className="font-bold text-gray-700 mb-3">各单元掌握情况</h2>
        <div className="space-y-2">
          {unitStats.map((unit, i) => {
            const pct = unit.total > 0 ? Math.round((unit.learned / unit.total) * 100) : 0;
            return (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{unit.label}</span>
                  <span className="text-gray-400">{unit.learned}/{unit.total}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 80 ? 'bg-green-400' : pct >= 40 ? 'bg-yellow-400' : 'bg-blue-300'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Memory Curve Info */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
        <h3 className="font-bold text-purple-700 mb-2 text-sm">记忆曲线复习计划</h3>
        <div className="space-y-1.5">
          {[
            { interval: '1天后', desc: '第一次复习' },
            { interval: '6天后', desc: '第二次复习' },
            { interval: '~2周后', desc: '第三次复习（已掌握）' },
            { interval: '逐渐延长', desc: '维持长期记忆' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-xs text-purple-700 font-medium">{item.interval}：</span>
              <span className="text-xs text-gray-600">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

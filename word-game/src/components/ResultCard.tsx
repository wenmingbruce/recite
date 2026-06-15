import { RotateCcw, Home } from 'lucide-react';

interface Props {
  score: number;
  total: number;
  onBack: () => void;
  onRetry: () => void;
}

const MESSAGES = [
  { min: 100, emoji: '🏆', title: '完美！', sub: '全部答对，太棒了！' },
  { min: 80,  emoji: '🌟', title: '太厉害了！', sub: '继续保持，你是最棒的！' },
  { min: 60,  emoji: '👏', title: '做得不错！', sub: '再多练习几次就能全对！' },
  { min: 0,   emoji: '💪', title: '加油！', sub: '失败是成功之母，坚持练习！' },
];

export function ResultCard({ score, total, onBack, onRetry }: Props) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const msg = MESSAGES.find(m => pct >= m.min) ?? MESSAGES[MESSAGES.length - 1];

  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center">
      <div className="text-7xl mb-4 animate-bounce-in">{msg.emoji}</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">{msg.title}</h2>
      <p className="text-gray-500 mb-6">{msg.sub}</p>

      {/* Stars */}
      <div className="flex gap-2 mb-6">
        {[...Array(3)].map((_, i) => (
          <span key={i} className={`text-4xl transition-all ${i < stars ? 'opacity-100' : 'opacity-20'}`}>
            ⭐
          </span>
        ))}
      </div>

      {/* Score */}
      <div className="bg-white rounded-3xl p-8 shadow-sm w-full max-w-sm text-center mb-8">
        <div className="text-5xl font-bold text-purple-600 mb-1">{pct}%</div>
        <div className="text-gray-500 text-sm mb-4">答对率</div>
        <div className="flex justify-around">
          <div>
            <div className="text-2xl font-bold text-green-500">{score}</div>
            <div className="text-xs text-gray-400">答对</div>
          </div>
          <div className="w-px bg-gray-100" />
          <div>
            <div className="text-2xl font-bold text-red-400">{total - score}</div>
            <div className="text-xs text-gray-400">答错</div>
          </div>
          <div className="w-px bg-gray-100" />
          <div>
            <div className="text-2xl font-bold text-blue-500">{total}</div>
            <div className="text-xs text-gray-400">总题数</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-sm">
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
        >
          <Home size={18} />
          首页
        </button>
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
        >
          <RotateCcw size={18} />
          再来一次
        </button>
      </div>
    </div>
  );
}

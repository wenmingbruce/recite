import { useState } from 'react';
import { ArrowLeft, Volume2, CheckCircle, Circle } from 'lucide-react';
import { WORDS } from '../data/words';
import { getAllProgress } from '../utils/storage';

interface Props {
  onBack: () => void;
}

const UNIT_LABELS: Record<string, string> = {
  '1-Unit 1': '上册 Unit 1 - 老师',
  '1-Unit 2': '上册 Unit 2 - 星期',
  '1-Unit 3': '上册 Unit 3 - 食物',
  '1-Unit 4': '上册 Unit 4 - 家务',
  '1-Unit 5': '上册 Unit 5 - 动物',
  '1-Unit 6': '上册 Unit 6 - 自然',
  '2-Unit 1': '下册 Unit 1 - 未来职业',
  '2-Unit 2': '下册 Unit 2 - 日常活动',
  '2-Unit 3': '下册 Unit 3 - 天气',
  '2-Unit 4': '下册 Unit 4 - 月份生日',
  '2-Unit 5': '下册 Unit 5 - 地点',
  '2-Unit 6': '下册 Unit 6 - 交通方向',
};

export function WordList({ onBack }: Props) {
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [showMeaning, setShowMeaning] = useState(true);
  const allProgress = getAllProgress();

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  };

  const filteredWords = selectedUnit === 'all'
    ? WORDS
    : WORDS.filter(w => `${w.semester}-${w.unit}` === selectedUnit);

  const learnedSet = new Set(
    Object.entries(allProgress).filter(([, p]) => p.isLearned).map(([id]) => id)
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/60">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">单词表</h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-500">显示意思</span>
          <button
            onClick={() => setShowMeaning(s => !s)}
            className={`w-10 h-6 rounded-full transition-colors ${showMeaning ? 'bg-purple-500' : 'bg-gray-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${showMeaning ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Unit Filter */}
      <div className="overflow-x-auto pb-2 mb-4">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedUnit('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedUnit === 'all' ? 'bg-purple-500 text-white' : 'bg-white text-gray-600'
            }`}
          >
            全部 ({WORDS.length})
          </button>
          {Object.entries(UNIT_LABELS).map(([key, label]) => {
            const count = WORDS.filter(w => `${w.semester}-${w.unit}` === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedUnit(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedUnit === key ? 'bg-purple-500 text-white' : 'bg-white text-gray-600'
                }`}
              >
                {label.split(' - ')[1] || label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="text-xs text-gray-400 mb-3">
        共 {filteredWords.length} 个单词，已掌握 {filteredWords.filter(w => learnedSet.has(w.id)).length} 个
      </div>

      {/* Word Cards */}
      <div className="space-y-2">
        {filteredWords.map(word => {
          const isLearned = learnedSet.has(word.id);
          const prog = allProgress[word.id];

          return (
            <div
              key={word.id}
              className={`bg-white rounded-2xl px-4 py-3 shadow-sm ${isLearned ? 'border-l-4 border-green-400' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isLearned
                    ? <CheckCircle size={18} className="text-green-400" />
                    : <Circle size={18} className="text-gray-200" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-gray-800">{word.word}</span>
                    <span className="text-xs text-gray-400">{word.phonetic}</span>
                    <button
                      onClick={() => speak(word.word)}
                      className="p-1 rounded-lg hover:bg-blue-50 text-gray-300 hover:text-blue-400"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                  {showMeaning && (
                    <p className="text-sm text-gray-600 mt-0.5">{word.meaning}</p>
                  )}
                  {showMeaning && (
                    <p className="text-xs text-gray-400 italic mt-0.5">"{word.example}"</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {prog ? (
                    <div className="text-xs">
                      <div className={`font-semibold ${isLearned ? 'text-green-500' : 'text-blue-400'}`}>
                        {isLearned ? '已掌握' : `复习${prog.repetitions}次`}
                      </div>
                      {prog.wrongCount > 0 && (
                        <div className="text-red-400">错{prog.wrongCount}次</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300">未学</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

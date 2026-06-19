import { useState } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, BookOpen } from 'lucide-react';
import { ALL_WORDS, type Word } from '../data/wordbooks';
import { getWrongEntries, resolveWrongEntry, getWordProgress } from '../utils/storage';
import type { GameConfig } from '../App';

interface Props {
  onBack: () => void;
  onStartGame: (config: GameConfig) => void;
  activeWords?: Word[];
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function WrongNotes({ onBack, onStartGame, activeWords: _ }: Props) {
  // Use ALL_WORDS for cross-book lookup
  const WORDS = ALL_WORDS;
  const [showResolved, setShowResolved] = useState(false);
  const [entries, setEntries] = useState(() => getWrongEntries());

  const filtered = showResolved ? entries : entries.filter(e => !e.resolvedAt);

  const unresolvedCount = entries.filter(e => !e.resolvedAt).length;

  const handleResolve = (wordId: string) => {
    resolveWrongEntry(wordId);
    setEntries(getWrongEntries());
  };

  const practiceWrong = () => {
    onStartGame({ mode: 'choice', filter: 'wrong' });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/60">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">错题本</h1>
          <p className="text-xs text-gray-400">共 {unresolvedCount} 个待复习的错误单词</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={practiceWrong}
          disabled={unresolvedCount === 0}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-400 to-orange-400 text-white rounded-xl font-bold disabled:opacity-40"
        >
          <RotateCcw size={16} />
          练习错题 ({unresolvedCount})
        </button>
        <button
          onClick={() => setShowResolved(s => !s)}
          className={`px-4 py-3 rounded-xl font-semibold text-sm ${
            showResolved ? 'bg-gray-700 text-white' : 'bg-white text-gray-600'
          }`}
        >
          {showResolved ? '隐藏' : '显示'}已解决
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-gray-600 font-medium">
            {showResolved ? '还没有错题记录' : '没有待复习的错题！'}
          </p>
          {!showResolved && entries.length > 0 && (
            <p className="text-gray-400 text-sm mt-2">
              点击"显示已解决"查看历史记录
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry, i) => {
            const word = WORDS.find(w => w.id === entry.wordId);
            const progress = getWordProgress(entry.wordId);
            if (!word) return null;

            return (
              <div
                key={i}
                className={`bg-white rounded-2xl p-4 shadow-sm ${entry.resolvedAt ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-gray-800">{word.word}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
                        {word.phonetic}
                      </span>
                      {entry.resolvedAt && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                          已解决
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{word.meaning}</p>
                    {entry.wrongAnswer && entry.wrongAnswer !== '配对错误' && (
                      <p className="text-xs text-red-400 mt-1">
                        你的答案：{entry.wrongAnswer}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{formatTime(entry.wrongAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <div className="text-center">
                      <div className="text-xs text-red-400 font-bold">{progress.wrongCount}</div>
                      <div className="text-xs text-gray-400">错误</div>
                    </div>
                    {!entry.resolvedAt && (
                      <button
                        onClick={() => handleResolve(entry.wordId)}
                        className="p-2 rounded-xl hover:bg-green-50 text-gray-300 hover:text-green-500 transition-colors"
                        title="标记为已解决"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Example sentence tip */}
      {filtered.length > 0 && (
        <div className="mt-5 bg-orange-50 rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <BookOpen size={16} className="text-orange-400 mt-0.5 shrink-0" />
            <p className="text-xs text-orange-700">
              <span className="font-semibold">复习建议：</span>
              每个错题至少需要答对3次才能真正记住！点击"练习错题"专门复习这些单词。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import type { Word } from '../../data/words';

interface Props {
  word: Word;
  allWords: Word[];
  onAnswer: (correct: boolean, wrongAnswer?: string) => void;
  onSpeak: (text: string) => void;
}

function getDistractors(word: Word, allWords: Word[], count: number): Word[] {
  const others = allWords.filter(w => w.id !== word.id);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function ChoiceGame({ word, allWords, onAnswer, onSpeak }: Props) {
  const [options, setOptions] = useState<Word[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const distractors = getDistractors(word, allWords, 3);
    const all = [...distractors, word].sort(() => Math.random() - 0.5);
    setOptions(all);
    setSelected(null);
  }, [word, allWords]);

  const handleSelect = (opt: Word) => {
    if (selected) return;
    setSelected(opt.id);
    const correct = opt.id === word.id;
    onAnswer(correct, correct ? undefined : opt.meaning);
  };

  return (
    <div>
      {/* Word Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm mb-6 text-center">
        <div className="text-4xl font-bold text-gray-800 mb-2">{word.word}</div>
        <div className="text-gray-400 text-sm mb-4">{word.phonetic}</div>
        <button
          onClick={() => onSpeak(word.word)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <Volume2 size={16} />
          <span className="text-sm">发音</span>
        </button>
        <div className="text-xs text-gray-400 mt-3">{word.unit} · {word.semester === 1 ? '上册' : '下册'}</div>
      </div>

      <p className="text-center text-sm text-gray-500 mb-3">选择正确的中文意思</p>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map(opt => {
          const isCorrect = opt.id === word.id;
          const isSelected = selected === opt.id;
          let cls = 'bg-white border-2 border-gray-100 text-gray-700';
          if (isSelected && isCorrect) cls = 'bg-green-500 border-green-500 text-white';
          if (isSelected && !isCorrect) cls = 'bg-red-400 border-red-400 text-white animate-shake';
          if (selected && !isSelected && isCorrect) cls = 'bg-green-100 border-green-400 text-green-700';

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              className={`${cls} p-4 rounded-2xl font-medium transition-all text-sm shadow-sm hover:shadow active:scale-95`}
            >
              {opt.meaning}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-5 bg-blue-50 rounded-2xl p-4">
          <p className="text-sm text-blue-800">
            <span className="font-bold">{word.word}</span> — {word.meaning}
          </p>
          <p className="text-xs text-gray-500 mt-1 italic">"{word.example}"</p>
        </div>
      )}
    </div>
  );
}

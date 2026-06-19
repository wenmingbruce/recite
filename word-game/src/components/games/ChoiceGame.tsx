import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import type { Word } from '../../data/wordbooks';
import { ALL_WORDS } from '../../data/wordbooks';
import { ALL_CHINESE_WORDS } from '../../data/chinesebooks';

interface Props {
  word: Word;
  allWords?: Word[];
  onAnswer: (correct: boolean, wrongAnswer?: string) => void;
  onSpeak: (text: string) => void;
}

function getDistractors(word: Word, pool: Word[], count: number): Word[] {
  const others = pool.filter(w => w.id !== word.id);
  return [...others].sort(() => Math.random() - 0.5).slice(0, count);
}

function isChinese(word: Word) {
  return word.id.startsWith('zh_');
}

export function ChoiceGame({ word, allWords, onAnswer, onSpeak }: Props) {
  const [options, setOptions] = useState<Word[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    // Choose distractor pool: passed allWords → same-language fallback
    const fallback = isChinese(word) ? ALL_CHINESE_WORDS : ALL_WORDS;
    const pool = (allWords && allWords.length >= 4) ? allWords : fallback;
    const distractors = getDistractors(word, pool, 3);
    setOptions([...distractors, word].sort(() => Math.random() - 0.5));
    setSelected(null);
  }, [word, allWords]);

  const handleSelect = (opt: Word) => {
    if (selected) return;
    setSelected(opt.id);
    const correct = opt.id === word.id;
    onAnswer(correct, correct ? undefined : opt.meaning);
  };

  const isPoem  = word.unit.startsWith('古诗');
  const isCh    = isChinese(word);

  return (
    <div>
      {/* Word / Question card */}
      <div className="bg-white rounded-3xl p-7 shadow-sm mb-5 text-center">
        {isPoem ? (
          // Poem mode: show first line as question, answer is second line
          <>
            <p className="text-xs text-gray-400 mb-2">{word.example}</p>
            <div className="text-2xl font-bold text-gray-800 leading-snug mb-2">
              {word.word}
            </div>
            <div className="text-xs text-gray-400">{word.phonetic}</div>
          </>
        ) : (
          // Vocabulary / English mode
          <>
            <div className={`font-bold text-gray-800 mb-2 ${isCh ? 'text-3xl' : 'text-4xl'}`}>
              {word.word}
            </div>
            <div className="text-gray-400 text-sm mb-4">{word.phonetic}</div>
            {!isCh && (
              <button
                onClick={() => onSpeak(word.word)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Volume2 size={16} />
                <span className="text-sm">发音</span>
              </button>
            )}
          </>
        )}
        <div className="text-xs text-gray-300 mt-3">{word.unit} · {word.semester === 1 ? '上册' : '下册'}</div>
      </div>

      <p className="text-center text-sm text-gray-500 mb-3">
        {isPoem ? '选出正确的下句 👇' : isCh ? '选出正确的词语解释 👇' : '选择正确的中文意思 👇'}
      </p>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map(opt => {
          const isCorrect = opt.id === word.id;
          const isSelected = selected === opt.id;
          let cls = 'bg-white border-2 border-gray-100 text-gray-700';
          if (isSelected && isCorrect)  cls = 'bg-green-500 border-green-500 text-white';
          if (isSelected && !isCorrect) cls = 'bg-red-400 border-red-400 text-white animate-shake';
          if (selected && !isSelected && isCorrect) cls = 'bg-green-100 border-green-400 text-green-700';

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              className={`${cls} p-4 rounded-2xl font-medium transition-all text-sm shadow-sm hover:shadow active:scale-95 leading-snug`}
            >
              {opt.meaning}
            </button>
          );
        })}
      </div>

      {/* Answer reveal */}
      {selected && (
        <div className="mt-5 bg-blue-50 rounded-2xl p-4">
          {isPoem ? (
            <>
              <p className="text-sm text-blue-800 font-bold text-center">
                {word.word}
              </p>
              <p className="text-base text-blue-900 font-bold text-center mt-0.5">
                {word.meaning}
              </p>
              <p className="text-xs text-gray-500 mt-1 text-center">{word.example}</p>
            </>
          ) : (
            <>
              <p className="text-sm text-blue-800">
                <span className="font-bold">{word.word}</span> — {word.meaning}
              </p>
              <p className="text-xs text-gray-500 mt-1 italic">"{word.example}"</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

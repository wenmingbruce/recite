import { useState, useRef, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import type { Word } from '../../data/wordbooks';

interface Props {
  word: Word;
  onAnswer: (correct: boolean, wrongAnswer?: string) => void;
  onSpeak: (text: string) => void;
}

export function SpellGame({ word, onAnswer, onSpeak }: Props) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCh   = word.id.startsWith('zh_');
  const isPoem = word.unit.startsWith('古诗');

  useEffect(() => {
    setInput('');
    setSubmitted(false);
    setShowHint(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [word]);

  const handleSubmit = () => {
    if (submitted || !input.trim()) return;
    setSubmitted(true);
    const correct = input.trim() === word.word.trim();
    onAnswer(correct, correct ? undefined : input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  // Hint: reveal first char + last char
  const hintText = word.word
    .split('')
    .map((c, i) => (i === 0 || i === word.word.length - 1 ? c : isCh ? '□' : '_'))
    .join(isCh ? '' : ' ');

  const isCorrect = submitted && input.trim() === word.word.trim();

  return (
    <div>
      {/* Question card */}
      <div className="bg-white rounded-3xl p-7 shadow-sm mb-5 text-center">
        {isPoem ? (
          <>
            <p className="text-xs text-gray-400 mb-1">{word.example}</p>
            <p className="text-sm text-gray-500 mb-2">写出下一句：</p>
            <div className="text-xl font-bold text-purple-700 mb-1">{word.word}</div>
            <div className="text-xs text-gray-400">{word.phonetic}</div>
          </>
        ) : (
          <>
            <div className={`text-gray-600 mb-2 leading-snug ${isCh ? 'text-xl font-semibold' : 'text-lg'}`}>
              {word.meaning}
            </div>
            <div className="text-sm text-gray-400 mb-3">{word.phonetic}</div>
            {!isCh && (
              <button
                onClick={() => onSpeak(word.word)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Volume2 size={16} />
                <span className="text-sm">听发音</span>
              </button>
            )}
          </>
        )}
        {showHint && (
          <div className="mt-3 bg-yellow-50 rounded-xl px-4 py-2 text-yellow-700 font-bold tracking-widest text-lg">
            {hintText}
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-500 mb-3">
        {isPoem ? '输入下一句诗' : isCh ? '输入这个词语' : '拼写英文单词'}
      </p>

      {/* Input */}
      <div className={`bg-white rounded-2xl shadow-sm overflow-hidden mb-3 border-2 transition-colors ${
        submitted ? (isCorrect ? 'border-green-400' : 'border-red-400') : 'border-gray-100 focus-within:border-purple-400'
      }`}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => !submitted && setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isPoem ? '输入下一句...' : isCh ? '输入词语...' : '输入英文单词...'}
          className={`w-full px-5 py-4 text-gray-800 outline-none bg-transparent text-center ${
            isCh ? 'text-xl' : 'text-xl font-mono tracking-widest'
          }`}
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      <div className="flex gap-2 mb-4">
        {!submitted && (
          <>
            <button
              onClick={() => setShowHint(true)}
              disabled={showHint}
              className="flex-1 py-3 bg-yellow-100 text-yellow-700 rounded-xl font-semibold text-sm disabled:opacity-40"
            >
              💡 提示
            </button>
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold disabled:opacity-40"
            >
              确认
            </button>
          </>
        )}
      </div>

      {submitted && (
        <div className={`rounded-2xl p-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          {isCorrect ? (
            <p className="text-green-700 font-bold text-center text-lg">✓ 答对了！</p>
          ) : (
            <>
              <p className="text-red-600 font-bold text-center">✗ 正确答案：</p>
              <p className={`text-center font-bold text-gray-800 mt-1 ${isCh ? 'text-xl' : 'text-2xl font-mono'}`}>
                {word.word}
              </p>
            </>
          )}
          <p className="text-xs text-gray-500 mt-2 text-center">
            {isPoem ? word.example : `"${word.example}"`}
          </p>
        </div>
      )}
    </div>
  );
}

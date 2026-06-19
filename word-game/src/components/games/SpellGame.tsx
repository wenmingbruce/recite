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

  useEffect(() => {
    setInput('');
    setSubmitted(false);
    setShowHint(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [word]);

  const handleSubmit = () => {
    if (submitted || !input.trim()) return;
    setSubmitted(true);
    const correct = input.trim().toLowerCase() === word.word.toLowerCase();
    onAnswer(correct, correct ? undefined : input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const hintText = word.word
    .split('')
    .map((c, i) => (i === 0 || i === word.word.length - 1 ? c : '_'))
    .join(' ');

  const isCorrect = submitted && input.trim().toLowerCase() === word.word.toLowerCase();

  return (
    <div>
      {/* Word Prompt */}
      <div className="bg-white rounded-3xl p-8 shadow-sm mb-6 text-center">
        <div className="text-lg text-gray-500 mb-2">{word.meaning}</div>
        <div className="text-sm text-gray-400 mb-4">{word.phonetic}</div>
        <button
          onClick={() => onSpeak(word.word)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-colors mb-3"
        >
          <Volume2 size={16} />
          <span className="text-sm">听发音</span>
        </button>
        {showHint && (
          <div className="bg-yellow-50 rounded-xl px-4 py-2 text-yellow-700 font-mono tracking-widest text-lg">
            {hintText}
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-500 mb-3">拼写英文单词</p>

      {/* Input */}
      <div className={`bg-white rounded-2xl shadow-sm overflow-hidden mb-3 border-2 transition-colors ${
        submitted ? (isCorrect ? 'border-green-400' : 'border-red-400') : 'border-gray-100 focus-within:border-purple-400'
      }`}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => !submitted && setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入英文单词..."
          className="w-full px-5 py-4 text-xl font-mono text-gray-800 outline-none bg-transparent text-center tracking-widest"
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {/* Action Buttons */}
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
              className="flex-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold disabled:opacity-40"
            >
              确认
            </button>
          </>
        )}
      </div>

      {/* Result */}
      {submitted && (
        <div className={`rounded-2xl p-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          {isCorrect ? (
            <p className="text-green-700 font-bold text-center text-lg">✓ 拼写正确！</p>
          ) : (
            <>
              <p className="text-red-600 font-bold text-center">✗ 正确答案：</p>
              <p className="text-center text-2xl font-mono font-bold text-gray-800 mt-1">{word.word}</p>
            </>
          )}
          <p className="text-xs text-gray-500 mt-2 text-center italic">"{word.example}"</p>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import type { Word } from '../../data/wordbooks';

interface Props {
  words: Word[];
  onComplete: (results: { wordId: string; correct: boolean }[]) => void;
  onSpeak: (text: string) => void;
}

interface Card {
  id: string;
  text: string;
  type: 'word' | 'meaning';
  wordId: string;
  matched: boolean;
  selected: boolean;
  wrong: boolean;
}

export function MatchGame({ words, onComplete, onSpeak }: Props) {
  const batchSize = Math.min(6, words.length);
  const batch = words.slice(0, batchSize);

  const [cards, setCards] = useState<Card[]>(() => {
    const wordCards: Card[] = batch.map(w => ({
      id: `w-${w.id}`, text: w.word, type: 'word', wordId: w.id,
      matched: false, selected: false, wrong: false,
    }));
    const meaningCards: Card[] = batch.map(w => ({
      id: `m-${w.id}`, text: w.meaning, type: 'meaning', wordId: w.id,
      matched: false, selected: false, wrong: false,
    }));
    return [...wordCards, ...meaningCards].sort(() => Math.random() - 0.5);
  });

  const [firstSelected, setFirstSelected] = useState<Card | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [results, setResults] = useState<{ wordId: string; correct: boolean }[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const handleCardClick = (card: Card) => {
    if (card.matched || card.selected || isLocked) return;

    if (!firstSelected) {
      setFirstSelected(card);
      setCards(prev => prev.map(c => c.id === card.id ? { ...c, selected: true } : c));
      if (card.type === 'word') onSpeak(card.text);
      return;
    }

    if (firstSelected.type === card.type) {
      setCards(prev => prev.map(c => c.id === firstSelected.id ? { ...c, selected: false } : c));
      setFirstSelected(card);
      setCards(prev => prev.map(c => c.id === card.id ? { ...c, selected: true } : c));
      if (card.type === 'word') onSpeak(card.text);
      return;
    }

    const isMatch = firstSelected.wordId === card.wordId;
    setIsLocked(true);

    if (isMatch) {
      setCards(prev => prev.map(c =>
        c.id === firstSelected.id || c.id === card.id
          ? { ...c, matched: true, selected: false }
          : c
      ));
      const newCount = matchedCount + 1;
      setMatchedCount(newCount);
      setResults(prev => [...prev, { wordId: card.wordId, correct: true }]);
      setFirstSelected(null);
      setIsLocked(false);

      if (newCount === batchSize) {
        const finalResults = [...results, { wordId: card.wordId, correct: true }];
        const allResults = batch.map(w => ({
          wordId: w.id,
          correct: finalResults.find(r => r.wordId === w.id)?.correct ?? false,
        }));
        setTimeout(() => onComplete(allResults), 600);
      }
    } else {
      setCards(prev => prev.map(c =>
        c.id === firstSelected.id || c.id === card.id
          ? { ...c, wrong: true, selected: false }
          : c
      ));
      setResults(prev => [
        ...prev.filter(r => r.wordId !== card.wordId && r.wordId !== firstSelected.wordId),
        { wordId: card.wordId, correct: false },
        { wordId: firstSelected.wordId, correct: false },
      ]);
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === firstSelected.id || c.id === card.id
            ? { ...c, wrong: false }
            : c
        ));
        setFirstSelected(null);
        setIsLocked(false);
      }, 800);
    }
  };

  return (
    <div>
      <div className="text-center mb-5">
        <p className="text-gray-600 font-medium">点击配对：英文单词 ↔ 中文意思</p>
        <p className="text-sm text-gray-400 mt-1">已配对 {matchedCount} / {batchSize} 对</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {cards.map(card => {
          let cls = 'bg-white border-2 border-gray-100 text-gray-700 hover:border-purple-300 hover:bg-purple-50';
          if (card.selected) cls = 'bg-purple-500 border-purple-500 text-white scale-105 shadow-lg';
          if (card.matched) cls = 'bg-green-100 border-green-300 text-green-700 opacity-60';
          if (card.wrong) cls = 'bg-red-100 border-red-300 text-red-700 animate-shake';

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={card.matched}
              className={`${cls} p-3 rounded-2xl font-medium text-xs transition-all shadow-sm min-h-[60px] flex items-center justify-center text-center`}
            >
              {card.text}
            </button>
          );
        })}
      </div>

      <div className="mt-5 bg-blue-50 rounded-2xl p-3">
        <p className="text-xs text-blue-600 text-center">💡 先点一张英文卡，再点对应的中文卡</p>
      </div>
    </div>
  );
}

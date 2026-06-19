import { ArrowLeft } from 'lucide-react';
import {
  STICKER_DEFS, getStickerCounts, RARITY_LABEL, RARITY_COLOR,
  type StickerDef
} from '../utils/stickers';

interface Props { onBack: () => void; }

const RARITY_ORDER: StickerDef['rarity'][] = ['legendary', 'epic', 'rare', 'common'];

export function StickerBook({ onBack }: Props) {
  const counts = getStickerCounts();
  const total = STICKER_DEFS.length;
  const owned = STICKER_DEFS.filter(s => (counts[s.id] ?? 0) > 0).length;

  const grouped = RARITY_ORDER.map(r => ({
    rarity: r,
    stickers: STICKER_DEFS.filter(s => s.rarity === r),
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/60">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">我的贴画册</h1>
          <p className="text-xs text-gray-400">已收集 {owned} / {total} 种</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 font-medium">收集进度</span>
          <span className="font-bold text-purple-600">{Math.round((owned / total) * 100)}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-700"
            style={{ width: `${(owned / total) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">完成关卡就能获得贴画，满分有机会获得传说贴画！</p>
      </div>

      {/* Sticker groups */}
      {grouped.map(({ rarity, stickers }) => (
        <div key={rarity} className="mb-5">
          <div className={`flex items-center gap-2 mb-3`}>
            <div className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 ${RARITY_COLOR[rarity]}`}>
              {RARITY_LABEL[rarity]}
            </div>
            <div className="text-xs text-gray-400">
              {stickers.filter(s => (counts[s.id] ?? 0) > 0).length}/{stickers.length}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {stickers.map(s => {
              const count = counts[s.id] ?? 0;
              const has = count > 0;
              return (
                <div
                  key={s.id}
                  className={`rounded-2xl p-4 text-center shadow-sm transition-all ${
                    has
                      ? 'bg-white border-2 border-gray-100'
                      : 'bg-gray-50 border-2 border-dashed border-gray-200 opacity-50 grayscale'
                  }`}
                >
                  <div className={`text-4xl mb-1.5 ${has ? '' : 'opacity-30'}`}>
                    {has ? s.emoji : '❓'}
                  </div>
                  <div className="text-xs font-bold text-gray-700">
                    {has ? s.name : '???'}
                  </div>
                  {has && (
                    <>
                      <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
                      {count > 1 && (
                        <div className="mt-1 text-xs bg-purple-100 text-purple-600 rounded-full px-2 font-bold inline-block">
                          ×{count}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 text-center mb-4">
        <p className="text-sm text-purple-700 font-medium">
          🎯 每次完成关卡就能获得一张贴画<br />
          <span className="text-xs text-gray-500">满分有机会获得传说或史诗稀有贴画！</span>
        </p>
      </div>
    </div>
  );
}

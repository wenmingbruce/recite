// Re-export from wordbooks for backward compatibility.
// Components should prefer importing from wordbooks.ts directly.
export type { Word } from './wordbooks';
export { ALL_WORDS as WORDS, getWordBook } from './wordbooks';

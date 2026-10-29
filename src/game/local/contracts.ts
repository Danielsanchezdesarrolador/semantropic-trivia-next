/** Contracts for local practice only. Competitive validation belongs on the server. */
export const localCategories = [
  'geografia', 'ciencias', 'historia', 'arte_cultura', 'deportes', 'entretenimiento',
] as const;
export type LocalCategory = typeof localCategories[number];
export type AlternativeId = 'A' | 'B' | 'C' | 'D';
export interface Alternative {
  readonly id: AlternativeId;
  readonly text: string;
}
export interface Question {
  readonly id: string;
  readonly category: LocalCategory;
  readonly text: string;
  readonly alternatives: readonly [Alternative, Alternative, Alternative, Alternative];
}
/** Never use this client-side answer key for competitive matches. */
export interface LocalPracticeQuestion extends Question {
  readonly correctAlternativeId: AlternativeId;
  readonly explanation: string;
}
export interface LocalAnswerResult {
  readonly questionId: string;
  /** null means the time expired without a valid answer. */
  readonly alternativeId: AlternativeId | null;
  readonly correct: boolean;
  readonly points: 0 | 1;
}
export interface LocalRoundResult {
  readonly mode: 'local-practice';
  readonly total: 10;
  readonly correct: number;
  readonly incorrect: number;
  readonly score: number;
  readonly answers: readonly LocalAnswerResult[];
}
interface RoundData {
  readonly mode: 'local-practice';
  readonly questions: readonly LocalPracticeQuestion[];
  readonly answers: readonly LocalAnswerResult[];
  readonly questionIndex: number;
}
export type LocalRoundState =
  | (RoundData & { readonly status: 'awaiting-answer' | 'answered'; readonly result: null })
  | (RoundData & { readonly status: 'finished'; readonly result: LocalRoundResult });

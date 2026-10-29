import { localCategories } from './contracts.ts';
import type { AlternativeId, LocalPracticeQuestion, LocalRoundState, Question } from './contracts.ts';

export const LOCAL_ROUND_LENGTH = 10;

/** Pure local engine: no randomness, clock, persistence, UI or network. */
export function startLocalRound(questions: readonly LocalPracticeQuestion[]): LocalRoundState {
  if (questions.length !== LOCAL_ROUND_LENGTH) throw new Error('A local round requires exactly ten questions.');
  const ids = new Set<string>();
  for (const question of questions) {
    const optionIds = new Set(question.alternatives.map(option => option.id));
    if (!question.id.trim() || ids.has(question.id) || !question.text.trim()
      || !localCategories.includes(question.category) || !question.explanation.trim()
      || question.alternatives.length !== 4 || optionIds.size !== 4
      || !['A', 'B', 'C', 'D'].every(id => optionIds.has(id as AlternativeId))
      || question.alternatives.some(option => !option.text.trim())
      || !optionIds.has(question.correctAlternativeId)) {
      throw new Error('Invalid local practice question: ' + question.id);
    }
    ids.add(question.id);
  }
  // Snapshot input so later edits to the example bank cannot change an ongoing round.
  const snapshot = questions.map(question => {
    const [a, b, c, d] = question.alternatives;
    return Object.freeze({
      ...question,
      alternatives: Object.freeze([
        Object.freeze({ ...a }), Object.freeze({ ...b }),
        Object.freeze({ ...c }), Object.freeze({ ...d }),
      ] as const),
    });
  });
  return Object.freeze({ mode: 'local-practice', status: 'awaiting-answer', questionIndex: 0,
    questions: Object.freeze(snapshot), answers: Object.freeze([]), result: null });
}

/** Presentation contract omits the local solution and explanation. */
export function currentQuestion(state: LocalRoundState): Question | null {
  if (state.status === 'finished') return null;
  const { id, category, text, alternatives } = state.questions[state.questionIndex];
  return Object.freeze({ id, category, text, alternatives });
}

/** Invalid, duplicate and stale submissions are no-ops, including after completion. */
export function answerLocalQuestion(
  state: LocalRoundState, questionId: string, alternativeId: AlternativeId,
): LocalRoundState {
  if (state.status !== 'awaiting-answer') return state;
  const question = state.questions[state.questionIndex];
  if (question.id !== questionId || !question.alternatives.some(option => option.id === alternativeId)) return state;
  return recordLocalAnswer(state, alternativeId);
}

/** A timeout is a resolved question with zero points, never an invented selection. */
export function expireLocalQuestion(state: LocalRoundState, questionId: string): LocalRoundState {
  if (state.status !== 'awaiting-answer' || state.questions[state.questionIndex].id !== questionId) return state;
  return recordLocalAnswer(state, null);
}

function recordLocalAnswer(state: LocalRoundState, alternativeId: AlternativeId | null): LocalRoundState {
  if (state.status !== 'awaiting-answer') return state;
  const question = state.questions[state.questionIndex];
  const questionId = question.id;
  const correct = alternativeId !== null && alternativeId === question.correctAlternativeId;
  const answers = Object.freeze([...state.answers, Object.freeze({
    questionId, alternativeId, correct, points: correct ? 1 as const : 0 as const,
  })]);
  if (answers.length === LOCAL_ROUND_LENGTH) {
    const correctCount = answers.filter(answer => answer.correct).length;
    return Object.freeze({ ...state, status: 'finished', answers, result: Object.freeze({
      mode: 'local-practice', total: 10, correct: correctCount,
      incorrect: LOCAL_ROUND_LENGTH - correctCount, score: correctCount, answers,
    }) });
  }
  return Object.freeze({ ...state, status: 'answered', answers });
}

export function advanceLocalRound(state: LocalRoundState): LocalRoundState {
  if (state.status !== 'answered') return state;
  return Object.freeze({ ...state, status: 'awaiting-answer', questionIndex: state.questionIndex + 1 });
}

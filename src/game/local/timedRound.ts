import type { AlternativeId, LocalPracticeQuestion, LocalRoundState } from './contracts.ts';
import { advanceLocalRound, answerLocalQuestion, expireLocalQuestion, startLocalRound } from './round.ts';

/** Provisional local balance parameter; requires Director review. Not a server clock. */
export const LOCAL_QUESTION_DURATION_MS = 20_000;
export interface TimedLocalRound {
  readonly round: LocalRoundState;
  readonly durationMs: number;
  readonly deadline: number;
  readonly observedAt: number;
  readonly remainingMs: number;
}

function validTime(now: number): number {
  if (!Number.isFinite(now)) throw new Error('A finite timestamp is required.');
  return now;
}

export function startTimedLocalRound(
  questions: readonly LocalPracticeQuestion[], now: number, durationMs = LOCAL_QUESTION_DURATION_MS,
): TimedLocalRound {
  validTime(now);
  if (!Number.isFinite(durationMs) || durationMs <= 0 || !Number.isFinite(now + durationMs)) {
    throw new Error('Question duration must be finite and positive.');
  }
  return Object.freeze({ round: startLocalRound(questions), durationMs,
    deadline: now + durationMs, observedAt: now, remainingMs: durationMs });
}

/** Recompute from the deadline, even if no UI tick ran while the tab was inactive. */
export function syncTimedLocalRound(session: TimedLocalRound, now: number): TimedLocalRound {
  if (session.round.status !== 'awaiting-answer') return session;
  const observedAt = Math.max(session.observedAt, validTime(now));
  const remainingMs = Math.max(0, session.deadline - observedAt);
  if (observedAt === session.observedAt) return session;
  const round = remainingMs === 0
    ? expireLocalQuestion(session.round, session.round.questions[session.round.questionIndex].id)
    : session.round;
  return Object.freeze({ ...session, round, remainingMs, observedAt });
}

export function answerTimedLocalQuestion(
  session: TimedLocalRound, questionId: string, alternativeId: AlternativeId, now: number,
): TimedLocalRound {
  const updated = syncTimedLocalRound(session, now);
  const round = answerLocalQuestion(updated.round, questionId, alternativeId);
  return round === updated.round ? updated : Object.freeze({ ...updated, round });
}

export function advanceTimedLocalRound(session: TimedLocalRound, now: number): TimedLocalRound {
  const round = advanceLocalRound(session.round);
  if (round === session.round) return session;
  const observedAt = Math.max(session.observedAt, validTime(now));
  return Object.freeze({ ...session, round, observedAt,
    deadline: observedAt + session.durationMs, remainingMs: session.durationMs });
}

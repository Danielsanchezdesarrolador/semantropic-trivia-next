import { useEffect, useState } from 'react';
import type { AlternativeId } from '../../game/local/contracts';
import { exampleQuestions } from '../../game/local/exampleQuestions';
import {
  advanceTimedLocalRound, answerTimedLocalQuestion, startTimedLocalRound, syncTimedLocalRound,
} from '../../game/local/timedRound';
import { localNow } from './localClock';

export function useLocalPractice(enabled: boolean) {
  const [session, setSession] = useState(() => enabled ? startTimedLocalRound(exampleQuestions, localNow()) : null);
  const waiting = session?.round.status === 'awaiting-answer';
  const deadline = session?.deadline;
  useEffect(() => {
    if (!enabled || !waiting) return;
    const refresh = () => {
      const now = localNow();
      setSession(previous => previous ? syncTimedLocalRound(previous, now) : previous);
    };
    refresh();
    const interval = window.setInterval(refresh, 100);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', refresh);
    };
  }, [enabled, waiting, deadline]);

  return {
    session,
    round: session?.round ?? null,
    durationSeconds: session ? Math.ceil(session.durationMs / 1000) : 0,
    remainingSeconds: session ? Math.ceil(session.remainingMs / 1000) : 0,
    respond(questionId: string, alternativeId: AlternativeId) {
      const now = localNow();
      setSession(previous => previous ? answerTimedLocalQuestion(previous, questionId, alternativeId, now) : previous);
    },
    advance() {
      const now = localNow();
      setSession(previous => previous ? advanceTimedLocalRound(previous, now) : previous);
    },
    restart() { setSession(startTimedLocalRound(exampleQuestions, localNow())); },
  };
}

import { useEffect, useRef } from 'react';
import type { LocalRoundState } from '../../game/local/contracts';
import { ds01Audio } from './audioEngine';
import { QuizAudioEvents } from './quizAudioEvents';

export function useQuizAudio(round: LocalRoundState | null) {
  const observer = useRef(new QuizAudioEvents());
  useEffect(() => {
    if (!round) return;
    let mounted = true;
    const sync = async () => {
      if (document.hidden) { ds01Audio.stop(); return; }
      await ds01Audio.resumeIfEnabled();
      if (!mounted || document.hidden) return;
      // On returning to a suspended page, consume the real timeout exactly once.
      observer.current.collect(round).forEach(events => ds01Audio.play(events));
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => { mounted = false; document.removeEventListener('visibilitychange', sync); };
  }, [round]);
}

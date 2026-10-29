import { useLayoutEffect, useRef } from 'react';
import type { TimedLocalRound } from '../../game/local/timedRound';
import { localNow } from '../../ui/quiz/localClock';
import { ds01Audio } from '../ds01/audioEngine';
import { clockSlot } from './policy';

export function useClockAudio(session: TimedLocalRound | null) {
  const current = useRef(session);
  useLayoutEffect(() => { current.current = session; }, [session]);
  const waiting = session?.round.status === 'awaiting-answer';
  const deadline = session?.deadline;
  useLayoutEffect(() => {
    if (!waiting || !deadline) { ds01Audio.stopClock(); return; }
    let frame = 0;
    let previous: number | null = null;
    const paint = () => {
      frame = 0;
      if (document.hidden) { ds01Audio.stopClock(); return; }
      const snapshot = current.current;
      if (!snapshot || snapshot.round.status !== 'awaiting-answer') { ds01Audio.stopClock(); return; }
      const slot = clockSlot(Math.max(0, snapshot.deadline - Math.max(snapshot.observedAt, localNow())));
      if (document.hidden || slot === null) ds01Audio.stopClock();
      else if (slot !== previous) ds01Audio.playApproved('CLK');
      previous = slot; // Consume only current slot, never replay missed ticks.
      if (slot !== null) frame = requestAnimationFrame(paint);
    };
    const visibility = () => {
      cancelAnimationFrame(frame); frame = 0;
      if (document.hidden) ds01Audio.stopClock(); else paint();
    };
    ds01Audio.clockVisibility = visibility;
    frame = requestAnimationFrame(paint);
    return () => {
      cancelAnimationFrame(frame); ds01Audio.stopClock();
      if (ds01Audio.clockVisibility === visibility) ds01Audio.clockVisibility = undefined;
    };
  }, [waiting, deadline]);
}

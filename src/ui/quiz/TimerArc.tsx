import { useCallback, useLayoutEffect, useRef } from 'react';
import type { TimedLocalRound } from '../../game/local/timedRound';
import { localNow } from './localClock';
import { timerArc } from './timerArcMath';

/** Overlay uses the approved 320x320 clock's center (160,150), radius 115. */
export default function TimerArc({ session }: { session: TimedLocalRound }) {
  const snapshot = useRef(session);
  const observedAt = useRef(session.observedAt);
  const arc = useRef<SVGCircleElement>(null);
  const running = session.round.status === 'awaiting-answer';
  const paint = useCallback(() => {
    const current = snapshot.current;
    const waiting = current.round.status === 'awaiting-answer';
    if (waiting) observedAt.current = Math.max(observedAt.current, current.observedAt, localNow());
    const remainingMs = waiting ? Math.max(0, current.deadline - observedAt.current) : current.remainingMs;
    const visual = timerArc(remainingMs, current.durationMs);
    if (arc.current) {
      arc.current.setAttribute('stroke-dashoffset', String(visual.dashOffset));
      arc.current.setAttribute('data-progress', String(visual.progress));
      arc.current.style.color = visual.color;
      // Round caps must leave no luminous dot when no time is left.
      arc.current.style.opacity = visual.progress > 0 ? '1' : '0';
    }
    return visual.progress;
  }, []);

  // Synchronize before paint: answer freezes at the exact engine timestamp;
  // a new deadline resets immediately, with no residual CSS transition.
  useLayoutEffect(() => {
    if (snapshot.current.deadline !== session.deadline) observedAt.current = session.observedAt;
    snapshot.current = session;
    paint();
  }, [session, paint]);

  useLayoutEffect(() => {
    if (!running) return;
    let frameId = 0;
    let active = true;
    const frame = () => {
      frameId = 0;
      if (!active) return;
      if (paint() > 0 && !document.hidden) frameId = requestAnimationFrame(frame);
    };
    const resume = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      frame();
    };
    resume();
    document.addEventListener('visibilitychange', resume);
    window.addEventListener('focus', resume);
    window.addEventListener('pageshow', resume);
    return () => {
      active = false;
      if (frameId) cancelAnimationFrame(frameId);
      document.removeEventListener('visibilitychange', resume);
      window.removeEventListener('focus', resume);
      window.removeEventListener('pageshow', resume);
    };
  }, [running, session.deadline, paint]);

  const initial = timerArc(session.remainingMs, session.durationMs);
  return <svg className="b03-timer-arc" viewBox="0 0 320 320" aria-hidden="true" focusable="false">
    {/* Cover only the static arc/reflection; keep the original frame, face and shadow. */}
    <circle cx="160" cy="150" r="115" fill="none" stroke="#092F83" strokeWidth="26" />
    <circle ref={arc} className="b03-timer-arc__progress" cx="160" cy="150" r="115"
      fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round"
      pathLength="100" strokeDasharray="100 100" transform="rotate(-90 160 150)"
      style={{ color: initial.color, opacity: initial.progress > 0 ? 1 : 0 }} />
  </svg>;
}

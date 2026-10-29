/** Pure presentation math. Never decides expiry, scoring or question advancement. */
export function timerArc(remainingMs: number, durationMs: number) {
  const progress = durationMs > 0 ? Math.max(0, Math.min(1, remainingMs / durationMs)) : 0;
  // Original approved arc colors: cyan #12CAFF, yellow #FFD144, red #FF496D.
  const red = [255, 73, 109];
  const yellow = [255, 209, 68];
  const cyan = [18, 202, 255];
  const from = progress <= 0.5 ? red : yellow;
  const to = progress <= 0.5 ? yellow : cyan;
  const mix = progress <= 0.5 ? progress * 2 : (progress - 0.5) * 2;
  const channels = from.map((value, index) => +(value + (to[index] - value) * mix).toFixed(3));
  return { progress, dashOffset: (1 - progress) * 100, color: `rgb(${channels.join(', ')})` };
}

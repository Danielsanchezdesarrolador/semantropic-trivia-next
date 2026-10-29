export type ApprovedCode = 'M1' | 'V1' | 'A1' | 'X3' | 'W1' | 'D2' | 'L7' | 'C' | 'CLK';
export function navigationSound(from: string, to: string, intent: 'open' | 'back' = 'open'): 'M1' | 'V1' | null {
  return from === to ? null : intent === 'back' ? 'V1' : 'M1';
}
/** Absolute slots from the existing 20 s deadline; no catch-up or pitch change. */
export function clockSlot(remaining: number): number | null {
  if (remaining <= 0) return null;
  if (remaining > 10000) return Math.floor((20000 - Math.min(20000, remaining)) / 2000);
  if (remaining > 5000) return 5 + Math.floor((10000 - remaining) / 1000);
  if (remaining > 2000) return 10 + Math.floor((5000 - remaining) / 650);
  return 15 + Math.floor((2000 - remaining) / 350);
}

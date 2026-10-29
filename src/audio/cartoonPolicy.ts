/** Solo aperturas reales de Colección; jamás respuestas o resultados locales. */
export function isCartoonOpening(from: string, to: string): boolean {
  return from !== to && to === 'collection';
}

export function safeEffectsVolume(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value)) : 0.4;
}

/** Solo aperturas reales de Colección; jamás respuestas o resultados locales. */
export function isCartoonOpening(_from: string, _to: string): boolean {
  // HF1: Colección conserva navegación, sin click ni efecto de entrada.
  // Cartoon 6 se conserva reservado hasta otro evento expresamente autorizado.
  return false;
}

export function safeEffectsVolume(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value)) : 0.4;
}

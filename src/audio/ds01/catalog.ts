export const families = {
  button: { prefix: 'POP01_BOTON', label: 'Botón / navegación', variants: ['A', 'B', 'C'] },
  selection: { prefix: 'POP02_SELECCION', label: 'Seleccionar respuesta', variants: ['A', 'B'] },
  correct: { prefix: 'TIKI01_ACIERTO', label: 'Acierto', variants: ['A', 'B', 'C'] },
  incorrect: { prefix: 'TOOT01_ERROR', label: 'Error de pregunta', variants: ['A', 'B', 'C'] },
  timeout: { prefix: 'POP03_TIEMPO', label: 'Tiempo agotado', variants: ['A', 'B'] },
} as const;
export type SoundEvent = keyof typeof families;
export type Variant = 'A' | 'B' | 'C';
export const soundEvents = Object.keys(families) as SoundEvent[];
export const filenames = soundEvents.flatMap(id => families[id].variants.map(v => `${families[id].prefix}_${v}.mp3`));
export function soundFilename(id: SoundEvent, variant: Variant) {
  if (!(families[id].variants as readonly string[]).includes(variant)) throw Error('Variante no disponible');
  return `${families[id].prefix}_${variant}.mp3`;
}

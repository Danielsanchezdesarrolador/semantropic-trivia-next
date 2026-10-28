/** Recursos visuales originales del kit B03-B01 aprobado para INTEGRACIÓN de preview.
 * SVG vectoriales independientes: no se usa un screenshot completo de la UI.
 * Mantener los PNG originales en el ZIP de continuidad hasta gate de revisión.
 */
export const quizAssetBase = '/assets/quiz/b03-b01/';

export const quizAsset = (name: string): string => `${quizAssetBase}${name}.svg`;
export const questionSurface = quizAsset('panel_pregunta');
export const backSurface = quizAsset('boton_volver');
export const answerSurfaces = {
  normal: quizAsset('boton_respuesta_normal'),
  selected: quizAsset('boton_respuesta_seleccionada'),
  correct: quizAsset('boton_respuesta_correcta'),
  incorrect: quizAsset('boton_respuesta_incorrecta'),
} as const;
export type AnswerAppearance = keyof typeof answerSurfaces;

export const timerSurfaces = {
  normal: quizAsset('temporizador_normal'),
  alert: quizAsset('temporizador_alerta'),
  urgent: quizAsset('temporizador_urgente'),
} as const;
export type TimerAppearance = keyof typeof timerSurfaces;

export const progressSurfaces = {
  done: quizAsset('progreso_completada'),
  now: quizAsset('progreso_actual'),
  pending: quizAsset('progreso_pendiente'),
} as const;

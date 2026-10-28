/**
 * B02-C2: recursos candidatos de la composición visual. Ninguno se promueve
 * al registro oficial de arte aprobado sin revisión explícita del Director.
 * Cada ruta contiene una ilustración SVG independiente, no el mockup completo.
 */
export const previewAssets = {
  plaza: '/assets/home/environment/plaza-day.svg',
  night: '/assets/home/environment/sky-night.svg',
  islands: '/assets/home/environment/islands.svg',
  logo: '/assets/home/brand/logo.svg',
  leftHero: '/assets/home/characters/left-hero.svg',
  rightHero: '/assets/home/characters/right-hero.svg',
  robot: '/assets/home/characters/robot.svg',
  crystalCyan: '/assets/home/decorations/crystal-cyan.svg',
  crystalWarm: '/assets/home/decorations/crystal-warm.svg',
} as const;

export type PreviewAsset = keyof typeof previewAssets;
export const previewAssetStatus = 'candidate-not-approved' as const;
